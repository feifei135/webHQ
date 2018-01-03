/**
 * Created by Lenovo on 2017/8/9.
 */

var code = getQueryString("code");
var yc = getQueryString("yc");
var datatime = getQueryString("datatime");

function WebSocketAPI() {
    "use strict";
    var socket = null;
    var readyState = new Array("正在连接", "已建立连接", "正在关闭连接", "已关闭连接");
    var connection = "{\"type\":8193,\"address\":\"data11.120918.com\",\"port\":6051}"; // 服务器配置
    var login = "{\"type\": 16385}"; // 登陆口令
    var mLineQuery = "{\"type\":45070,\"code\":$code,\"lastvolume\":0}"; // 分时线请求串
    var kLineQuery = "{\"type\":20490,\"code\":$code,\"period\":$period,\"mode\":1,\"offset\":0,\"num\":$num,\"multiday\":5,\"power\":0}";  // K线请求串
    var watchMarket = {"type": 45057, "group": "test", "codes": [1600000]};
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
                socket.requestMLine(code);
                socket.watchMarket(code);
                // socket.requestKLine("1600000",8,100);
                break;
            case 45058 :
                // showContent("个股行情数据：" + evt.data);
                // c_Mline(data["quotes"], "add");
                break;
            case 45070 :
                // showContent("分时线数据：" + evt.data);
                c_Mline(data["minutes"]);
                // socket.requestMLine(code);
                break;
            case 20490 :
                // showContent("K线数据：" + evt.data);
                break;
            case 20485 :
                break; // rank
            case 20486 :
                break; // 行情报价表数据
            case 40963:
                break;
        }
    };

    // 请求股票行情
    socket.requestQuote = function (codes) {
        logined && socket.send(getOrderQuery(codes));
    };
    // 请求分时线
    socket.requestMLine = function (code) {
        logined && socket.send(mLineQuery.replace("$code", "1600000"));
    };
    // 请求K线
    socket.requestKLine = function (code, period, num) {
        logined && socket.send(kLineQuery.replace("$code", code).replace("$period", period ? period : 8).replace("$num", num ? num : 241));
    };
    //订阅行情
    socket.watchMarket = function (code) {
        logined && socket.send(JSON.stringify(watchMarket));
    };

    return socket;
}

var webSocket = new WebSocketAPI();

var stockChart;

