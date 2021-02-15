var eventParams = [
    "CustomEvent",
    "GameSvrId",
    "dtEventTime",
    "vGameId",
    "vGameAppkey",
    "PlatId",
    "vUsersid",
    "ClientVersion",
    "ChannelID",
    "DeviceId",
    "ZoneId",
    "EventParam",
    "EventId",
    "EventTime",
    "EventParamValue",
    "DlogSdkVersion",
    "vOpenId",
    "vGameUsersid",
    "extStr1",
    "SdkVersion",
    "band_userid",
    "sessionIdRequest",
    "buildNumber",
];

function debounce(fn, delay) {
    var timer;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay || 300);
    };
}

function safeJSONParse(value, errorReturn) {
    try {
        errorReturn = JSON.parse(value);
    } catch (e) {
        console.log(e);
    } finally {
        return errorReturn;
    }
}

var storage = (function () {
    var support = localStorage && typeof localStorage.setItem === "function";
    return {
        get: function (key, defaultValue) {
            if (support) {
                return safeJSONParse(
                    localStorage.getItem(key),
                    defaultValue
                );
            }

            return "";
        },

        set: function (key, value) {
            if (support) {
                return localStorage.setItem(key, JSON.stringify(value || ""));
            }
        },
    };
})();

function uuid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
    );
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join("");
}

function getTime() {
    var date = new Date();

    return (
        "" +
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
    );
}

function getParameterMap() {
    var map = {},
        tmp = [];
    var search = location.search.substr(1);
    //hash ?
    if (!search) {
        var index = location.href.indexOf("?");
        if (index > -1) {
            search = location.href.slice(index + 1);
        }
    }
    search.split("&").forEach(function (item) {
        tmp = item.split("=");
        map[tmp[0]] = decodeURIComponent(tmp[1]);
    });
    return map;
}

function getParameterByName(parameterName) {
    var parameterMap = getParameterMap();
    return parameterMap[parameterName] || "";
}

function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
        return unescape(decodeURIComponent(arr[2]));
    }

    return "";
}

function setCookie(name, value, time) {
    var exp = new Date();
    exp.setTime(exp.getTime() + time);
    document.cookie =
        name +
        "=" +
        escape(value) +
        ";expires=" +
        exp.toGMTString() +
        ";path=/";
}

// cookie存在时从中获取，否则创建一个新的并存进cookie中
function getUUIDFormCookie() {
    var _uid = "";
    if (getCookie("dlogUUID")) {
        _uid = getCookie("dlogUUID");
    } else {
        _uid = uuid();
        setCookie("dlogUUID", _uid, 60 * 60 * 1000 * 24 * 365); // 缓存一年
    }
    return _uid;
}

var uid = getUUIDFormCookie();
var ip = "";

function getExtStr(extendParams) {
    var ret = [];
    var SourcePlatform = getParameterByName("SourcePlatform");
    var UserId = getCookie("DedeUserID");
    var params = extendParams || {};
    params.pageViewIP = ip;
    params.UserCookie = uid;
    params.UserAgent = window.navigator.userAgent.replace(",", " ");

    if (SourcePlatform) {
        params.SourcePlatform = SourcePlatform;
    }

    if (UserId) {
        params["player_id"] = UserId;
    }

    for (var p in params) {
        ret.push(p + "=" + params[p]);
    }

    return ret.join(",");
}

function getParams(EventParam, EventId, extendParams) {
    var obj = {
        CustomEvent: "CustomEvent",
        GameSvrId: "",
        dtEventTime: getTime(),
        vGameId: "600023",
        vGameAppkey: "VmwZN5BtLoUlEHEDpD8X",
        PlatId: 3,
        vUsersid: uid,
        ClientVersion: "",
        ChannelID: getParameterByName("SourcePlatform"),
        DeviceId: "",
        ZoneId: "",
        EventParam: EventParam,
        EventId: EventId,
        EventTime: getTime(),
        EventParamValue: "",
        DlogSdkVersion: "",
        vOpenId: "",
        vGameUsersid: "",
        extStr1: getExtStr(extendParams),
        SdkVersion: "",
        band_userid: "",
        sessionIdRequest: "",
        buildNumber: "",
    };

    return eventParams
        .map(function (item) {
            return obj[item];
        })
        .join("|");
}

