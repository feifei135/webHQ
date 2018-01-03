/**
 * Gray theme for Highcharts JS
 * @author Torstein Honsi
 */

Highcharts.theme_black = {
	//线的颜色
	colors: ["#0084FE", "#9023FF", "#FDA306", "black", "green", "#ff0066", "#eeaaee",
		"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	//表格整体设置;
	chart: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			//背景渐变
			stops: [
				[0, '#1c2437']
			]
		},
		borderWidth: 0, //表格的最外边框
		borderRadius: 0,
		plotBackgroundColor: null,
		plotShadow: false,
		plotBorderWidth: 0
	},
	//主标题
	title: {
		style: {
			color: '#fff',
			font: '16px Microsoft YaHei',
			//fontWeight: 'bold'
		}
	},
	//子标题
	subtitle: {
		style: {
			color: '#DDD',
			font: '12px Microsoft YaHei'
		}
	},
	//横坐标
	xAxis: {
		gridLineWidth: 0,
		lineColor: '#1c2a38', //横坐标轴的颜色
		tickColor: '#1c2a38', //横坐标刻度颜色;
		gridLineColor: '#1c2a38',
		tickWidth:1,//X轴的刻度
		crosshair: {
			color: '#434a5c',
			width: 1
		},
		labels: {
			style: {
				color: '#fff',  //横坐标文字标签颜色
				font: '12px Microsoft YaHei'
			}
		},
		title: {
			style: {
				color: '#FFF',
				font: '12px Microsoft YaHei'
			}
		}
	},
	//纵坐标
	yAxis: {
		alternateGridColor: null,
		minorTickInterval: null,
		gridLineColor: '#1c2a38',  //y轴对应的网格线颜色
		lineColor:"#1c2a38",
		minorGridLineColor: '#1c2a38',
		lineWidth: 1, //是否显示Y轴的 轴线
		tickWidth: 0, //Y轴的刻度
		labels: {
			style: {
				color: '#fff',  //纵坐标文字标签颜色
				font: '12px Microsoft YaHei'
			}
		},
		title: {
			style: {
				color: '#fff',
				font: '12px Microsoft YaHei'
			}
		}
	},
	//图表标题导航
	legend: {
		itemStyle: {
			color: '#fff',
			fontWeight:''
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
	//悬浮提示框
	tooltip: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, "#1b232b"],
				[1, '#1b232b']
			]
		},
		borderWidth: 0,
		style: {
			color: '#fff',
			font: '12px Microsoft YaHei'
		}
	},
	//标示线
	plotOptions: {
		series: {
			nullColor: '#444444',
			lineWidth:1,  //数据折线宽度;
			marker: {
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
				lineColor: '#333'
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
			hoverSymbolStroke: '#FFFFFF',
			theme: {
				fill: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
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
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
			stroke: '#000000',
			style: {
				color: '#CCC',
				//fontWeight: 'bold'
			},
			states: {
				hover: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
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
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
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
			borderColor: '#AAA'
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
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		barBorderColor: '#CCC',
		buttonArrowColor: '#CCC',
		buttonBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		buttonBorderColor: '#CCC',
		rifleColor: '#FFF',
		trackBackgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
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
// var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