function c_Mline(data, type) {

    if (data) {
        if (type == "add") {
            var a_lastData = data[0].split(",");
            var serires = stockChart.series[0];
            serires.addPoint([parseFloat(a_lastData[1] + "000"), parseFloat(a_lastData[6])], true, true);
        } else {
            var s_data = [];
            var interval = 0;
            $.each(data, function (i, o) {
                var a_temp = o.split(",");
                var obj = [];
                var fvalue, r1;
                fvalue = parseFloat(a_temp[1]);
                r1 = Math.abs(fvalue - parseFloat(yc));
                if (r1 > interval) {
                    interval = r1;
                }
                obj.push((parseFloat(a_temp[0] + "000")), parseFloat(a_temp[1]));
                s_data.push(obj);
            });

            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            // Snippet to interpolate crosshair on the value axis
            (function (H) {
                var Axis = H.Axis,
                    wrap = H.wrap;

                wrap(Axis.prototype, 'drawCrosshair', function (proceed, e, point) {
                    if (!this.isXAxis) {
                        var char = this.chart;
                        H.each(this.chart.hoverPoints, function (point) {
                            var copyY1Series;
                            $(char.yAxis).each(function (zz, o) {
                                if (zz == 2) {
                                    return true;
                                }
                                if (zz == 1) {
                                    var series = copyY1Series;
                                } else {
                                    var series = o.series[0];
                                }

                                var points = series && series.points,
                                    axis = o,
                                    prev,
                                    next,
                                    i,
                                    interpolate,
                                    xAxisPos = series && series.xAxis.pos;

                                if (zz == 0) {
                                    copyY1Series = $.extend(true, [], series)
                                }

                                if (axis && series && axis.options.crosshair && axis.options.crosshair.interpolate) {
                                    for (i = 0; i < points.length; i++) {
                                        if (points[i].plotX + xAxisPos > e.chartX) {
                                            prev = points[i - 1];
                                            next = points[i];
                                            break;
                                        }
                                    }

                                    if (prev && next) {
                                        interpolate = function (prop) {
                                            var factor = (e.chartX - prev.plotX - xAxisPos) / (next.plotX - prev.plotX);
                                            return prev[prop] + (next[prop] - prev[prop]) * factor;
                                        };
                                        console.log(point.plotX + "," + point.plotY);

                                        if (zz == 1) {
                                            var point2 = {
                                                series: series,
                                                x: interpolate('x'),  //值
                                                y: interpolate('y'),  //值
                                                plotX: interpolate('plotX'), //Y轴线坐标
                                                plotY: interpolate('plotY') //Y轴线坐标
                                            };
                                            proceed.call(axis, e, point2);
                                        } else {
                                            point = {
                                                series: series,
                                                x: interpolate('x'),  //值
                                                y: interpolate('y'),  //值
                                                plotX: interpolate('plotX'), //Y轴线坐标
                                                plotY: interpolate('plotY') //Y轴线坐标
                                            };
                                            proceed.call(axis, e, point);
                                        }

                                    }
                                }

                            });
                        });
                    } else {
                        proceed.call(this, e, point);
                    }
                });

            }(Highcharts));

            var date = moment(parseFloat(datatime)).format("YYYY-MM-DD");

            //国内沪深股市时间段;
            var time1 = moment(date + " 9:30").utc().valueOf(); //9:30
            var time2 = moment(date + " 10:30").utc().valueOf(); //10:30
            var time3 = moment(date + " 11:30").utc().valueOf(); //11:30
            var time4 = moment(date + " 14:00").utc().valueOf(); //14:00
            var time5 = moment(date + " 15:00").utc().valueOf(); //15:00

            //停盘时间
            var b_time1 = moment(date + " 11:30").utc().valueOf();
            var b_time2 = moment(date + " 13:00").utc().valueOf();

            var timeMin = time1;
            var timeMax = time5;
            var xAxisTime = [time1, time2, time3, time4, time5];
            var breaks = [{
                breakSize: 0,
                from: b_time1,
                to: b_time2
            }];

            // Create the chart

            stockChart = new Highcharts.StockChart('chartMLine', {
                // accessibility: {
                //     keyboardNavigation: {
                //         enabled:true,
                //         skipNullPoints: true,
                //         tabThroughChartElements:false
                //     }
                // },
                chart: {
                    events: {
                        load: function () {
                        }
                    }
                },
                xAxis: {
                    min: timeMin,
                    max: timeMax,
                    startOnTick: true,
                    endOntick: true,
                    gridLineWidth: 1,
                    breaks: breaks,
                    type: 'datetime',
                    tickInterval: 3600 * 1000,
                    labels: {
                        formatter: function () {
                            return moment(this.value).format("HH:mm");
                        }
                    },
                    tickPositioner: function () {
                        return xAxisTime;
                    },
                    crosshair: {
                        // snap: false,
                        label: {
                            enabled: true,
                            formatter: function (val) {
                                var formatDate = moment(val).format("YYYY-MM-DD HH:mm:ss / ");
                                formatDate += momentWeekLocal[moment(val).weekday()];
                                return formatDate;
                            }
                        }
                    }
                },
                yAxis: [
                    {
                        opposite: false,
                        plotLines: [{
                            value: parseFloat(yc),
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: '作收',
                                align:"center"
                            }
                        }],
                        crosshair: {
                            snap: false,
                            interpolate: true,
                            label: {
                                enabled: true,
                                // format: '{value:.2f}',
                                formatter: function (val) {
                                    return parseFloat(val).toFixed(2);
                                },
                                y: 6,
                                x: 2
                            }
                        },
                        // gridLineWidth: 1,
                        tickPositioner: function () {
                            yc = parseFloat(yc);
                            if (yc) {
                                var firstData = (yc - interval).toFixed(2);
                                var middleData = yc.toFixed(2);
                                var lastData = (yc + interval).toFixed(2);
                                return [firstData, middleData, lastData];
                            } else {
                                return [0, 1, 2];
                            }

                        },
                        startOnTick: true,
                        endOntick: true,
                        showLastLabel: true
                    },
                    {
                        linkedTo: 0,
                        opposite: true,
                        crosshair: {
                            snap: false,
                            interpolate: true,
                            label: {
                                enabled: true,
                                // format: '{value:.2f}',
                                formatter: function (val) {
                                    var zdf = ((parseFloat(val) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2);
                                    return zdf + "%";
                                },
                                y: 6,
                                x: 2
                            }
                        },
                        tickPositioner: function () {
                            yc = parseFloat(yc);
                            if (yc) {
                                var firstData = (yc - interval).toFixed(2);
                                var middleData = yc.toFixed(2);
                                var lastData = (yc + interval).toFixed(2);
                                return [firstData, middleData, lastData];
                            } else {
                                return [0, 1, 2];
                            }

                        },
                        startOnTick: true,
                        endOntick: true,
                        showLastLabel: true,
                        labels: {
                            formatter: function () {
                                var zdf = ((parseFloat(this.value) - parseFloat(yc)) / parseFloat(yc) * 100).toFixed(2);
                                return zdf + "%";
                            }
                        }
                    },
                ],
                tooltip: {
                    formatter: function () {
                        var formatDate = moment(this.points.x).format("YYYY-MM-DD HH:mm:ss / ");
                        formatDate += momentWeekLocal[moment(this.points.x).weekday()];
                        var s = '<b>' + formatDate + '</b>';
                        $.each(this.points, function () {
                            s += '<br/>价格:' + this.y + ' 元';
                        });
                        return s;
                    }
                },
                plotOptions:{
                  line:{
                      allowPointSelect:true
                  }
                },
                rangeSelector: {
                    // buttons: [{
                    //     count: 1,
                    //     type: 'minute',
                    //     text: '1M'
                    // }, {
                    //     count: 5,
                    //     type: 'minute',
                    //     text: '5M'
                    // }, {
                    //     type: 'all',
                    //     text: 'All'
                    // }],
                    // inputEnabled: false,
                    // selected: 1,
                    enabled: false
                },
                title: {
                    text: '浦发银行'
                },
                exporting: {
                    enabled: false
                },
                series: [
                    {
                        name: 'Random data',
                        data: s_data
                    }
                ]
            });

            // var zoomLevel = 10; // 平移或缩放比例，10 表示当前选中范围的 1/10
            // $(document).keyup(function(e) {
            //     var keyCode = e.keyCode;
            //     switch(keyCode) {
            //         case 37: zoom(-1, true);break;
            //         case 38:zoom(1);break;
            //         case 39:zoom(1, true);break;
            //         case 40:zoom(-1);break;
            //         default:;break;
            //     }
            // });
            // function zoom(level, isPanning) {
            //     var xAxis = stockChart.xAxis[0],
            //         min = xAxis.min,
            //         max = xAxis.max,
            //         range = (max - min)/zoomLevel;
            //     // 通过 API 接口进行缩放或平移操作
            //     xAxis.setExtremes(isPanning ? min + range*level : min - range* level, max + range*level);
            // }

            // var p = 3;
            // document.onkeydown = function (e) {
            //     var theChart = $('#chartMLine').highcharts();
            //     var maxP = theChart.series[0].points.length;
            //     console.log(p);
            //     switch (e.keyCode) {
            //         case 37:
            //             console.log('left');
            //             if (p == 0) {
            //                 p = p;
            //             } else {
            //                 p = p - 1;
            //             }
            //             theChart.tooltip.refresh(theChart.series[0].points[p]);
            //             break;
            //         case 38:
            //             console.log('up');
            //             break;
            //         case 39:
            //             console.log('right');
            //             if (p == maxP) {
            //                 p = p;
            //             } else {
            //                 p = p + 1;
            //             }
            //             theChart.tooltip.refresh(theChart.series[0].points[p]);
            //             break;
            //         case 40:
            //             console.log('down');
            //             break;
            //     }
            // };

            // var activeChart=0;
            // $("#chartMLine").mouseover(function(){
            //     activeChart=1;
            // });
            // $("#chartMLine").mouseleave(function( ){
            //     activeChart=0;
            //     activePoint=0;
            // });
            // $(document).keydown(function (e) {
            //     if(activeChart==0) return false;
            //     switch (e.which) {
            //         case 37:
            //             if (activePoint > 0) {
            //                 activePoint--;
            //             }
            //             break;
            //         case 39:
            //             if (activePoint + 1 < stockChart.series[0].data.length) {
            //                 activePoint++;
            //             }
            //             break;
            //     }
            //     if(e.which==37||e.which==39){
            //         var refresh_series=new Array();
            //         for(var i=0;i<stockChart.series.length;i++){
            //             if(stockChart.series[i].visible){
            //                 refresh_series.push(stockChart.series[i].data[activePoint]);
            //             }
            //         }
            //         if(refresh_series.length>0){
            //             stockChart.tooltip.refresh(refresh_series);
            //         }
            //     }
            // });
            // stockChart.container.onmousedown = null;
            // stockChart.container.onclick = null;
            // $("#chartMLine").mousemove(move);
            // var chart = new Highcharts.StockChart('chartMLine', {
            //     accessibility: {
            //         keyboardNavigation: {
            //             enabled: true,
            //             // skipNullPoints: true
            //         }
            //     },
            //     xAxis: {
            //         crosshair: {
            //             snap: false
            //         }
            //     },
            //
            //     yAxis: [{
            //         crosshair: {
            //             interpolate: true,
            //             snap: false,
            //             label: {
            //                 enabled: true,
            //                 format: '{value:.1f}' // One decimal
            //             }
            //         }
            //     },
            //         {
            //             linkedTo: 0,
            //             opposite: false,
            //             // visible: false,
            //             crosshair: {
            //                 interpolate: true,
            //                 snap: false,
            //                 label: {
            //                     enabled: true,
            //                     format: '{value:.1f}' // One decimal
            //                 }
            //             }
            //         }
            //     ],
            //
            //     tooltip: {
            //         shared: true
            //     },
            //
            //
            //     series: [
            //         {
            //             data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            //         },
            //         // {
            //         //     data: [56.4, 28.14, 68.47, 94.12, 115.97, 109.74, 149.17, 154.63, 88.1, 147.55, 197.25],
            //         //     yAxis: 1
            //         // }
            //     ]
            // });

            // Highcharts.seriesType('lowmedhigh', 'boxplot', {
            //     keys: ['low', 'median', 'high']
            // }, {
            //     // Change point shape to a line with three crossing lines for low/median/high
            //     // Stroke width is hardcoded to 1 for simplicity
            //
            // });

            // Create chart
            // var chart = Highcharts.chart('chartMLine', {
            //     accessibility: {
            //         keyboardNavigation: {
            //             skipNullPoints: true
            //         },
            //     },
            //     chart: {
            //         type: 'line',
            //         typeDescription: 'Low, median, high. Each data point has a low, median and high value, depicted vertically as small ticks.', // Describe the chart type to screen reader users, since this is not a traditional boxplot chart
            //         description: 'Chart depicting fictional fruit consumption data, with the minimum, maximum and median values for each month of 2015. Most plums were eaten in spring, and none at all in July or August. Bananas and apples were both consumed in smaller numbers and steadily throughout the year.'
            //     },
            //     title: {
            //         text: 'Daily company fruit consumption 2015'
            //     },
            //     xAxis: [{
            //         crosshair: true,
            //         description: 'Months of the year',
            //         categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            //     }],
            //     yAxis: {
            //         crosshair: true,
            //         title: {
            //             text: 'Fruits consumed'
            //         },
            //         min: 0
            //     },
            //
            //     series: [{
            //         name: 'Plums',
            //         data: [
            //             [ 8],
            //             [ 11],
            //             [ 16],
            //             [ 15],
            //             [ 15],
            //             [ 9],
            //             null,
            //             null,
            //             [ 6],
            //             [ 8],
            //             [ 9],
            //             [ 11]
            //         ]
            //     },]
            // });




            function move(event) {
                var x = event.pageX,
                    y = event.pageY,
                    path = ['M', stockChart.plotLeft, y,
                        'L', stockChart.plotLeft + stockChart.plotWidth, y,
                        'M', x, stockChart.plotTop,
                        'L', x, stockChart.plotTop + stockChart.plotHeight];

                if (stockChart.crossLines) {
                    // update lines
                    stockChart.crossLines.attr({
                        d: path
                    });
                } else {
                    // draw lines
                    stockChart.crossLines = stockChart.renderer.path(path).attr({
                        'stroke-width': 2,
                        stroke: 'green',
                        zIndex: 10
                    }).add();
                }

                if (stockChart.crossLabel) {
                    // update label
                    stockChart.crossLabel.attr({
                        y: y + 6,
                        text: stockChart.yAxis[0].toValue(y).toFixed(2)
                    });
                } else {
                    // draw label
                    stockChart.crossLabel = stockChart.renderer.text(stockChart.yAxis[0].toValue(y).toFixed(2), stockChart.plotLeft - 40, y + 6).add();
                }
            }
        }

    } else {
        console.log("暂无数据");
    }
}