function dataReport(EventParam, EventId, extendParams) {
    function fn() {
        var params = getParams(EventParam, EventId, extendParams || {});

        $.ajax({
            url: "https://dlog-h5.uu.cc",
            type: "POST",
            dataType: "json",
            data: params,
            success: function (res) {},
            error: function (res) {},
        });
    }

    if (!ip) {
        return $.ajax({
            url: "/plus/get_ip.php",
            type: "get",
            success: function (res) {
                ip = res;
                fn();
            },
        });
    }
    return fn();
}

var close = layer.close;
layer.close = function (e) {
    if ($("#layui-layer" + e + " #login_box_c").css("display") === "block") {
        dataReport("LoginBtnClose", "Login");
    }
    if ($("#layui-layer" + e + " #yuyue_box_c").css("display") === "block") {
        dataReport("PlatformClose", "yuyue");
    }

    if ($("#layui-layer" + e + " #active_box_c").css("display") === "block") {
        dataReport("active", "ActiveClose");
    }
    close.call(layer, e);
};

$(function () {
    dataReport("PageView", "PageViewInfo");

    var clientWidth = document.documentElement.clientWidth;
    window.musicHtml = $("#music-audio").get(0);
    clientWidth < 1900 &&
        $("body").css({ zoom: (clientWidth / 1920).toFixed(3) });
    var playMusic = true;
    $("body").on("click", function () {
        if (playMusic) {
            play();
            playMusic = false;
        }
    });
    $(window).on("scroll", function () {
        if (playMusic) {
            play();
            playMusic = false;
        }
        var scroll = $(this).scrollTop();
        $(".mainPage").each(function () {
            var loutitop = $(".mainPage").eq($(this).index()).offset()
                ? $(".mainPage").eq($(this).index()).offset().top - 20
                : 0;
            if (scroll == 0) {
                $("#nav li").removeClass("current");
                $("#nav").children().eq(0).addClass("current");
            } else if (loutitop > scroll) {
                $("#nav li").removeClass("current");
                $("#nav li").eq($(this).index()).addClass("current");
                return false;
            }
        });
    });

    $(window).on(
        "scroll",
        debounce(function () {
            dataReport("SlideUp", "index");
        })
    );

    $("#nav li").on("click", function () {
        var loutitop = $(".mainPage").eq($(this).index()).offset().top - 60;
        $("html,body").animate({
            scrollTop: loutitop,
        });
    });
});
function open_page(open_url) {
    if (!open_url) return false;
    window.open(open_url);
    return true;
}

function show_msg(msg, loading, time, end) {
    time = time || 3;
    end = end || function () {};
    loading && layer.close(loading);
    layer.open({
        anim: -1,
        isOutAnim: false,
        content: msg,
        skin: "msg",
        time: time,
        end: end,
    });
}
jQuery(".hl_box02").slide({
    titCell: ".hd li",
    mainCell: ".bd",
    titOnClassName: "on",
});
jQuery(".hl_memebr01").slide({
    mainCell: ".cases",
    effect: "leftLoop",
    vis: 6,
});
var swiper = new Swiper(".hl_slide1", {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: true,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
var swiper = new Swiper(".hl_slide3", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next2",
        prevEl: ".swiper-button-prev2",
    },
});
var swiper = new Swiper(".swiper-tese", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next2",
        prevEl: ".swiper-button-prev2",
    },
    pagination: {
        el: ".swiper-pagination2",
        clickable: true,
    },
    coverflowEffect: {
        rotate: 25,
        stretch: 150,
        depth: 150,
        modifier: 1,
        slideShadows: true,
    },
});

function pause() {
    $("#music").removeClass("musicdefault");
    $("#music_bg").css("backgroundSize", "0");
    var audio = $("#music-audio").get(0);
    audio && audio.pause();
}
function play() {
    $("#music").addClass("musicdefault");
    $("#music_bg").css("backgroundSize", "100%");
    var audio = $("#music-audio").get(0);
    audio && audio.play();
}

