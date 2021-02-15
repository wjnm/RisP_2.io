/*! music v1.0.0 | (c) 2017*/
/*gitupload test*/
; (function ($) {
	function CreateMusic(opts) {
		$el = $("body");
		this.isPlay = false;
		this.opts = $.extend({}, CreateMusic.DEFAULTS, opts);
		/*背景图片*/
		this.bg_base64_url = "//dl.gamdream.com/website/sar/hl_donghua/img/miscuplay.gif";
		/*音符图片*/
		this.music_base64_url = "//dl.gamdream.com/website/sar/hl_donghua/img/misuc.png";
		var op = this.opts;
		//this.addcss();
		var audio = this.getaudiodom();//获取audio控件
		var music;
		if (this.opts.type == 1) {
			music = this.getmusicdom();//获取music控件
		}
		else if (this.opts.type == 2) {
			music = this.getmusicdomtype2();//获取music控件
		}
		$el.append(audio);
		$el.append(music);
		$el.find('audio')[0].addEventListener("playing", () => {
			this.isPlay = true;
		})
		$el.find('audio')[0].addEventListener("pause", () => {
			this.isPlay = false;
		})
		if (this.opts.autoplay) {
			// var video = $("#music-audio").get(0)
			// var playPromise = video.play();
			// if (playPromise !== undefined) {
			// 	playPromise.then(_ => {
			// 		video.volume = this.opts.volume;//音量
			// 	})
			// 		.catch(error => {

			// 		});
			// }
		}
		var that = this;
		$("#music").on("click", function (event) {
			dataReport("MusicTap", "index");
			var restore = op.restore;//点击后是否复原
			if (that.isPlay) {
				$(this).removeClass("musicdefault");
				that.isPlay = false;
				$("#music-audio").get(0).pause();
				if (op.type == 2) {
					$("#music_bg").css("backgroundSize", "0");
				}
			}
			else {
				$(this).addClass("musicdefault");
				that.isPlay = true;
				$("#music-audio").get(0).play();
				if (op.type == 2) {
					$("#music_bg").css("backgroundSize", "100%");
				}
			}
			event.stopPropagation();
		});
	}
	CreateMusic.DEFAULTS = {
		type: 2,//类型  1无gif 2有
		x: "right",//X轴
		y: "top",//Y轴
		musicsrc: "#",//资源地址
		autoplay: true,//是否自动播放
		loop: true,//是否循环播放
		restore: false,//暂停后音符是否恢复原位
		volume: 1//音量 范围0.0-1.0
	}
	/*生成CSS*/
	CreateMusic.prototype.addcss = function () {
		var dom = '<style type="text/css">';
		dom += '@keyframes rotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}';
		dom += '@-moz-keyframes rotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}';
		dom += '@-webkit-keyframes rotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}';
		dom += '@-ms-keyframes rotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}';
		dom += '@-o-keyframes rotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}';
		dom += '.musicdefault{animation: rotate 1.2s linear infinite;-o-animation: rotate 1.2s linear infinite;-moz-animation: rotate 1.2s linear infinite;-webkit-animation: rotate 1.2s linear infinite;-ms-animation: rotate 1.2s linear infinite;}';
		dom += '</style>';//
		$("head").append(dom);
	}
	/*生成audio的DOM*/
	CreateMusic.prototype.getaudiodom = function () {
		var opts = this.opts;
		var audio = '<audio id="music-audio"  src="';
		audio += opts.musicsrc;
		audio += '"';
		if (opts.autoplay) {
			audio += '';
		}
		if (opts.loop) {
			audio += ' loop';
		}
		audio += '></audio>';
		return audio;
	}
	/*生成类型1的DOM*/
	CreateMusic.prototype.getmusicdom = function () {
		var opts = this.opts;
		var width = $("body,html").width();
		// var musicwidth=width/10;
		var musicwidth = 40;
		var musicdom = '<div id="music" style="position: absolute;'
		musicdom += 'width: ' + musicwidth + 'px;height: ' + musicwidth + 'px;background:url(' + this.music_base64_url + ') no-repeat center center;';
		musicdom += opts.x + ':18px;';
		musicdom += opts.y + ':10px;';
		musicdom += 'background-size: 100%;overflow: hidden;z-index: 100;cursor: pointer;"';
		if (opts.autoplay) {
			musicdom += ' class="musicdefault"';
		}
		musicdom += '></div>';
		return musicdom;
	}
	/*生成类型2的DOM*/
	CreateMusic.prototype.getmusicdomtype2 = function () {
		var opts = this.opts;
		var width = $("body,html").width();
		// var musicwidth=width/10;
		var musicwidth = 40;
		var musicdom = '<div id="music_bg" style="position: fixed;z-index:999;width:' + musicwidth * 1.5 + 'px;height:' + musicwidth * 1.5 + 'px;background:url(' + this.bg_base64_url + ') no-repeat center center;';
		if (opts.autoplay) {
			musicdom += 'background-size:100%;';
		}
		else {
			musicdom += 'background-size:0;';
		}
		musicdom += opts.x + ':10px;';
		musicdom += opts.y + ':0px;">';
		musicdom += '<div id="music" style="position: absolute;'
		musicdom += 'width: ' + musicwidth + 'px;height: ' + musicwidth + 'px;background:url(' + this.music_base64_url + ') no-repeat center center;';
		musicdom += 'left:' + musicwidth / 4 + 'px;';
		musicdom += 'top:' + musicwidth / 4 + 'px;';
		musicdom += 'background-size: 100%;overflow: hidden;z-index: 100;cursor: pointer;"';
		if (opts.autoplay) {
			musicdom += ' class="musicdefault"';
		}
		musicdom += '></div></div>';
		return musicdom;
	}
	$.extend({
		music: function (opts) {
			opts.autoplay = false
			var music = new CreateMusic(opts);
			//UC等手机浏览器屏蔽自动播放。取折中方案：当用户滑动时播放音乐
			if (opts.autoplay && !this.isPlay) {
				$('html:not("#music")').one('touchstart tap click', function () {
					$("#music-audio").get(0).play();
				})
			}
			/*页面调整大小时*/
			// window.onresize = function () {
			// 	var width=$("body,html").width();
			// 	// var musicwidth=width/10;
			// 	var musicwidth=width/40;
			// 	if($("#music").length>0)
			// 	{
			// 		$("#music").css({"width":musicwidth+"px","height":musicwidth+"px"});
			// 	}
			// 	if($("#music_bg").length>0)
			// 	{
			// 		$("#music_bg").css({"width":musicwidth*1.5+"px","height":musicwidth*1.5+"px"});
			// 		$("#music").css({"left":musicwidth/4+'px',"top":musicwidth/4+'px'});
			// 	}
			// }
		}
	})
})(jQuery)