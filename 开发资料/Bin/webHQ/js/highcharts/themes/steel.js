/**
 * Gray theme for Highcharts JS
 * @author Torstein Honsi
 *
 * 财经日历引用 更改时注意
 */

Highcharts.theme = {
    //线的颜色
    colors: ["#3D7EB6", "#6279C8", "#409292", "#FA9157", "#E4A937", "#DA718F", "#C658C2",
        "#6264C8", "#538BE8", "#49A85D", "#BF7C54", "#B7A35D", "#C85265", "#A060E8", "#4C6696",
        "#458960", "#885232", "#934A4A", "#815595", "#768093"],
    chart: {
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
        style: {
            color: '#2E344E',
            font: '20px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif',
            fontWeight: 'bold'
        }
    },
    //子标题
    subtitle: {
        style: {
            color: '#DDD',
            font: '12px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
        }
    },

    xAxis: {
        gridLineWidth: 0,
        lineColor: '#788397',
        tickColor: '#788397',
        tickLength: 5,
        labels: {
            style: {
                color: '#2E344E',
                fontWeight: 'bold'
            }
        },
        title: {
            style: {
                color: '#2E344E',
                font: 'bold 12px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        }
    },
    yAxis: {
        alternateGridColor: null,
        minorTickInterval: null,
        gridLineColor: '#788397',
        gridLineWidth: 0,
        minorGridLineColor: '#788397',
        lineWidth: 1, //是否显示Y轴的 轴线
        tickWidth: 1, //Y轴的刻度
        lineColor: '#788397',
        tickColor: '#788397',
        tickLength: 5,
        labels: {
            style: {
                color: '#2E344E',
                fontWeight: 'bold'
            }
        },
        title: {
            style: {
                color: '#2E344E',
                font: 'bold 12px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        }
    },
    legend: {
        itemStyle: {
            color: '#2E344E'
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
                [0, "#2E344E"],
                [1, '#2E344E']
            ]
        },
        borderWidth: 0,
        style: {
            color: '#fff'
        }
    },


    plotOptions: {
        series: {
            nullColor: '#444444'
        },
        line: {
            dataLabels: {
                color: '#CCC'
            },
            marker: {
                lineColor: '#333'
            }
        },
        spline: {
            marker: {
                lineColor: '#333'
            }
        },
        scatter: {
            marker: {
                lineColor: 'red'
            }
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
            hoverSymbolStroke: '#2E344EFFF',
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
                hover: {
                    fill: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0.4, '#BBB'],
                            [0.6, '#888']
                        ]
                    },
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0.1, '#000'],
                            [0.3, '#333']
                        ]
                    },
                    stroke: '#000000',
                    style: {
                        color: 'yellow'
                    }
                }
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
            borderColor: '#2E344E'
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
        rifleColor: '#2E344E',
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