//视频弹层
$(".play_video").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        scrollbar: false,
        type: 1,
        title: false,
        closeBtn: 1,
        shade: 0.8,
        shadeClose: true,
        skin: "hl_agent_box",
        area: ["960px", "540px"], //宽高
        content:
            '<video style="width:100%;height:100%;"  autoplay="" poster="" src="' +
            source +
            '" controls="controls"></video>',
        success: function (layero, index) {
            pause();
        },
        cancel: function (index, layero) {
            play();
        },
    });
});
//首页视频弹层
$(".indexplay_video").on("click", function (event) {
    dataReport("VideoTap", "index");
    event.preventDefault();
    event.stopPropagation();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        scrollbar: false,
        type: 1,
        title: false,
        closeBtn: 1,
        shade: 0.8,
        shadeClose: true,
        skin: "hl_agent_box",
        area: ["960px", "540px"], //宽高
        offset: ["50%", "50%"],
        content:
            '<video style="width:100%;height:100%;"  autoplay="" poster="" src="' +
            source +
            '" controls="controls"></video>',
        success: function (layero, index) {
            pause();
        },
        cancel: function (index, layero) {
            play();
        },
    });
});
// 查看图片

// 预约弹层
$(".yuyue").on("click", function () {
    dataReport("yuyueBtn", "yuyue");
    event.preventDefault();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        type: 1,
        title: false,
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        skin: "yuyue_box",
        content: $("#yuyue_box_c"),
    });
});
// 已预约弹层
$(".yuyue_y").on("click", function () {
    event.preventDefault();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        type: 1,
        title: false,
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        skin: "yuyue_box",
        content: $("#yuyue_y_box_c"),
    });
});

$("#yuyue_y_box_c .sum_btn")
    .find("a")
    .click(function () {
        dataReport("jumpWenjuan", "wenjuan", {
            PhoneNumber: storage.get("PhoneNumber", ""),
        });
    });

// 已预约成功弹层
$(".yuyue_yc").on("click", function () {
    event.preventDefault();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        type: 1,
        title: false,
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        skin: "yuyue_box",
        content: $("#yuyue_yc_box_c"),
    });
});
if (/点击登录/.test($("#_userlogin").text())) {
    $(".activation > a").addClass("login");
}
// 登录弹层
$(".login").on("click", function () {
    event.preventDefault();
    var source = $(this).attr("name");
    layer.open({
        anim: -1,
        isOutAnim: false,
        type: 1,
        title: false,
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        skin: "yuyue_box",
        content: $("#login_box_c"),
    });
    storage.set("TriggerLoginNodeClass", $(this).attr("class"));
});

// 点击发送验证码
$("#btnSendCode").on("click", function () {
    var tel = $("#tel").val();
    if (tel == "") {
        layer.msg("请填写手机号码");
        return false;
    }
    if (!check_mobile(tel)) {
        layer.msg("请输入正确的手机号码");
        return false;
    }
    dataReport("yzmBtn", "Login");
    sendMessage();
    $.ajax({
        url: "login/login.php?mod=sendsms",
        type: "POST",
        dataType: "json",
        data: { tel: tel },
        success: function (res) {
            console.log(res);
            if (res.code == 108035) {
                layer.msg(res.desc);
            } else if (res.code == 0) {
                layer.msg("验证码已发送");
            } else {
                layer.msg(res.desc);
            }
        },
        error: function (res) {
            layer.msg(res);
        },
    });
});
var count = 60;
var timer;
var curCount;

function sendMessage() {
    curCount = count;
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").addClass("f_c");
    $("#btnSendCode").val(+curCount + "秒再获取");
    timer = window.setInterval(SetRemainTime, 1000);
}
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(timer);
        $("#btnSendCode").removeAttr("disabled");
        $("#btnSendCode").removeClass("f_c");
        $("#btnSendCode").val("重新发送");
    } else {
        curCount--;
        console.log(curCount);
        $("#btnSendCode").val(+curCount + "秒再获取");
    }
}

// 点击登录
$(".login_submit").on("click", function () {
    var tel = $("#tel").val();
    var yzm = $("#yzm").val();
    if (tel == "") {
        layer.msg("请填写手机号码");
        return false;
    }
    if (!check_mobile(tel)) {
        layer.msg("请输入正确的手机号码");
        return false;
    }
    if (yzm == "") {
        layer.msg("请填写验证码");
        return false;
    }
    storage.set("PhoneNumber", tel);
    dataReport("LoginBtn", "Login", { PhoneNumber: tel });
    $.ajax({
        url: "login/login.php?mod=login",
        type: "POST",
        dataType: "json",
        data: { tel: tel, yzm: yzm },
        success: function (res) {
            console.log(res);
            if (res == 404) {
                layer.msg("请输入正确的验证码");
            } else {
                storage.set("LastLoginTime", new Date().getTime());
                layer.msg("登陆成功");
                window.location.reload();
            }
        },
        error: function (res) {
            layer.msg("登陆失败");
        },
    });
});

