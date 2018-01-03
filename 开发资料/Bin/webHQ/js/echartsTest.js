/**
 * Created by Lenovo on 2017/8/14.
 */


var myChart;
var KChart;
var mouseHoverPoint = 0;
var arr = new Array();

$(function () {

    var code = getQueryString("code");
    var yc = getQueryString("yc");
    var datatime = getQueryString("datatime");
    var name = getQueryString("name");
    var history_data = []; //价格历史记录
    var z_history_data = []; //涨跌幅历史记录
    var a_history_data = []; //成交量历史记录
    var K_data = []; //K线数据
    var isHoverGraph = false;

    function WebSocketAPI() {
        "use strict";
        var socket = null;
        var readyState = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
        var connection = '{"MsgType":"S101","DesscriptionType":"3","ExchangeID":"101","InstrumentID":"1048","Instrumenttype":"0"}';
        // var connection = "{\"type\":8193,\"address\":\"data11.120918.com\",\"port\":6051}"; // 服务器配置
        // var login = "{\"type\": 16385}"; // 登陆口令
        // var mLineQuery = "{\"type\":45070,\"code\":$code,\"lastvolume\":0}"; // 分时线请求串
        // var kLineQuery = "{\"type\":20490,\"code\":$code,\"period\":$period,\"mode\":1,\"offset\":0,\"num\":$num,\"multiday\":5,\"power\":0}";  // K线请求串
        // var watchMarket = {"type": 45057, "group": "test", "codes": [1600000]};
        // var logined = false;
        // 订阅行情请求串
        // var getOrderQuery = function (codes) {
        //     return "{\"type\":45057,\"group\":\"test\",\"codes\":[" + codes + "]}";
        // };
        // 页面加载时 连接行情服务器。
        try {
            if (socket == null || socket.readyState > 1) {
                //ws://127.0.0.1:6011  
                socket = new WebSocket('ws://103.66.33.31:443');
            } else {
                console.log('已经连接啦，请不要重复连接！');
            }
        } catch (e) {
            console.log('' + e.data);
            return;
        }
        socket.onopen = function (evt) {
            socket.send(connection);
        };
        socket.onerror = function (evt) {
            logined = false;
        };
        socket.onclose = function (evt) {
            socket.close();
        };
        socket.onmessage = function (evt) {
            if(!evt || !evt.data ){
                return;
            }
            console.log(evt)
            switch(evt.data.MsgType){
                case "Q619":
                // socket.send();
                c_Mline(evt.data);
            }
            // arr.push(data);
            // var data = eval("(" + evt.data + ")");  // 将字符数据转换成json对象
            // console.log(data)
            // if (!data && !data.type) {
            //     return;
            // }
            // 数据回调
            // switch (data.type) {
            //     case 8193 :
            //         socket.send(login);
            //         break;
            //     case 16385 :
            //         logined = true;
            //         socket.requestMLine(code);
            //         socket.watchMarket(code);
            //         socket.requestKLine("1600000", 8, 100);
            //         break;
            //     case 45058 :
            //         // showContent("个股行情数据：" + evt.data);
            //         c_Mline(data["quotes"], "add");
            //         break;
            //     case 45070 :
            //         // showContent("分时线数据：" + evt.data);
            //         c_Mline(data["minutes"]);
            //         // socket.requestMLine(code);
            //         break;
            //     case 20490 :
            //         KLine(evt.data);
            //         break;
            //     case 20485 :
            //         break; // rank
            //     case 20486 :
            //         break; // 行情报价表数据
            //     case 40963:
            //         break;
            // }
        };

        // 请求股票行情
        // socket.requestQuote = function (codes) {
        //     logined && socket.send(getOrderQuery(codes));
        // };
        // // 请求分时线
        // socket.requestMLine = function (code) {
        //     logined && socket.send(mLineQuery.replace("$code", code));
        // };
        // // 请求K线
        // socket.requestKLine = function (code, period, num) {
        //     logined && socket.send(kLineQuery.replace("$code", code).replace("$period", period ? period : 8).replace("$num", num ? num : 241));
        // };
        // //订阅行情
        // socket.watchMarket = function (code) {
        //     logined && socket.send(JSON.stringify(watchMarket));
        // };

        return socket;
    }


    var webSocket = new WebSocketAPI();
    var zoom = 10;
    var start = 0;
    var count = 0;
    var interval = 0;
    var c_data = [];

    function c_Mline(data, type) {
        if (data) {
            if (type == "add") {
                yc = parseFloat(yc);
                var a_lastData = data[0].split(",");
                var last_x_c = moment(c_data[history_data.length - 1]).format("HH:mm"); //当前画点画到的最后一个时间段
                var last_dataTime = moment(parseFloat(a_lastData[1] + "000")).format("HH:mm"); //行情最新时间
                var zVale = parseFloat(((parseFloat(a_lastData[6]) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2)); //行情最新涨跌幅
                var aValue = parseFloat(a_lastData[7]); //最新成交价
                if (last_x_c == last_dataTime) {
                    history_data[history_data.length - 1] = parseFloat(a_lastData[6]);
                    z_history_data[z_history_data.length - 1] = parseFloat(zVale);
                    a_history_data[z_history_data.length - 1] = parseFloat(aValue);
                } else {
                    history_data.push(parseFloat(a_lastData[6]));
                    z_history_data.push(parseFloat(zVale));
                    a_history_data.push(parseFloat(aValue));
                }

                var marktToolData = [
                    history_data[history_data.length - 1],
                    z_history_data[z_history_data.length - 1],
                    a_history_data[a_history_data.length - 1],
                    moment(parseFloat(c_data[c_data.length - 1])).format("YYYY-MM-DD HH:mm")
                ];
                set_marketTool(marktToolData); //设置动态行情条

                var fvalue, r1;
                fvalue = parseFloat(a_lastData[6]);
                r1 = Math.abs(fvalue - parseFloat(yc));
                if (r1 > interval) {
                    interval = r1;
                    var minY = (yc - interval).toFixed(2);
                    var middleY = yc.toFixed(2);
                    var maxY = (yc + interval).toFixed(2);
                    var split = parseFloat(((maxY - minY) / 6).toFixed(4));
                    myChart.setOption({
                        yAxis: {
                            min: minY,
                            max: maxY,
                            interval: split,
                            boundaryGap: [0, '100%'],
                            axisTick: {
                                show: false
                            },
                            type: "value",
                            axisLabel: {
                                formatter: function (value, index) {
                                    if (index == 3) {
                                        return ""
                                    } else {
                                        return parseFloat(value).toFixed(2);
                                    }

                                }
                            }
                        }
                    });
                }
                if (mouseHoverPoint == history_data.length - 1) {
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: mouseHoverPoint,
                        name: "Mline",
                        position: ['50%', '50%']
                    });
                }
                myChart.setOption({
                    series: [
                        {
                            data: history_data
                        },
                        {
                            data: history_data
                        },
                        {
                            data: a_history_data
                        }
                    ]
                });

            } else {
                // var s_data = []; //最新价格
                // var z_data = []; //涨跌幅
                // var a_data = []; //成交量;
                var high = [];//
                var time = [];//时间
                var date = [];//日期
                var Low = open = preClose = value = volume =[];
                $.each(data, function (i, o) {
                    // var a_temp = o.split(",");
                    // var obj = [];
                    // var fvalue, r1;
                    // fvalue = parseFloat(a_temp[1]);
                    // r1 = Math.abs(fvalue - parseFloat(yc));
                    // if (r1 > interval) {
                    //     interval = r1;
                    // }
                    // s_data.push(parseFloat(a_temp[1]));
                    // z_data.push(parseFloat(((parseFloat(a_temp[1]) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2)));
                    // a_data.push(parseFloat(a_temp[2]));
                    high.push(o.High);
                    time.push(o.Time);
                    date.push(o.Date);
                    low.push(o.Low);
                    open.push(o.Open);
                    preClose.push(o.PreClose);
                    value.push(o.Value);
                    volume.push(o.Volume);
                });

                interval = interval*2;

                history_data = s_data;
                z_history_data = z_data;
                a_history_data = a_data;

                var date = moment(parseFloat(datatime)).format("YYYY-MM-DD");

                //国内沪深股市时间段;
                var startTime = moment(date + " 9:30").utc().valueOf(); //9:30
                var time2 = moment(date + " 10:30").utc().valueOf(); //10:30
                var time3 = moment(date + " 11:30").utc().valueOf(); //11:30
                var time4 = moment(date + " 14:00").utc().valueOf(); //14:00
                var endTime = moment(date + " 14:59").utc().valueOf(); //15:00
                var timeAdd = startTime;

                //停盘时间
                var b_time1 = moment(date + " 11:29").utc().valueOf();
                var b_time2 = moment(date + " 13:00").utc().valueOf();

                var i = 0;
                while (moment(timeAdd).isBefore(moment(endTime))) {
                    if (i == 0) {
                        c_data.push(startTime);
                        // c_data.push(moment(startTime).format("HH:mm"));
                    } else {
                        timeAdd = moment(timeAdd).add(1, 'm').utc().valueOf();
                        if (moment(timeAdd).isAfter(moment(b_time1)) && moment(timeAdd).isBefore(moment(b_time2))) {
                            continue;
                        } else {
                            c_data.push(timeAdd);
                            // c_data.push(moment(timeAdd).format("HH:mm"));
                        }

                    }
                    i++;
                }

                c_data.push(moment(date + " 15:00").utc().valueOf());

                yc = parseFloat(yc);
                if (yc) {
                    var minY = (yc - interval).toFixed(2);
                    var middleY = yc.toFixed(2);
                    var maxY = (yc + interval).toFixed(2);
                    var minY1 = ((parseFloat(minY) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2);
                    var maxY1 = ((parseFloat(maxY) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2);
                } else {
                    var minY = 0;
                    var middleY = 1;
                    var maxY = 2;
                }

                var split = parseFloat(((maxY - minY) / 6).toFixed(4));

                var split1 = parseFloat(((maxY1 - minY1) / 6).toFixed(4));

                var option = {
                    animation: false,
                    grid: [
                        {
                            // left: '10%',
                            // right: '8%',
                            top: "5%",
                            height: '55%'
                        },
                        {
                            // left: '10%',
                            // right: '8%',
                            bottom: '20%',
                            height: '12%'
                        }
                    ],
                    title: {
                        show: false
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    tooltip: {
                        // alwaysShowContent:true,
                        hideDelay: 0,
                        transitionDuration: 0,
                        showContent: false,
                        trigger: 'axis',
                        formatter: function (params) {
                            var paramsTime = params[0]["axisValue"];
                            var paramsData = params[0]["data"];
                            var paramsDataIndex = params[0]["dataIndex"];
                            var tpl = "时间:" + moment(parseFloat(paramsTime)).format("YYYY-MM-DD HH:mm") + "<br />" + "值:" + paramsData + "<br/>" + "位置:" + paramsDataIndex;
                            return tpl;
                        },
                        axisPointer: {
                            animation: false,
                            type: 'cross',
                            lineStyle: {
                                color: '#376df4',
                                width: 2,
                                opacity: 1
                            }
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 0,
                            end: 100
                        },
                        {
                            show: true,
                            xAxisIndex: [0, 1],
                            type: 'slider',
                            top: '85%',
                            start: 0,
                            end: 100
                        }
                    ],
                    xAxis: [
                        {
                            axisTick: {
                                interval: function (number, string) {
                                    if (number % 30 == 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }

                            },
                            axisLabel: {
                                interval: function (number, string) {
                                    if (number % 30 == 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                formatter: function (value, number) {
                                    return moment(parseFloat(value)).format("HH:mm");
                                }
                            },
                            axisLine: {
                                show: true
                            },
                            data: time,
                            splitLine: {
                                show: false
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params, value, s) {
                                        return moment(parseFloat(params.value)).format("YYYY-MM-DD HH:mm");
                                    }
                                }
                            }
                        },
                        {
                            axisPointer: {
                                label: {
                                    formatter: function (params, value, s) {
                                        return moment(parseFloat(params.value)).format("YYYY-MM-DD HH:mm");
                                    }
                                }
                            },
                            axisTick: {
                                interval: function (number, string) {
                                    if (number % 30 == 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }

                            },
                            axisLabel: {
                                interval: function (number, string) {
                                    if (number % 30 == 0) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                formatter: function (value, number) {
                                    return moment(parseFloat(value)).format("HH:mm");
                                }
                            },
                            axisLine: {
                                show: true
                            },
                            data: date,
                            splitLine: {
                                show: false
                            },
                            gridIndex: 1
                        }
                    ],
                    yAxis: [
                        {
                            min: minY,
                            max: maxY,
                            interval: split,
                            boundaryGap: [0, '100%'],
                            axisTick: {
                                show: false
                            },
                            type: "value",
                            axisLabel: {
                                formatter: function (value, index) {
                                    if (index == 3) {
                                        return ""
                                    } else {
                                        return parseFloat(value).toFixed(2);
                                    }

                                },
                                textStyle: {
                                    color: function (value, index) {
                                        if (parseFloat(value) > parseFloat(yc)) {
                                            return 'red';
                                        } else {
                                            return 'green';
                                        }
                                    }
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params, value, s) {
                                        return parseFloat(params.value).toFixed(2);
                                    }
                                }
                            }
                        },
                        {
                            min: minY1,
                            max: maxY1,
                            interval: split1,
                            boundaryGap: [0, '100%'],
                            axisTick: {
                                show: false
                            },
                            type: "value",
                            axisLabel: {
                                formatter: function (value, index) {
                                    if (index == 3) {
                                        return ""
                                    } else {
                                        return parseFloat(value).toFixed(2) + "%";
                                    }

                                },
                                textStyle: {
                                    color: function (value, index) {
                                        if (parseFloat(value) > 0) {
                                            return 'red';
                                        } else {
                                            return 'green';
                                        }
                                    }
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params, value, s) {
                                        return parseFloat(params.value).toFixed(2) + "%";
                                    }
                                }
                            }
                        },
                        {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            // axisLabel: {show: false},
                            // axisLine: {show: false},
                            // axisTick: {show: false},
                            // splitLine: {show: false}
                        }
                    ],

                    series: [
                        {
                            name: 'Mline',
                            type: 'line',
                            showSymbol: false,
                            hoverAnimation: false,
                            data: high,
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        type: 'solid',
                                        color: "rgb(51,51,51)"
                                    }
                                },
                                label: {
                                    normal: {
                                        position: "start",
                                        formatter: function (params) {
                                            return params.value + " ";
                                        }
                                    }
                                },

                                data: [
                                    {
                                        name: 'Y 轴值为 100 的水平线',
                                        yAxis: parseFloat(yc)
                                    }
                                ]
                            }
                        },
                        {
                            type: 'line',
                            showSymbol: false,
                            hoverAnimation: false,
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        type: 'solid',
                                        color: "rgb(51,51,51)"
                                    }
                                },
                                label: {
                                    normal: {
                                        position: "end",
                                        formatter: function (params) {
                                            return " " + params.value + ".00%";

                                        }
                                    }
                                },

                                data: [
                                    {
                                        name: 'Y 轴值为 100 的水平线',
                                        yAxis: 0.00
                                    }
                                ]
                            },
                            lineStyle: {
                                normal: {
                                    color: "transparent"
                                }
                            },
                            data: low,
                            yAxisIndex: 1
                        },
                        {
                            name: 'Volumn',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 2,
                            data: last
                        }
                    ]
                };

                myChart = echarts.init(document.getElementById('continer'));
                myChart.setOption(option);
                // count = myChart.getOption().series[0].data.length;

                // var marktToolData = [history_data[count - 1], z_history_data[count - 1], a_history_data[count - 1], moment(parseFloat(c_data[count - 1])).format("YYYY-MM-DD HH:mm")];
                // set_marketTool(marktToolData); //设置动态行情条

                // myChart.on('showTip', function (params) {
                //     mouseHoverPoint = params.dataIndex;
                //     var countent = $("#marketM");
                //     if (history_data[mouseHoverPoint]) {
                //         $(".dataPrice", countent).text(history_data[mouseHoverPoint]);
                //         $(".AD", countent).text(z_history_data[mouseHoverPoint]);
                //         $(".turnover", countent).text(a_history_data[mouseHoverPoint]);
                //         $(".dataTime", countent).text(moment(parseFloat(c_data[mouseHoverPoint])).format("YYYY-MM-DD HH:mm"));
                //     } else {
                //         $(".dataPrice", countent).text("-");
                //         $(".dataTime", countent).text("-");
                //         $(".AD", countent).text("-");
                //         $(".turnover", countent).text("-");
                //     }
                // });

                $("#continer").bind("mouseenter", function (event) {
                    toolContentPosition(event);
                    $("#toolContent").show();
                });

                $("#continer").bind("mousemove", function (event) {
                    isHoverGraph = true;
                    toolContentPosition(event);
                });

                $("#continer").bind("mouseout", function (event) {
                    isHoverGraph = false;
                    $("#toolContent").hide();
                    mouseHoverPoint = 0;
                });

                function toolContentPosition(event) {
                    var offsetX = event.offsetX;
                    var continerWidth = $("#continer").width(), toolContent = $("#toolContent").width();
                    var centerX = continerWidth / 2;
                    if (offsetX > centerX) {
                        $("#toolContent").css("left", 55);
                    } else {
                        $("#toolContent").css("left", continerWidth - toolContent - 60);
                    }
                }

            }

        } else {
            console.log("暂无数据");
        }

        function set_marketTool(data) {
            if (!isHoverGraph || isHoverGraph && !history_data[mouseHoverPoint]) {
                var countent = $("#marketM");
                $(".dataPrice", countent).text(data[0]);
                $(".AD", countent).text(data[1]);
                $(".turnover", countent).text(data[2]);
                $(".dataTime", countent).text(data[3]);
            }
        }
    }


    function KLine(rawData, type) {

        function splitData(rawData) {
            rawData = JSON.parse(rawData);
            var Klines = rawData["klines"];
            var categoryData = [];
            var values = [];
            var volumes = [];
            var z_values = [];
            var lastClose = 0;
            for (var i = 0; i < Klines.length; i++) {
                var Kline_Obj = Klines[i].split(",");
                if (rawData["period"] > 7) {  //日期线
                    var date = moment(parseFloat(Kline_Obj[0] + "000")).format("YYYY-MM-DD"); //日期
                } else { //带有时间的K线
                    var date = moment(parseFloat(Kline_Obj[0] + "000")).format("YYYY-MM-DD HH:mm"); //日期
                }

                var dateutc = parseFloat(Kline_Obj[0] + "000"),
                    open = parseFloat(Kline_Obj[1]),  //开
                    highest = parseFloat(Kline_Obj[2]), //高
                    lowest = parseFloat(Kline_Obj[3]), //低
                    close = parseFloat(Kline_Obj[4]), //收
                    turnover = parseFloat(Kline_Obj[5]); //成交量;

                var a_value_temp = [open, close, lowest, highest];

                if(lastClose==0){
                    z_values.push(0);
                }else{
                    var zValue = parseFloat((close-lastClose)/lastClose*100); //和上一个点对比的涨跌
                    z_values.push(zValue);
                }

                categoryData.push(date); // x轴
                values.push(a_value_temp); // 蜡烛图数据
                volumes.push(turnover); //柱形图数据
                volumes.push(z_values);
                lastClose = close;
            }

            return {
                categoryData: categoryData,
                values: values,
                volumes: volumes,
                zValues:z_values
            };
        }

        function calculateMA(dayCount, data) {
            var result = [];
            for (var i = 0, len = data.values.length; i < len; i++) {
                if (i < dayCount) {
                    result.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += data.values[i - j][1];
                }
                result.push(+(sum / dayCount).toFixed(3));
            }
            return result;
        }

        var data = splitData(rawData);

        K_data = data;

        KChart = echarts.init(document.getElementById('continer_K'));
        KChart.setOption(option = {
            animation: false,
            tooltip: {
                trigger: 'axis',
                showContent: false,
                axisPointer: {
                    type: 'cross'
                }

            },
            axisPointer: {
                link: {xAxisIndex: 'all'},
                label: {
                    backgroundColor: '#777'
                }
            },
            grid: [
                {
                    // left: '10%',
                    // right: '8%',
                    top: "5%",
                    height: '55%'
                },
                {
                    // left: '10%',
                    // right: '8%',
                    bottom: '20%',
                    height: '12%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    splitLine: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {onZero: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                var seriesValue = (params.seriesData[0] || {}).value;
                                return params.value
                                    + (seriesValue != null
                                            ? '\n' + echarts.format.addCommas(seriesValue)
                                            : ''
                                    );
                            }
                        }
                    }
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: {
                        formatter: function (value, index) {
                            return (value/10000).toFixed(2)+"万";
                        }
                    }
                    // axisLabel: {show: false},
                    // axisLine: {show: false},
                    // axisTick: {show: false},
                    // splitLine: {show: false}
                },
                {
                    scale: true,
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        formatter: function (value, index) {
                            return value+"%";
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 98,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'K',
                    type: 'candlestick',
                    itemStyle: {
                        normal: {
                            color: '#ef232a',
                            color0: '#14b143',
                            borderColor: '#ef232a',
                            borderColor0: '#14b143'
                        },
                        emphasis: {
                            color: 'black',
                            color0: '#444',
                            borderColor: 'black',
                            borderColor0: '#444'
                        }
                    },
                    data: data.values,
                    tooltip: {
                        formatter: function (param) {
                            param = param[0];
                            return [
                                'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                'Open: ' + param.data[0] + '<br/>',
                                'Close: ' + param.data[1] + '<br/>',
                                'Lowest: ' + param.data[2] + '<br/>',
                                'Highest: ' + param.data[3] + '<br/>'
                            ].join('');
                        }
                    }
                },
                {
                    name: 'Volume',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data.volumes
                },
                {
                    name:"z",
                    type:'line',
                    xAxisIndex: 0,
                    yAxisIndex: 2,
                    data:data.zValues,
                    symbolSize:0,
                    lineStyle: {
                        normal: {
                            color: "transparent"
                        }
                    }
                }
            ]
        }, true);


        function set_marketTool(data) {
            if (!isHoverGraph || isHoverGraph && !data.values[mouseHoverPoint]) {
                var countent = $("#marketK");
                $(".open", countent).text(data[0]);
                $(".highest", countent).text(data[1]);
                $(".close", countent).text(data[2]);
                $(".lowest", countent).text(data[3]);
                $(".turnover", countent).text(data[4]);
                $(".AD", countent).text(data[5]);
                $(".dataTime", countent).text(data[6]);
            }
        }

        // categoryData.push(date); // x轴
        // values.push(a_value_temp); // 蜡烛图数据
        // volumes.push(turnover); //柱形图数据

        rawData = JSON.parse(rawData);

        var Klines = rawData["klines"][rawData["klines"].length - 1].split(",");

        var marktToolData = [
            parseFloat(Klines[1]).toFixed(2),
            parseFloat(Klines[2]).toFixed(2),
            parseFloat(Klines[4]).toFixed(2),
            parseFloat(Klines[3]).toFixed(2),
            (Klines[5]/10000).toFixed(2)+"万",
            data.zValues[data.zValues.length-1].toFixed(2),
            moment(parseFloat(Klines[0]+"000")).format("YYYY-MM-DD")
        ];
        set_marketTool(marktToolData); //设置动态行情条

        $("#continer_K").bind("mouseenter", function (event) {
            toolContentPosition(event);
            $("#toolContent_K").show();
        });

        $("#continer_K").bind("mousemove", function (event) {
            isHoverGraph = true;
            toolContentPosition(event);
        });

        $("#continer_K").bind("mouseout", function (event) {
            isHoverGraph = false;
            $("#toolContent_K").hide();
            mouseHoverPoint = 0;
        });

        function toolContentPosition(event) {
            var offsetX = event.offsetX;
            var continerWidth = $("#continer_K").width(), toolContent = $("#toolContent_K").width();
            var centerX = continerWidth / 2;
            if (offsetX > centerX) {
                $("#toolContent_K").css("left", 55);
            } else {
                $("#toolContent_K").css("left", continerWidth - toolContent - 60);
            }
        }

        KChart.on('showTip', function (params) {
            mouseHoverPoint = params.dataIndex;
            var countent = $("#marketK");
            var Klines = rawData["klines"][mouseHoverPoint].split(",");
            if (Klines) {
                $(".open", countent).text(Klines[1]);
                $(".highest", countent).text(Klines[2]);
                $(".close", countent).text(Klines[4]);
                $(".lowest", countent).text(Klines[3]);
                $(".turnover", countent).text(Klines[5]);
                $(".AD", countent).text(data.zValues[mouseHoverPoint].toFixed(2));
                $(".dataTime", countent).text(moment(parseFloat(Klines[0]+"000")).format("YYYY-MM-DD"));
            } else {
                $(".open", countent).text("-");
                $(".highest", countent).text("-");
                $(".close", countent).text("-");
                $(".lowest", countent).text("-");
                $(".turnover", countent).text("-");
                $(".AD", countent).text("-");
                $(".dataTime", countent).text("-");
            }
        });

    }


    $(document).keyup(function (e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37:
                move(-1, true);
                break; //左
            case 38:
                move(1);
                break;  //上
            case 39:
                move(1, true);
                break; //右
            case 40:
                move(-1);
                break; //下
            default:
                break;
        }
    });

    function move(index, type) {

        var chart;

        if($(".active").attr("link")=="continer_K"){
            chart = KChart;
        }else {
            chart = myChart;
        }

        if (type) {

            if (mouseHoverPoint == 0 && index == -1) {
                mouseHoverPoint = chart.getOption().series[0].data.length;
            }

            if (mouseHoverPoint == 0 && index == 1) {
                // index = 0;
            }

            if (mouseHoverPoint + index > chart.getOption().series[0].data.length - 1 && index == 1) {
                mouseHoverPoint = 0;
                index = 0;
            }

            var name = chart.getOption().series[0].name;

            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: mouseHoverPoint + index,
                name: name,
                position: ['50%', '50%']
            });

        } else {
            if (index == 1) {
                start += 10;
                if (start > 100) {
                    start = 100;
                    return;
                } else {
                    mouseHoverPoint = mouseHoverPoint + (count * zoom / 100);
                }
            } else {
                start -= 10;
                if (start < 0) {
                    start = 0;
                    return;
                } else {
                    mouseHoverPoint = mouseHoverPoint - (count * zoom / 100);
                }

            }
            chart.dispatchAction({
                type: 'dataZoom',
                // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
                dataZoomIndex: 0,
                // 开始位置的百分比，0 - 100
                start: start,
                // 结束位置的百分比，0 - 100
                end: 100
            })

        }
    }

});