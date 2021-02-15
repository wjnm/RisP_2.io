/*
 * @Date: 2021-01-26 16:03:43
 * @LastEditors: echo.cheng
 * @LastEditTime: 2021-02-02 10:47:29
 * @Description:
 */
(function () {
  console.log("当前访问地址：", location.href);
  var typeArr = ["absolute", "fixed"];
  // 初始值
  //   设置容器 宽高位置
  var divWidth = "193px";
  var divHeight = "277px";
  var divLeft = 0;
  var divTop = 0;
  var divType = typeArr[0];
  var zIndex = 999999;
  // 设置appId 和年龄限制
  var appId = "10001";
  var ageLimit = "8+";
  var mainBody = "iDreamSkyGames";

  var imgSrc = "http://dl.gamdream.com/website/" + ageLimit + ".png";
  var linkUrl =
    "//tsf-pro-1251001060.cos.ap-guangzhou.myqcloud.com/MS/" +
    appId +
    "/" +
    mainBody +
    "/AgeTips.html";
  // 维护人员只需要维护这份数据 webArr

  var webArr = [
    // 梦幻花园 安卓10313 iOS 10959 //公用一个就好
    {
      url: "tp2.uu.cc",
      appId: 10313,
      ageLimit: "8+",
      mainBody: "iDreamSkyGames",
      divWidth: "180px",
      divHeight: "120px",
      divLeft: "93.7%",
      divTop: "60px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 梦幻花园 11828
    {
      url: "hy.uu.cc",
      appId: 11828,
      ageLimit: "8+",
      mainBody: "iDreamSkyGames",
      divWidth: "150px",
      divHeight: "90px",
      divLeft: "93.7%",
      divTop: "7px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 梦幻花园 90131
    {
      url: "jy.uu.cc",
      appId: 90131,
      ageLimit: "8+",
      mainBody: "iDreamSkyGames",
      divWidth: "180px",
      divHeight: "120px",
      divLeft: "93.7%",
      divTop: "70px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 三剑豪  10417
    {
      url: "3.uu.cc/home",
      appId: 10417,
      ageLimit: "16+",
      mainBody: "iDreamSkyGames",
      divWidth: "100px",
      divHeight: "120px",
      divLeft: "93.5%",
      divTop: "520px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 三剑豪  10417
    {
      url: "3.uu.cc",
      appId: 10417,
      ageLimit: "16+",
      mainBody: "iDreamSkyGames",
      divWidth: "100px",
      divHeight: "120px",
      divLeft: "88.54%",
      divTop: "0px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 地铁跑酷 安卓10389 iOS 10667
    {
      url: "pao.uu.cc",
      appId: 10389,
      ageLimit: "12+",
      mainBody: "iDreamSkyGames",
      divWidth: "180px",
      divHeight: "120px",
      divLeft: "93.7%",
      divTop: "60px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 决战玛法 90265
    {
      url: "cq.uu.cc",
      appId: 90265,
      ageLimit: "16+",
      mainBody: "iDreamSkyGames",
      divWidth: "180px",
      divHeight: "120px",
      divLeft: "87.60%",
      divTop: "580px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 纪念碑谷 KV版 11574 Android 10841
    {
      url: "mv.uu.cc",
      appId: 11574,
      ageLimit: "8+",
      mainBody: "iDreamSkyGames",
      divWidth: "80px",
      divHeight: "100px",
      divLeft: "59.90%",
      divTop: "55px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 999999, 
    },
    // 纪念小动物之星  600023
    {
      url: "sar.idreamsky.com",
      appId: 600023,
      ageLimit: "12+",
      mainBody: "iDreamSky",
      divWidth: "180px",
      divHeight: "120px",
      divLeft: "430px",
      divTop: "160px",
      divType: 0, // 0 固定布局，1 滚动布局
	  zIndex: 98, 
    },
  ];
  // 创建入口按钮
  function createBtn() {
    for (var i = 0; i < webArr.length; i++) {
      var item = webArr[i];
      if (location.href.indexOf(item.url) > -1) {
        //   设置容器 宽高位置
        divWidth = item.divWidth;
        divHeight = item.divHeight;
        divLeft = item.divLeft;
        divTop = item.divTop;
        divType = typeArr[item.divType];
		zIndex = item.zIndex;
        // 设置具体appId
        appId = item.appId;
        ageLimit = item.ageLimit;
        mainBody = item.mainBody;
        imgSrc = "http://dl.gamdream.com/website/" + ageLimit + ".png";
        linkUrl =
          "//tsf-pro-1251001060.cos.ap-guangzhou.myqcloud.com/MS/" +
          appId +
          "/" +
          mainBody +
          "/AgeTips.html";
        break;
      }
    }
    //创建一个div
    var div = document.createElement("div");
    // div.innerHTML = "<img src=" + imgSrc + " >"; //设置显示的数据，可以是标签．
    div.style =
       ";cursor:pointer;z-index:"+
      zIndex +
      ";position:" +
      divType +
      ";width:" +
      divWidth +
      ";height:" +
      divHeight +
      ";left:" +
      divLeft +
      ";top:" +
      divTop +
      ";background:url(" +
      imgSrc +
      ") no-repeat;" +
      ";background-size:contain;"; //设置显示的数据，可以是标签．
    div.onclick = function (param) {
      createPopup();
    };
    
    //动态插入到body中
    document.body.insertBefore(div, document.body.lastChild);
  }
  function createPopup() {
    var popup = document.createElement("div");
    popup.style = "width: 100%;height: 100%;position:fixed;z-index:9999999999;top:0;left:0;background-color:rgba(0,0,0,0.8);display:flex;justify-content: center;align-items: center;";
    // 窗体内容
    var contentBox = document.createElement("div");
    contentBox.style = "width:800px;height:490px;border-radius: 24px;background:white;padding-bottom: 40px;";
    // iframe内容
    var iframe = document.createElement('iframe'); 
    iframe.style="width: 100%;height: 100%;border-radius: 24px;border:none;"
    iframe.src= linkUrl;  
    var closeBtn = document.createElement("div");
    closeBtn.style="width:60px;height:60px;margin: 55px auto;cursor:pointer;background:url('http://dl.gamdream.com/website/cbtn.png') no-repeat;"
    popup.onclick = function (param) {
      document.body.removeChild(popup)
    };
    closeBtn.onclick = function (param) {
      document.body.removeChild(popup)
    };
    contentBox.appendChild(iframe);
    contentBox.insertBefore(closeBtn, popup.lastChild);
    popup.insertBefore(contentBox, popup.lastChild);
    document.body.insertBefore(popup, document.body.lastChild);
  }
  createBtn();
})();