// 点击预约
$(".yy_submit").on("click", function () {
    var os = $("#terminal").val();
    if (os == "") {
        layer.msg("请选择操作系统");
        return false;
    }
    dataReport("PlatformSend", "yuyue");
    // ../plus/yuyue/yuyue.php
    $.ajax({
        url: "plus/yuyue/yuyue.php",
        type: "POST",
        dataType: "json",
        data: {
            os: os,
            SourcePlatform: getParameterByName("SourcePlatform"),
            cookie: uid,
        },
        success: function (res) {
            if (res == 1001) {
                layer.msg("此手机号已预约过！");
            } else {
                // msg = "预约成功";
                // end = open_page(res.yylink);
                // layer.closeAll();
                // show_msg(msg, null, null, end);
                dataReport("jumpWenjuan", "wenjuan", {
                    PhoneNumber: storage.get("PhoneNumber", ""),
                });
                layer.closeAll();
                // layer.msg("预约成功");
                // open_page(res.yylink);
                //TODO
                location.href = res.yylink;
            }
        },
        error: function (res) {
            layer.msg("预约失败");
        },
    });
    // layer.msg('已预约');
    // layer.closeAll();
});

function check_mobile(s) {
    var regu = /^[1][3|8|4|5|7|9|6][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}

//内容信息导航吸顶
$(document).ready(function () {
    // var navHeight = $("#hd").offset().top;
    var navFix = $("#nav-wrap");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            navFix.addClass("navFix");
        } else {
            navFix.removeClass("navFix");
        }
    });
    var sideFix = $("#side_box");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 600) {
            sideFix.addClass("sideFix");
        } else {
            sideFix.removeClass("sideFix");
        }
    });
});

//预约表单
$(".ulist .ios").addClass("active");
$(".ulist li").on("click", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
    var DataType = $(".ulist li.active").attr("data_type");
    // alert(DataType);
    $("#terminal").val(DataType);
});

