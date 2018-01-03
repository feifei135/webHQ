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
				[0, '#252A32']
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
			color: '#989898',
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
	//横坐标
	xAxis: {
		gridLineWidth: 0,
		lineColor: '#2E343D', //横坐标轴的颜色
		tickColor: '#2E343D', //横坐标刻度颜色;
		gridLineColor: '#2E343D',
		tickWidth:1,//X轴的刻度
		labels: {
			style: {
				color: '#989898',  //横坐标文字标签颜色
				fontWeight: 'bold'
			}
		},
		title: {
			style: {
				color: '#FFF',
				font: 'bold 12px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		}
	},
	//纵坐标
	yAxis: {
		alternateGridColor: null,
		minorTickInterval: null,
		gridLineColor: '#2E343D',  //y轴对应的网格线颜色
		lineColor:"#2E343D",
		minorGridLineColor: '#2E343D',
		lineWidth: 1, //是否显示Y轴的 轴线
		tickWidth: 0, //Y轴的刻度
		labels: {
			style: {
				color: '#989898'  //纵坐标文字标签颜色
			}
		},
		title: {
			style: {
				color: '#989898',
				font: 'bold 12px Microsoft YaHei, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		}
	},
	//图表标题导航
	legend: {
		itemStyle: {
			color: '#989898'
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
				[0, "#fff"],
				[1, '#fff']
			]
		},
		borderWidth: 0,
		style: {
			color: '#333'
		}
	},
	//标示线
	plotOptions: {
		series: {
			nullColor: '#444444',
			lineWidth:1  //数据折线宽度;
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
				fontWeight: 'bold'
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
