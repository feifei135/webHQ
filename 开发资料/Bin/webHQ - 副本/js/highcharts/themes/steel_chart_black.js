/**
 * Gray theme for Highcharts JS
 * @author Torstein Honsi
 */

Highcharts.theme_black = {
    //线的颜色
    colors: ["#3D7EB6", "#6279C8", "#409292", "#FA9157", "#E4A937", "#DA718F", "#C658C2",
        "#6264C8", "#538BE8", "#49A85D", "#BF7C54", "#B7A35D", "#C85265", "#A060E8", "#4C6696",
        "#458960", "#885232", "#934A4A", "#815595", "#768093"],
    colors1:[
        "#85E1fb","#4fd1f6","#20beeb",
        "#84b5ff","#4790ff","#1974ff",
        "#b199fc","#A777EF","#9D62FF",
        "#99A2FC","#818CFF","#6875FF",
        "#FF9DE7", "#FF85E1","#FF6BDB",
        "#FFB49D","#FD9B7C","#FF8864"
    ],
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
            color: 'rgba(255,255,255,0.5)',
            font: '18px Microsoft YaHei',
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
        lineColor: 'rgba(255,255,255,0.2)',
        tickColor: 'rgba(255,255,255,0.2)',
        tickLength: 5,
        crosshair: {
            color: '#fff',
            width: 1
        },
        labels: {
            style: {
                color: 'rgba(255,255,255,0.5)',
                font: '14px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
        title: {
            style: {
                color: '#2E344E',
                font: '14px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
       // crosshair: false
    },
    yAxis: {
        alternateGridColor: null,
        minorTickInterval: null,
        gridLineColor: 'rgba(255,255,255,0.2)',
        gridLineWidth: 0,
        minorGridLineColor: 'rgba(255,255,255,0.2)',
        lineWidth: 1, //是否显示Y轴的 轴线
        tickWidth: 1, //Y轴的刻度
        lineColor: 'rgba(255,255,255,0.2)',
        tickColor: 'rgba(255,255,255,0.2)',
        tickLength: 5,
        labels: {
            style: {
                color: 'rgba(255,255,255,0.5)',
                font: '14px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        },
        title: {
            style: {
                color: '#2E344E',
                font: '14px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
            }
        }
    },
    legend: {
        itemStyle: {
            color: '#ffffff',
            font: '14px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
        },
        itemHoverStyle: {
            color: '#0084FE'
        },
        itemHiddenStyle: {
            color: 'gray'
        },
        navigation: {
            activeColor: '#fff',
            animation: true,
            arrowSize: 12,
            inactiveColor: '#fff',
            style: {
                fontWeight: 'bold',
                color: '#fff',
                fontSize: '12px'
            }
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
            color: '#ccc'
        }
    },


    plotOptions: {
        series: {
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
            borderWidth:0
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
            hoverSymbolStroke: '#2E344E',
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
