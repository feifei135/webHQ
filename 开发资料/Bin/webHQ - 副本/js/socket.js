/**
 * Created by Lenovo on 2017/8/9.
 */

var blockname = [
    {"type": 20485, "rankingtype": 61, "blockname": "沪深A股", "item": 5, "direct": 0, "start": 0, "count": 20},
    {"type": 20485, "rankingtype": 61, "blockname": "沪市B股", "item": 5, "direct": 0, "start": 0, "count": 20}
];

var codeList = {"type": 40963};

var codeTable;

function WebSocketAPI() {
    "use strict";
    var socket = null;
    var readyState = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
    var connection = "{\"type\":8193,\"address\":\"data11.120918.com\",\"port\":6051}"; // 服务器配置
    var login = "{\"type\": 16385}"; // 登陆口令
    var mLineQuery = "{\"type\":45070,\"code\":$code,\"lastvolume\":0}"; // 分时线请求串
    var kLineQuery = "{\"type\":20490,\"code\":$code,\"period\":$period,\"mode\":1,\"offset\":0,\"num\":$num,\"multiday\":5,\"power\":0}";  // K线请求串
    var logined = false;
    // 订阅行情请求串
    var getOrderQuery = function (codes) {
        return "{\"type\":45057,\"group\":\"test\",\"codes\":[" + codes + "]}";
    };
    // 页面加载时 连接行情服务器。
    try {
        if (socket == null || socket.readyState > 1) {
            socket = new WebSocket('ws://127.0.0.1:6011');
        } else {
            showContent('已经连接啦，请不要重复连接！');
        }
    } catch (e) {
        showContent('' + e.data);
        return;
    }
    socket.onopen = function (evt) {
        socket.send(connection);
    };
    socket.onerror = function (evt) {
        logined = false;
    };
    socket.onclose = function (evt) {
    };
    socket.onmessage = function (evt) {
        var data = eval("(" + evt.data + ")");  // 将字符数据转换成json对象
        if (!data && !data.type) {
            return;
        }
        // 数据回调
        switch (data.type) {
            case 8193 :
                socket.send(login);
                break;
            case 16385 :
                logined = true;
                socket.requetCode();
                socket.requestQS();
                break;
            case 45058 :
                // showContent("个股行情数据：" + evt.data);
                break;
            case 45070 :
                // showContent("分时线数据：" + evt.data);
                break;
            case 20490 :
                // showContent("K线数据：" + evt.data);
                break;
            case 20485 :
                break; // rank
            case 20486 :
                create_quotation_sheet(data);
                break; // 行情报价表数据
            case 40963:
                codeTable = data["codetable"];
                break;
        }
    };

    // 请求股票行情
    socket.requestQuote = function (codes) {
        logined && socket.send(getOrderQuery(codes));
    };
    // 请求分时线
    socket.requestMLine = function (code) {
        logined && socket.send(mLineQuery.replace("$code", code));
    };
    // 请求K线
    socket.requestKLine = function (code, period, num) {
        logined && socket.send(kLineQuery.replace("$code", code).replace("$period", period ? period : 8).replace("$num", num ? num : 241));
    };

    //行情报价表
    socket.requestQS = function () {
        logined && socket.send(JSON.stringify(blockname[0]));
    };
    //代码表
    socket.requetCode = function () {
        logined && socket.send(JSON.stringify(codeList));
    };

    return socket;
}
var webSocket = new WebSocketAPI();

function getQuote() {
    webSocket.requestQuote(document.getElementById("codes").value);
}

function getMline() {
    webSocket.requestMLine(document.getElementById("codes").value);
}

function getKline() {
    webSocket.requestKLine(document.getElementById("codes").value);
}
/**
 * 行情报价表
 */
function create_quotation_sheet(data) {

    $("#A table").remove();

    var quotes = data.quotes;
    var tableTpl = "<table><th>序号</th><th>代码</th><th>名称</th><th>最新价(RMB)</th><th>涨跌额</th><th>涨跌幅</th>" +
        "<th>今开</th><th>最高</th><th>最低</th><th>作收</th><th>成交量(股)</th><th>成交额</th></table>";
    $("#A").append(tableTpl);

    //证券代码,证券名称,数据时间,昨收，开，高，低，新，成交量，成交额,涨跌额,涨跌幅
    var code, codename, datatime, yc, open, max, min, last, volume, turnover, changeamount, pricelimit;

    var trTpl = "";
    $.each(quotes, function (i, o) {

        var a_RowData = o.split(",");

        code = a_RowData[0],
            datatime = parseFloat(a_RowData[1]+"000"),
            yc = parseFloat(a_RowData[2]).toFixed(2),
            open = parseFloat(a_RowData[3]).toFixed(2),
            max = parseFloat(a_RowData[4]).toFixed(2),
            min = parseFloat(a_RowData[5]).toFixed(2),
            last = parseFloat(a_RowData[6]).toFixed(2),
            volume = (parseFloat(a_RowData[7]) / 10000).toFixed(3) + "万",
            turnover = (parseFloat(a_RowData[8]) / 100000000).toFixed(3) + "亿";


        var diff = Math.abs(last - yc);

        if (last > yc) {
            changeamount = "+" + diff.toFixed(2),
                pricelimit = (diff / yc * 100.0).toFixed(2);
            pricelimit = "+" + pricelimit + "%";
        } else if (last < yc) {
            changeamount = "-" + diff.toFixed(2),
                pricelimit = "-" + (diff / yc * 100.0.toFixed(2)) + "%";
        } else {
            changeamount = parseFloat(last - yc).toFixed(2),
                pricelimit = diff / yc * 100.0.toFixed(2) + "%";
        }

        $.each(codeTable, function (i, o) {
            var a_o = o.split(",");
            if (a_o[0] == code) {
                codename = a_o[1];
            }
        });
        //未开盘
        if (open == "0.00") {
            open = "-", max = "-", min = "-", last = "-", volume = "-", turnover = "-", pricelimit = "-", changeamount = "-";
        }

        trTpl += "<tr><td>" + i + "</td><td>" + code + "</td><td>" + codename + "</td><td>" + last + "</td><td>" + changeamount + "</td><td>" + pricelimit + "</td>" +
            "<td>" + open + "</td><td>" + max + "</td><td>" + min + "</td><td>" + yc + "</td><td>" + volume + "</td><td>" + turnover + "</td></tr>";

    });

    $("#A table").append(trTpl);

    $("#A table").click(function (event) {
        var target = event.target;
        var code;
        if (target.tagName == "TR") {
            code = $(target).find("td").eq(1).text();
        } else if (target.tagName == "TD") {
            code = $(target).parent().find("td").eq(1).text();
        }
        window.open("http://127.0.0.1/webHQ/chart.html?code=" + code + "&yc=" + yc + "&datatime=" + datatime);
    })

}