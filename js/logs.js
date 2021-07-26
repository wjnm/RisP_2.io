function sendLogs(p,u){
	getScrollTop = function(){
		var scrollTop=0; 
		if(document.documentElement&&document.documentElement.scrollTop){ 
			scrollTop=document.documentElement.scrollTop; 
		}else if(document.body){ 
			scrollTop=document.body.scrollTop; 
		} 
		return scrollTop; 
	},
	ajax=function(param,uurl){
		 var xmlHttpReg = null;
		    if (window.ActiveXObject) {//如果是IE
		        xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
		    } else if (window.XMLHttpRequest) {
		        xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
		    }
		    if (xmlHttpReg != null) {
		        xmlHttpReg.open("GET", uurl+"?"+param, true);
		        xmlHttpReg.send(null);
		        xmlHttpReg.onreadystatechange = doResult; //设置回调函数
		    }
		    function doResult() {
		        if (xmlHttpReg.readyState == 4) {//4代表执行完成
		            if (xmlHttpReg.status == 200) {//200代表执行成功
		            }
		        }
		    }
		  
	},
	postData = function(obj){ // 转成post需要的字符串.
	    var str = "";
	    for(var prop in obj){
	    	if(window.courselist && (prop == "chapterid")){
	    		var lastcourse = null;
	    		for(var i = 0 ;i<window.courselist.length;i++){
	    			var course = window.courselist[i];
	    			var coursenext = window.courselist[i+1];
	    			if(coursenext == undefined){
	    				lastcourse = course;
	    				break;
	    			}
	    			if(course.h<=obj.h && obj.h<coursenext.h){
	    				lastcourse = course;
	    				break;
	    			}
	    		}
	    		str += prop + "=" + (lastcourse !== null?lastcourse.knowledgeid:0) + "&";
	    	}else{
	    		str += prop + "=" + obj[prop] + "&";
	    	}
	        
	    }
	    if(str.length !=0){str = str.substring(0, str.length-1);}
	    return str;
	},
	slogs=function(me){
		var nowscoll =me.getScrollTop();
		if(me.scrollheight != nowscoll){
			me.para.h=nowscoll;
			me.ajax(postData(me.para),me.url);
			me.scrollheight = nowscoll;
			
		}
	},
	para=p,
	url=u,
	scrollheight = 0;
	
	para.h=0;
	ajax(postData(para),url);
	
	window.setInterval(function () { slogs(this); }, 5000);
}

