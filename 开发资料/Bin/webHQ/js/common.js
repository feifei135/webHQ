/**
 * Created by Lenovo on 2017/8/9.
 */

var momentWeekLocal = {
    1:"周一",
    2:"周二",
    3:"周三",
    4:"周四",
    5:"周五",
    6:"周六",
    0:"周日"
};

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
// 时间戳转标准日期字符
function timeStampToDatetime(timestamp) {
    if(!timestamp && !isNaN(timestamp)) {
        return "";
    }
    var newDate = new Date();
    if (timestamp.length == 10)
    {
        newDate.setTime(timestamp * 1000);
    } else {
        newDate.setTime(timestamp);
    }
    return newDate.format('yyyy-MM-dd h:mm:ss');
}

// 时间戳转标准日期字符
function timeStampToDate(timestamp) {
    if(!timestamp && !isNaN(timestamp)) {
        return "";
    }
    var newDate = new Date();
    if (timestamp.length == 10)
    {
        newDate.setTime(timestamp * 1000);
    } else {
        newDate.setTime(timestamp);
    }
    return newDate.format('yyyy-MM-dd');
}
// 时间戳转标准时间字符
function timeStampToTime(timestamp) {
    if(!timestamp && !isNaN(timestamp)) {
        return "";
    }
    var newDate = new Date();
    if (timestamp.length == 10)
    {
        newDate.setTime(timestamp * 1000);
    } else {
        newDate.setTime(timestamp);
    }
    return newDate.format('hh:mm:ss');
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
// K线基础数据对象
function lineKObj(date, open, high, low, close, volume) {
    this.d = date;
    this.o = open;
    this.h = high;
    this.l = low;
    this.c = close ;
    this.v = volume;
}
/*
 K线数据分解
 function getKline(data) {
 var klines = [];
 if (data.klines) {
 for(var i = 0 ;i< data.klines.length; i++) {
 var sub = data.klines[i].split(",");
 klines[i] = new lineKObj(data.period > 7 ? timeStampToDate(sub[0]): timeStampToDatetime(sub[0]), sub[1], sub[2], sub[3], sub[4], sub[5]);
 }
 }
 return klines;
 }
 // 分时数据分解
 function getMline(minutes) {
 var jsonData = "";
 var lastVolume = 0;
 for(var i=0; i< minutes.length; i++) {
 var minute = minutes[i].split(",");
 jsonData = jsonData + timeStampToTime(minute[0]) + "," + (minute[2] - lastVolume) +",0," + minute[1] + ( i == minutes.length -1 ? "" : ";");
 lastVolume = minute[2];
 }
 return jsonData;
 }

 // 个股行情的 基础分解 （参考 行情数据的位置。 此方法不能使用）
 function getStockBaseInfo(quote) {
 var baseArray = quote.split(",");

 baseInfo = baseInfo.replace("$prevclose", baseArray[2]);
 baseInfo = baseInfo.replace("$quoteDatetime", timeStampToDatetime(baseArray[1])).replace("$openPrice", baseArray[3]);
 baseInfo = baseInfo.replace("$highPrice", baseArray[4]).replace("$lowPrice", baseArray[5]);
 baseInfo = baseInfo.replace("$newPrice", baseArray[6]).replace("$totalVolume", baseArray[7]);
 return baseInfo;
 }
 */