$(function () {
    var activeCode = -1;
    var hasLogin = !/点击登录/.test($("#_userlogin").text());
    var hasOrder = $(".yuyue").length === 0;
    // if (hasLogin && !hasOrder) {
    //     $(".yuyue")[0] && $(".yuyue")[0].click();
    // }

    if (hasLogin && hasOrder && getParameterByName("sojumpparm")) {
        $(".yuyue_y")[0] && $(".yuyue_y")[0].click();
        dataReport("wenjuanCallback", "wenjuan", {
            PhoneNumber: storage.get("PhoneNumber", ""),
        });
        $.ajax({
            url:
                "plus/yuyue/question.php?sojumpparm=" +
                storage.get("PhoneNumber", ""),
            type: "GET",
            dataType: "json",
            success: function (res) {},
            error: function (res) {},
        });
    }

    var getDownloadUrl = function (callback) {
        $.ajax({
            url: "/plus/sar.php?mod=download",
            type: "GET",
            dataType: "json",
            success: function (res) {
                if (res.error_code == 0) {
                    callback && callback(res.data);
                }
            },
        });
    };

    var checkActive = function (callback) {
        $.ajax({
            url: "/plus/sar.php?mod=check_account_activation",
            type: "POST",
            dataType: "json",
            data: { phone: storage.get("PhoneNumber", "") },
            success: function (res) {
                if (res.error_code == 0) {
                    activeCode = res.data.result;
                    callback && callback();
                }
            },
        });
    };

    var activeAccount = function (code) {
        $.ajax({
            url: "/plus/sar.php?mod=activate_account",
            type: "POST",
            dataType: "json",
            data: { phone: storage.get("PhoneNumber", ""), code: code },
            success: function (res) {
                var status = res.data.result;
                //激活成功
                if (status == 1) {
                    dataReport("active", "ActiveSuccess", {
                        PhoneNumber: storage.get("PhoneNumber", ""),
                    });
                    $(".code-input").hide();
                    $(".active_msg").html(
                        "<span style='color: #FF5722;font-size: 22px;'>您的账号已激活</span><br>游戏将于10月19日开启测试，敬请留意<br/>短信和邮件通知"
                    );
                    $(".active_box_sumbit").text("点击加入官方QQ群：577956727");

                    //激活码错误
                } else if (status == 2 || status == 0) {
                    $(".code-input").hide();
                    $(".active_msg").html("激活码错误，请核对激活码是否正确");
                    $(".active_box_sumbit").text("返回");
                    //激活码已经被使用
                } else if (status == 3) {
                    $(".code-input").hide();
                    $(".active_msg").html("激活码已被使用");
                    $(".active_box_sumbit").text("返回");
                }
            },
        });
    };

    getDownloadUrl(function (data) {
        if(data.android_download_url){
            $("#androidDownload").attr("href", data.android_download_url);
        }

        if(data.ios_download_url){
            $("#iOSDownload").attr("href", data.ios_download_url)
        }

    });


    var $toolBtnWrapper = $("#tools-btn-wrapper").children();
    var i = 0;

    $.each($toolBtnWrapper,function(index, ele){
        if($(ele).css("display") === "inline-block"){
            i = i + 1;
        }
    })

    if(i >= 3){
        $.each($toolBtnWrapper,function(index, ele){
            $(ele).css({"width": "237px"}).find("img").css({"width": "100%"})
        })
    }

    $("#androidDownload").on("click", function () {
        dataReport("download", "DownloadBtn");
    });

    $("#iOSDownload").on("click", function () {
        dataReport("download", "DownloadBtn");
    });

    $(".activation > a").on("click", function () {
        var fn = function () {
            event.preventDefault();
            layer.open({
                anim: -1,
                isOutAnim: false,
                type: 1,
                title: false,
                shade: 0.8,
                closeBtn: 1,
                shadeClose: true,
                skin: "yuyue_box",
                content: $("#active_box_c"),
                success: function () {
                    //已经
                    if (activeCode == 1) {
                        $(".code-input").hide();
                        $(".active_msg").html(
                            "<span style='color: #FF5722;font-size: 22px;'>您的账号已激活</span><br>游戏将于10月19日开启测试，敬请留意<br/>短信和邮件通知"
                        );
                        $(".active_box_sumbit").text("点击加入官方QQ群：577956727");
                        $(".active_box_sumbit")
                            .off("click")
                            .on("click", function () {
                                // layer.close(
                                //     $(".active_box")
                                //         .parents()
                                //         .find(".layui-layer")
                                //         .attr("times")
                                // );
                                location.href = "https://jq.qq.com/?_wv=1027&k=KF56tnqi"
                            });
                        return;
                        //未激活
                    } else if (activeCode == 2) {
                        $(".active_box_sumbit")
                            .off("click")
                            .on("click", function () {
                                var btnText = $(".active_box_sumbit").text();
                                if (btnText == "确认激活") {
                                    var code = $(".code-input").val();
                                    if (!code) {
                                        layer.msg("请输入激活码");
                                        return;
                                    }
                                    dataReport("active", "ActiveSend", {
                                        PhoneNumber: storage.get(
                                            "PhoneNumber",
                                            ""
                                        ),
                                    });
                                    activeAccount(code);
                                } else if (btnText == "返回") {
                                    $(".active_msg").html("");
                                    $(".code-input").show();
                                    $(".active_box_sumbit").text("确认激活");
                                } else if (btnText == "点击加入官方QQ群：577956727") {
                                    // layer.close(
                                    //     $(".active_box")
                                    //         .parents()
                                    //         .find(".layui-layer")
                                    //         .attr("times")
                                    // );
                                    location.href = "https://jq.qq.com/?_wv=1027&k=KF56tnqi"
                                }
                            });
                    }
                },
            });
        };
        if (hasLogin) {
            checkActive(fn);
        }
        dataReport("ActiveBtn", "active");
    });

    var triggerClass = storage.get("TriggerLoginNodeClass");
    var now =  new Date().getTime();

    if (
        hasLogin &&
        now - storage.get("LastLoginTime") <= 2000 &&
        triggerClass.indexOf("activation_image_wrapper") > -1
    ) {
        $(".activation > a").click();
    }


    if (hasLogin 
        && now - storage.get("LastLoginTime") <= 2000 
        && triggerClass.indexOf("yuyue_n") > -1 
        && !hasOrder) {
        $(".yuyue")[0] && $(".yuyue")[0].click();
    }

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    var handleVisibilityChange = function() {
        if (document[hidden]) {
            pause();
        }
    };

    $(document).on(visibilityChange, handleVisibilityChange);
});
