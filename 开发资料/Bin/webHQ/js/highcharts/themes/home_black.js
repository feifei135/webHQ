/**
 * Gray theme for Highcharts JS
 * @author Torstein Honsi
 *
 * 财经日历引用 更改时注意
 */

Highcharts.theme_black = {
    //线的颜色
    colors: ["rgba(43,153,255,0.5)", "rgba(236,138,59,0.5)", "rgba(255,192,56,0.5)", "#FA9157", "#E4A937", "#DA718F", "#C658C2",
        "#6264C8", "#538BE8", "#49A85D", "#BF7C54", "#B7A35D", "#C85265", "#A060E8", "#4C6696",
        "#458960", "#885232", "#934A4A", "#815595", "#768093"],
    scaColor:["#245f9b","#fff"],
    chart: {
        marginTop: 100,
        backgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
            //背景渐变
            stops: [
                // [0, 'red'],
                // [1, 'yellow']
            ]
        },
        borderWidth: 0,
        borderRadius: 0,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0
    },
    //主标题
    title: {
        align: "left",
        x: 30,
        style: {
            color: '#fff',
            font: '18px Microsoft YaHei',
            fontWeight: 'bold'
        }
    },
    //子标题
    subtitle: {
        style: {
            color: '#DDD',
            font: '12px Microsoft YaHei'
        }
    },

    xAxis: {
        gridLineWidth: 0,
        lineColor: '#788397',
        tickColor: '#788397',
        crosshair: {
            color: '#fff',
            width: 1
        },
        tickLength: 5,
        labels: {
            style: {
                color: 'rgba(255,255,255,0.5)',
                font: '14px Microsoft YaHei',
                fontWeight: '0'
            }
        },
        tickPixelInterval: 200,
        title: {
            align:"left",
            x:100,
            style: {
                color: '#fff',
                font: 'bold 14px Microsoft YaHei',
                fontWeight: '0'
            }
        }
    },
    yAxis: {
        alternateGridColor: null,
        minorTickInterval: null,
        gridLineColor: '#333A4B',
        gridLineWidth: 1,
        minorGridLineColor: '#788397',
        lineWidth: 0, //是否显示Y轴的 轴线
        tickWidth: 0, //Y轴的刻度
        lineColor: '#788397',
        tickColor: '#788397',
        tickLength: 5,
        labels: {
            style: {
                color: 'rgba(255,255,255,0.5)',
                font: '14px Microsoft YaHei',
                fontWeight: '0'
            }
        },
        title: {
            align: 'high',
            style: {
                color: 'rgba(255,255,255,0.5)',
                font: '14px Microsoft YaHei',
                fontWeight: '0'
            }
        }
    },
    legend: {
        // verticalAlign:"bottom",
        // x: 500,
        // y: 500,
        align: 'right',
        verticalAlign: 'top',
        backgroundColor: "#1C2437",
        x: -15,
        y: 15,
        itemStyle: {
            color: '#fff',
            font: '14px Microsoft YaHei'
        },
        itemHoverStyle: {
            color: '#0084FE'
        },
        itemHiddenStyle: {
            color: 'gray'
        }
    },
    labels: {
        style: {
            color: 'red'
        }
    },
    tooltip: {
        backgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
            stops: [
                [0, "rgba(17,18,27,0.9)"],
                // [1, 'red']
            ]
        },
        borderWidth: 0,
        style: {
            color: '#fff',
            fontSize: "16px"
        }
    },


    plotOptions: {
        series: {
            dataLabels: {
                style: {
                    color: '#fff',
                    fontSize: '14px'
                }
            },
            point: {
                events: {
                    mouseOver: function (event) {
                        if(this.color){
                            console.log(event);
                            var color = this.color.replace("0.5", 1);
                            this.pointAttr.hover.fill = color;
                        }
                    }
                }
            }
        },
        column: {
            borderWidth: 0,
            allowPointSelect: true,
        },
        line: {
            dataLabels: {
                color: '#CCC'
            }
        },
        area:{
            marker: {
                enabled: false,
                states:{
                    hover:{
                        lineWidth:0,
                        radius:4,
                        lineWidthPlus:0,
                        lineColor:"transparent",
                        radiusPlus:0
                    }
                }
            },
        },
        spline: {
            marker: {
                enabled: false,
                states:{
                    hover:{
                        lineWidth:0,
                        radius:4,
                        lineWidthPlus:0,
                        lineColor:"transparent",
                        radiusPlus:0
                    }
                }
            },
        },
        scatter: {
            color: "#245F9B",
            animation: false,
            marker: {
                radius: 5,
                states: {
                    hover: {
                        lineWidth:0,
                        lineColor:"transparent",
                        radius:0,
                        fillColor: "#74d0ff"
                    }
                }
            },
        },
        candlestick: {
            lineColor: 'white'
        }
    },

    toolbar: {
        itemStyle: {
            color: '#CCC'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            hoverSymbolStroke: '#fffFFF',
            theme: {
                fill: {
                    linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0.4, '#606060'],
                        [0.6, '#333333']
                    ]
                },
                stroke: '#000000'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0.4, '#888'],
                    [0.6, '#555']
                ]
            },
            stroke: '#000000',
            style: {
                color: '#CCC',
                fontWeight: 'bold'
            },
            states: {
                // hover: {
                //     fill: {
                //         linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                //         stops: [
                //             [0.4, '#BBB'],
                //             [0.6, '#888']
                //         ]
                //     },
                //     stroke: '#000000',
                //     style: {
                //         color: 'white'
                //     }
                // },
                // select: {
                //     fill: {
                //         linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                //         stops: [
                //             [0.1, '#000'],
                //             [0.3, '#333']
                //         ]
                //     },
                //     stroke: '#000000',
                //     style: {
                //         color: 'yellow'
                //     }
                // }
            }
        },
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#fff'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(16, 16, 16, 0.5)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        }
    },

    scrollbar: {
        barBackgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
            stops: [
                [0.4, '#888'],
                [0.6, '#555']
            ]
        },
        barBorderColor: '#CCC',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
            stops: [
                [0.4, '#888'],
                [0.6, '#555']
            ]
        },
        buttonBorderColor: '#CCC',
        rifleColor: '#fff',
        trackBackgroundColor: {
            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
            stops: [
                [0, '#000'],
                [1, '#333']
            ]
        },
        trackBorderColor: '#666'
    },

    // special colors for some of the demo examples
    legendBackgroundColor: '#083965',
    background2: 'rgb(70, 70, 70)',
    dataLabelsColor: '#444',
    textColor: '#E0E0E0',
    maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
