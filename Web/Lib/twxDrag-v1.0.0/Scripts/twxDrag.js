//  3d背景旋转
var threeD = {
    init: function () {
        //  <div id="threeDBack"><div id="threeDOutput" style="overflow:hidden;padding:0;"></div></div>
        //  #threeDBack{position:absolute;height:100%;width:100%;z-index:-1;}#threeDBack#threeDOutput{width:100%;height:100%;}
        var victor = new Victor("threeDBack", "threeDOutput");
        victor(["#002c4a", "#005584"]).set();
    }
};

var twxAll = {
    init: function () {
        //  全屏操作
        $('.dark-opaque').off("click").on("click", function () {
            twxAll.autoScreen(document.documentElement);
        });
    }
    //  计算字符串字节大小
    , byte_size: function (str, charset) {
        //  str：字符串；charset：字符编码，默认 'utf-8'
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if (charset === 'utf-16' || charset === 'utf16') {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0xffff) {
                    total += 2;
                } else {
                    total += 4;
                }
            }
        }
        else {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    total += 1;
                } else if (charCode <= 0x07ff) {
                    total += 2;
                } else if (charCode <= 0xffff) {
                    total += 3;
                } else {
                    total += 4;
                }
            }
        }
        return total;
    }
    //  全屏
    , fullScreen: function (e) {
        var element = e;
        if (element.requestFullscreen) { element.requestFullscreen(); }
        else if (element.msRequestFullscreen) { element.msRequestFullscreen(); }
        else if (element.mozRequestFullScreen) { element.mozRequestFullScreen(); }
        else if (element.webkitRequestFullScreen) { element.webkitRequestFullScreen(); }
    }
    //  退出全屏
    , exitFullscreen: function () {
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitExitFullScreen) { document.webkitExitFullScreen(); }
    }
    //  自动识别是否全屏
    , autoScreen: function (obj) {
        //fullScreen();
        var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
        //调用H5的api
        if (!isFull) {
            //fullScreen(document.documentElement);
            //fullScreen(document.getElementById('content'));
            twxAll.fullScreen(obj);
        } else {
            twxAll.exitFullscreen();
        }
    }
    //  对象或数组的深拷贝
    , deepClone: function (obj) {
        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = this.deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key]
                }
            }
        }
        return objClone;
    }
    //  图片转换 base64
    , getBase64Image: function (img, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    //  提醒弹出层
    , twxLayer: function (msg, cla, time) {
        var color = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
        $("body").append('<div class="twx-layer"><div class="alert alert-' + color[cla % color.length] + ' twx-alert" role="alert">' + msg + '</div></div>');
        //  默认 3秒 关闭
        setTimeout(function () {
            $(".twx-layer").remove();
        }, 1000 * (isNaN(time) ? 3 : time));
    }
    //  参数类型
    , parType: function (par) {
        Object.prototype.toString.call(par);
        //Object.prototype.toString.call('');   // [object String]
        //Object.prototype.toString.call(1);    // [object Number]
        //Object.prototype.toString.call(true); // [object Boolean]
        //Object.prototype.toString.call(Symbol()); //[object Symbol]
        //Object.prototype.toString.call(undefined); // [object Undefined]
        //Object.prototype.toString.call(null); // [object Null]
        //Object.prototype.toString.call(new Function()); // [object Function]
        //Object.prototype.toString.call(new Date()); // [object Date]
        //Object.prototype.toString.call([]); // [object Array]
        //Object.prototype.toString.call(new RegExp()); // [object RegExp]
        //Object.prototype.toString.call(new Error()); // [object Error]
        //Object.prototype.toString.call(document); // [object HTMLDocument]
        //Object.prototype.toString.call(window); //[object global] window 是全局对象 global 的引用
    }
    //  服务器时间
    , serverTime: function () {
        //  服务器时间
        $.ajax({
            url: "/Api/ServerData",
            data: { json: JSON.stringify({ "type": "TimeFormat", "data": [{ "type": "format" }] }) },
            type: "get",
            dataType: "json",
            success: function (data) {
                var time = new Date(data.msg);
                var week = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                $(".twx-time").empty();
                $(".twx-time").append('<div>' + data.msg.split(' ')[1] + '</div>');
                $(".twx-time").append('<div>' + data.msg.split(' ')[0].replace(/\//g, '-') + ' ' + week[time.getDay()] + '</div>');
                sessionStorage.setItem("ServerTime", data.msg);
                setInterval(function () {
                    time = new Date(new Date(sessionStorage.getItem("ServerTime")).getTime() + 1000);
                    var cur_time = twxAll.timeFormat(new Date(time), "yyyy-MM-dd hh:mm:ss");
                    $(".twx-time").empty();
                    $(".twx-time").append('<div>' + cur_time.split(' ')[1] + '</div>');
                    $(".twx-time").append('<div>' + cur_time.split(' ')[0].replace(/\//g, '-') + ' ' + week[time.getDay()] + '</div>');
                    sessionStorage.setItem("ServerTime", cur_time);
                }, 1000);
            }
        });
    }
    //  格式化时间
    , timeFormat: function (obj, fmt) {
        var o = {
            "M+": obj.getMonth() + 1,                 //月份
            "d+": obj.getDate(),                    //日
            "h+": obj.getHours(),                   //小时
            "m+": obj.getMinutes(),                 //分
            "s+": obj.getSeconds(),                 //秒
            "q+": Math.floor((obj.getMonth() + 3) / 3), //季度
            "S": obj.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    //  3D旋转
    , threeD: function () {
        //  <div id="threeDBack"><div id="threeDOutput" style="overflow:hidden;padding:0;"></div></div>
        //  #threeDBack{position:absolute;height:100%;width:100%;z-index:-1;}#threeDBack#threeDOutput{width:100%;height:100%;}
        var victor = new Victor("threeDBack", "threeDOutput");
        victor(["#002c4a", "#005584"]).set();
    }
    //  根据源数据 id，pid 上下级关联
    , getChildren: function (data, root) {
        //用递归的方式显示层级数据
        var nextData = [];
        for (var i = 0; i < data.length; i++) {
            if (root === data[i].pid) {
                data[i].children = twxAll.getChildren(data, data[i].id);
                nextData.push(data[i]);
            }
        }
        return nextData;
    }
}