$(function () {
    var chart;
    Highcharts.setOptions({
        lang: {
            noData: '暂无数据'
        }
    });
    chart = Highcharts.stockChart('container', {
        chart:{
            backgroundColor:"#1f2131",
            style: {
                fontFamily: "Helvetica Regular",
                fontSize: '20px',
                color: '#fff',
                lineHeight:"30px"
            },
            margin:[20,50,20,50]
        },
        credits:{
            enabled:false
        },
        exporting:{
            enabled:false
        },
        navigator:{
            enabled:false
        },
        rangeSelector:{
            enabled:false
        },
        series: [
            {
                type: 'line',
                name: '涨跌幅',
                data: [0.01,0.01,0.01,0.01,null,null,0.01,0.01,0.01,0.01],
                connectNulls:true,
                enableMouseTracking:false,
                visible:false,
                yAxis:0
            },
            {
                type: 'line',
                name: '价格',
                data: [13,10,15,11,5,2,1,14,12,14],
                connectNulls:true,
                color:"#34394a",
                lineWidth:1,
                yAxis:1
            },
            {
                type: 'column',
                name: '销量',
                animation:false,
                color:"#44c96e",
                data: [1,5,0,2,6,8,1,5,10,2],
                yAxis:2,
                enableMouseTracking:false
            }
        ],
        yAxis:[
            {
                id:"limit",
                // gridLineColor:"#34394a",
                // gridLineDashStyle:"solid",
                // tickLength:5,
                // tickWidth:1,
                // tickColor:"#34394a",
                // tickInterval:2,
                // tickmarkPlacement:"on",
                // allowDecimals:true,
                // // min:0,
                // // max:1,
                // visible:false
            },{
                id:"price",
                gridLineColor:"#34394a",
                gridZIndex: 4,
                tickLength:5,
                tickWidth:1,
                tickColor:"#34394a",
                tickInterval:1,
                tickmarkPlacement:"on",
                allowDecimals:true,
                min:0,
                max:16,
                endOnTick:true,
                ceiling:15,
                floor:0,//最小值
                showLastLabel:true,
                lineWidth:1,
                lineColor:"#34394a",
                labels:{
                    align:"right",
                    x:20,
                    y:5
                },
                resize: {
                    enabled: true
                },
            },{
                gridLineWidth:0,
                enabled:false,
                visible:false,
                height:'35%',
                top:'65%',
                offset: 0,
                labels:{
                    align:"right",
                    x:20,
                    y:5
                },
            }
        ],
        xAxis:{
            tickLength:0,
            tickWidth:0,
            tickmarkPlacement:" on",
            // labels:{
            //     formatter:function(){

            //     }
            // },
            // alternateGridColor:"rgba(255,255,255,0.1)",
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%y-%m',
                year: '%Y'
            }
        },
        scrollbar:{
            enabled:false
        },
        tooltip: {
            split: false,
            shared: true,
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        }
    });
});
