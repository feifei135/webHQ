var KLineSocket;
var _this;
$(document).keydown(function(e){
    if(_this!=undefined&&($(_this).attr("id")=="MLine"||$(_this).attr("id")=="kline")){
        $(_this).children(".charts-focus").focus();
        return;
    }
});

;(function($){
    // websocket通道-查询K线
    $.queryKLine = function(option) {
        
        // 实例化websocket默认参数 
        KLineSocket = new WebSocketConnect(option);
        // 建立websocket连接，命名为ws
        KLineSocket.ws = KLineSocket.createWebSocket();
        // 发起websocket请求
        initSocketEvent(KLineSocket);
                                 
        // 点击查询周期K线
        $("#tab li").on("click",function(){

            // 点击的K线类型
            var klineType = $(this).attr("id");

            // 判断当前查询的是否是上一次查询的类型
            if(KLineSocket.option){
                if(KLineSocket.HistoryData.preLineType == klineType){
                    return;
                }
            }

            // 创建新的查询对象参数-存储的都是实时改变的参数
            var KLrequireObj = new KLineRequire(option, klineType);
            // 把请求参数赋值给已经开启的websocket参数
            KLineSocket.option = $.extend({},KLineSocket.option,KLrequireObj.options);
            
            // 显示没有数据
            $("#withoutData").show().siblings().hide();
            

            // 清空K线图
            if(KLineSocket.KChart.getOption()&&KLineSocket.KChart.getOption().series.length!=0){
                KLineSocket.KChart.dispose();
                KLineSocket.KChart = echarts.init(document.getElementById('kline_charts'));
            }

            // 取消之前的订阅,同时清空历史数据数组
            if(KLineSocket.HistoryData.preLineType!=undefined&&KLineSocket.HistoryData.preLineType!=""){
                KLineSocket.getKWatchCC();

                 // 清空数据，设置假数据
                $.each(KLineSocket.HistoryData,function(i,obj){
                    if(typeof KLineSocket.HistoryData[i] == "string"){
                        KLineSocket.HistoryData[i] = "";
                    }
                    if(obj instanceof Array){
                        KLineSocket.HistoryData[i] = [];
                    }
                    if(typeof KLineSocket.HistoryData[i] == "number"){
                        KLineSocket.HistoryData[i] = 0;
                    }
                    if(typeof KLineSocket.HistoryData[i] == "boolean"){
                        KLineSocket.HistoryData[i] = 0;
                    }
                });
            }

            // 点击分时图，不进行提交
            if(klineType=="mline"){
                return;
            } 
            KLineSocket.HistoryData.queryTimes = 0;

            KLineSocket.ws.onopen();

            // 当前K线存储为前一根K线
            KLineSocket.HistoryData.preLineType = KLineSocket.option.lineType;     

            // K线前一根柱子的收盘价
            KLineSocket.option.lastClose = 0; 
                
        });
    };

})(jQuery);
function tabLi(index){
    if(index==0){
        $("#MLine").show();
        $("#kline").hide();
    }else{
        $("#kline").show();
        $("#MLine").hide();
    }
}
/*
 * websocket
 */
// K线请求数据参数
var KLineRequire = function(option, klineType){
    var ExchangeID = option.ExchangeID?option.ExchangeID:"1",
        InstrumentID = option.InstrumentID?option.InstrumentID:"1",
        msgType = null,
        instrumenttype = null;
    // 对象默认请求参数
    this.options = {
        lineType: klineType?klineType:null,
        lastClose: 0,
        // 查询历史数据
        // 日、周、月、年-最后199条-为了索引为整百的数据
        HistoryKQFirstDayPrev: {         
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType: "",  
            StartIndex: "-1", 
            StartDate: "0", 
            Count: "199" 
        },
        // 日、周、月、年-从第二次开始每次请求200条,StartIndex为整百，
        // 在每次查询到历史数据的时候进行扩展后再次进行查询
        HistoryKQAllDayPrev:{
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType: "",  
            StartIndex: "", 
            StartDate: "0", 
            Count: "200"
        },
        // 分钟周期K线，当前这一天的K线查询
        // 当date<0时,不管其他查询条件是否设置,表示查询当前交易日截至查询时间所有数据
        // 当date>0时,不管其他查询条件,表示查询指定date为交易日的所有数据,可能是历史交易日数据也可能是当前交易日数据,依据date的值
        // 当date=0时,依据index与count进行查询,查询的是历史交易日数据,index<0时,表示从后向前查询,查询的位置由index决定,条数由count决定,
        // 其中-1表示倒数第一条开始,-2表示倒数第二条开始; index>=0时,表示从前向后查询,查询的位置也由index决定,
        // 条数由count决定,其中0表示正数第一条,1表示正数第二条[分钟线类查询条件变更说明]
        HistoryKQAllMinToday: {         
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType: "",  
            StartIndex: "0", 
            StartDate: "-1", 
            StartTime: "0",
            Count: "242" 
        },
        // 分钟K线历史记录查询，从昨天开始的交易数据，
        // 第一次查询199条-为了索引为整百的数据
        HistoryKQFirstMinPrev: {         
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType: "",  
            StartIndex: "-1", 
            StartDate: "0", 
            StartTime: "0",
            Count: "199" 
        },
        // 分钟K线历史记录查询，从昨天开始的交易数据，
        // 从第二次开始每次请求200条,StartIndex为整百，
        // 在每次查询到历史数据的时候进行扩展后再次进行查询
        HistoryKQAllMinPrev:{
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType: "",  
            StartIndex: "", 
            StartDate: "0", 
            StartTime: "0",
            Count: "200"
        },
        // 订阅
        KWatch: {                
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType:"S1010",
            Instrumenttype:""
        },
        // 取消订阅
        KWatchCC: {              
            InstrumentID: InstrumentID,
            ExchangeID: ExchangeID,
            MsgType:"N1010",
            Instrumenttype:""
        }
    };

    var objKWatch = getQueryType(klineType);
    // 确定订阅类型
    this.options.KWatch = $.extend({}, this.options.KWatch, { Instrumenttype: objKWatch.Instrumenttype });

    // 更新查询历史数据参数-日周月年
    this.options.HistoryKQFirstDayPrev = $.extend({}, this.options.HistoryKQFirstDayPrev, { MsgType: objKWatch.MsgType});
    this.options.HistoryKQAllDayPrev = $.extend({}, this.options.HistoryKQAllDayPrev, { MsgType: objKWatch.MsgType});
        
    // 更新查询历史数据参数-分钟
    this.options.HistoryKQAllMinToday = $.extend({}, this.options.HistoryKQAllMinToday, { MsgType: objKWatch.MsgType }); 
    this.options.HistoryKQFirstMinPrev = $.extend({}, this.options.HistoryKQFirstMinPrev, { MsgType: objKWatch.MsgType }); 
    this.options.HistoryKQAllMinPrev = $.extend({}, this.options.HistoryKQAllMinPrev, { MsgType: objKWatch.MsgType});

    // 上一次查询的K线类型-用于取消订阅
    if(KLineSocket.HistoryData.preLineType!=undefined){
        var objKWatchCC = getQueryType(KLineSocket.HistoryData.preLineType);
        this.options.KWatchCC = $.extend({}, this.options.KWatchCC, { Instrumenttype: objKWatchCC.Instrumenttype });
    }
};
function getQueryType(klineType){
    var typeObj = {
        MsgType: null,
        Instrumenttype: null
    }
    switch(klineType){
        case "day":
            typeObj = {         // 日K线：Q3021
                MsgType: "Q3021",
                Instrumenttype: "1"
            }
            break;
        case "week":
            typeObj = {         // 周K线：Q3022
                MsgType: "Q3022",
                // Instrumenttype: "11"
            }
            break;
        case "month":
            typeObj = {         // 月K线：Q3023
                MsgType: "Q3023",
                // Instrumenttype: "11"
            }
            break;
        case "year":
            typeObj = {         // 年K线：Q3025
                MsgType: "Q3025",
                // Instrumenttype: "11"
            }
            break;
        case "minute":
            typeObj = {         // 1分钟K线：Q3011
                MsgType: "Q3011",
                Instrumenttype: "11"
            }
            break;
        case "fivem":
            typeObj = {         // 5分钟K线：Q3012
                MsgType: "Q3012",
                Instrumenttype: "12"
            }
            break;
        case "tenm":          
            typeObj = {         // 10分钟K线：Q3013
                MsgType: "Q3013",
                Instrumenttype: "13"
            }
            break;
        case "fifm":
            typeObj = {         // 15分钟K线：Q3014
                MsgType: "Q3014",
                Instrumenttype: "14"
            }
            break;
        case "thim":
            typeObj = {         // 30分钟K线：Q3015
                MsgType: "Q3015",
                Instrumenttype: "15"
            }
            break;
        case "hour":       
            typeObj = {         // 60分钟K线：Q3016
                MsgType: "Q3016",
                Instrumenttype: "16"
            }
            break;
        default:;
    };
    return typeObj;
}
// websocket实例化相关参数以及数据存储参数
var WebSocketConnect = function(options){
    this.wsUrl = options.wsUrl?options.wsUrl:"ws://103.66.33.67:80";
    this.stockXMlUrl = options.stockXMlUrl?options.stockXMlUrl:"http://103.66.33.58:443/GetCalcData?ExchangeID=2&Codes=1";
    this.ws = null;
    this.lockReconnect = false;
    this.timeout = 60000;       //60秒
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.KChart = echarts.init(document.getElementById('kline_charts'));
    // this.option = options;      // 将请求参数等，存储在socket中
    // this.HistoryData = options.HistoryData?options.HistoryData:null;        // 历史数据存储，为了添加新数据时，能够准确记录所有数据
    // 心跳包
    this.HeartSend = {          
        InstrumentID: options.InstrumentID,
        ExchangeID: options.ExchangeID,
        MsgType: "Q8050"
    };
    this.HistoryData = {
        hDate: [],                  // 日期
        hDay: [],                   // 星期
        hTime: 0,                   // 如果为日K线，存储最后一条时间
        hCategoryList: [],          // 横轴
        hValuesList: [],            // 值-开收低高
        hValuesPercentList: [],     // 值-对应的百分比
        hVolumesList: [],           // 成交量
        hZValuesList: [],           // 涨幅
        hZValuesListPercent: [],    // 涨幅百分比
        hZf: [],                    // 振幅
        hZfList: [],                // 振幅百分比
        preLineType: null,          // 前一次查询的线类型
        queryTimes:0,               // 查询数据次数
        dataLengthToday:0,          // 分钟K线查询当天的
        dataLength: 0,              // 查询的历史数据参数            
        stopQuery: null,            // 是否已经停止查询历史数据
        watchDataCount:0            // 目前已经累计的订阅数量
    };

    this.KLineSet = {
        mouseHoverPoint: 0,         // 当前现实的数据索引
        isHoverGraph: false,        // 是否正在被hover
        zoom: 10,
        start: 0
    };
    // 数据查询参数
    this.option = {
        KWatchKZ: {
            InstrumentID: options.InstrumentID,
            ExchangeID: options.ExchangeID,
            MsgType:"S1010",
            Instrumenttype:"1"
        },
        lineType: null
    };
};
WebSocketConnect.prototype = {
    createWebSocket:    function () {
                            try {
                                this.ws = new WebSocket(this.wsUrl);
                                return this.ws;
                            } catch (e) {
                                this.reconnect(); //如果失败重连
                            }
                        },
    reconnect:  function () {
                    var _target = this;
                    if (_target.lockReconnect) return;
                    _target.lockReconnect = true;
                    KLineSocket.HistoryData.queryTimes = 0;
                    //没连接上会一直重连，设置延迟避免请求过多
                    setTimeout(function () {
                        var ws = _target.createWebSocket(_target.wsUrl);
                        _target.ws = _target.createWebSocket(_target.wsUrl);

                        initSocketEvent(_target);

                        _target.lockReconnect = false;
                        console.log("重连中……");
                    }, 2000);
                },
    //发送请求
    request:    function (data) {
                    this.ws.send(JSON.stringify(data));
                },
    //重置心跳包
    reset:      function () {
                    clearTimeout(this.timeoutObj);
                    clearTimeout(this.serverTimeoutObj);
                    return this;
                },
    //开始心跳包
    start:      function () {
                    var self = this;
                    this.timeoutObj = setTimeout(function () {
                        //这里发送一个心跳，后端收到后，返回一个心跳消息，
                        // onmessage拿到返回的心跳就说明连接正常
                        self.getHeartSend();
                        self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                            self.ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                        }, self.timeout)
                    }, self.timeout)
                }
};
WebSocketConnect.prototype.__proto__ = {
    // 查询历史数据
    // 日、周、月、年-最后199条-为了索引为整百的数据
    getHistoryKQFirstDayPrev: function(){
                            this.request(this.option.HistoryKQFirstDayPrev);
                        },
    // 日、周、月、年-从第二次开始每次请求200条,StartIndex为整百，
    // 在每次查询到历史数据的时候进行扩展后再次进行查询
    getHistoryKQAllDayPrev: function(){
                            this.request(this.option.HistoryKQAllDayPrev);
                        },
    // 分钟周期K线，当前这一天的K线查询
    getHistoryKQAllMinToday: function(){
                            this.request(this.option.HistoryKQAllMinToday);
                        },
    // 分钟K线历史记录查询，从昨天开始的交易数据，
    // 从第二次开始每次请求200条,StartIndex为整百，
    // 在每次查询到历史数据的时候进行扩展后再次进行查询
    getHistoryKQFirstMinPrev: function(){
                            this.request(this.option.HistoryKQFirstMinPrev);
                        },
    // 分钟K线历史记录查询，从昨天开始的交易数据，
    // 从第二次开始每次请求200条,StartIndex为整百，
    // 在每次查询到历史数据的时候进行扩展后再次进行查询
    getHistoryKQAllMinPrev: function(){
                        this.request(this.option.HistoryKQAllMinPrev);
                    },
    // getHistoryKQAll:    function(){
    //                         this.request(this.option.HistoryKQFirstDayPrev);
    //                     },
    // 查询历史数据
    // getHistoryKQAllPrev:    function(){
    //                         this.request(this.option.HistoryKQAllPrev);
    //                     },
    // 订阅K线
    getKWatch:       function(){
                            this.request(this.option.KWatch);
                        },
    // 取消订阅K线
    getKWatchCC:     function(){
                            this.request(this.option.KWatchCC);
                        },
    getHeartSend:       function(){
                            this.request(this.HeartSend);
                        },
};
// websocket请求
var initSocketEvent = function(socket){

    socket.ws.onclose = function () {
                    console.log("终端重连……");
                    socket.reconnect(); //终端重连
                };
    socket.ws.onerror = function () {
                    console.log("报错重连……");
                    socket.reconnect(); //报错重连
                };
    socket.ws.onopen = function () {
                    console.log("open");
                    
                    //心跳检测重置
                    socket.reset().start();                 // 第一次建立连接则启动心跳包

                    /*
                     * 个股/指数 实时数据，通过快照接口
                     * 其他数据，处理方式不同
                     */
                    // socket.option.lineType-区分查询历史数据和指数/个股信息
                    if(socket.option.lineType&&socket.option.lineType=="mline"){
                        return
                    }

                    switch(socket.option.lineType){
                        case "day":
                        case "week":
                        case "month":
                        case "year":
                            socket.getHistoryKQFirstDayPrev();
                            break;
                        case "minute":
                        case "fivem":
                        case "tenm":
                        case "fifm":
                        case "thim":
                        case "hour":
                            socket.getHistoryKQAllMinToday();
                            break;
                        default:;
                    }
                    
                };
    socket.ws.onmessage = function (evt) {
                    // console.log("打开成功");
                    var jsons  = evt.data.split("|");  //每个json包结束都带有一个| 所以分割最后一个为空
                    $.each(jsons,function (i,o) {
                        if(o!==""){
                            try{
                                var data = eval("(" + o + ")");
                            }catch(e){
                                console.log(e);
                                return;
                            }
                            
                            var dataList = data.KLineSeriesInfo?data.KLineSeriesInfo:new Array(data);
                            var MsgType =  data["MsgType"] || data[0]["MsgType"]; //暂时用他来区分推送还是历史数据 如果存在是历史数据,否则推送行情
                            var ErrorCode = data["ErrorCode"]?data["ErrorCode"]:null;
                            if(ErrorCode){
                                console.info(data["Content"]);
                                return;
                            }

                            /*
                             * 个股/指数 实时数据，通过快照接口
                             * 其他数据，处理方式不同
                             */
                            // socket.option.lineType-区分查询历史数据和指数/个股信息
                            switch(MsgType){
                                case "P0001":       // 订阅日K线
                                    // K线接口
                                    // var msgTypeNow = getQueryType(KLineSocket.option.lineType);
                                    // if( MsgType.slice(1) != msgTypeNow.MsgType.slice(1)){
                                    //     return;
                                    // }
                                    KCharts(dataList);
                                    break;
                                case "P0011":        // 1分钟K线订阅分钟线应答
                                case "P0012":        // 5分钟K线订阅分钟线应答
                                case "P0013":        // 10分钟K线订阅分钟线应答
                                case "P0014":        // 15分钟K线订阅分钟线应答
                                case "P0015":        // 30分钟K线订阅分钟线应答
                                case "P0016":        // 60分钟K线订阅分钟线应答
                                    // var msgTypeNow = getQueryType(KLineSocket.option.lineType);
                                    // if( MsgType.slice(1) != msgTypeNow.MsgType.slice(1)){
                                    //     return;
                                    // }
                                    KCharts(dataList);
                                    break;
                                case "R3011":        // 1分钟K线历史数据查询
                                case "R3012":        // 5分钟K线历史数据查询
                                case "R3013":        // 10分钟K线历史数据查询
                                case "R3014":        // 15分钟K线历史数据查询
                                case "R3015":        // 30分钟K线历史数据查询
                                case "R3016":        // 60分钟K线历史数据查询
                                    // socket.getKWatch();      // 订阅当前日期K线=分钟K线
                                    // KCharts(dataList, "history");
                                    // break;
                                case "R3021":        // 日K线历史数据查询
                                case "R3022":        // 周K线历史数据查询
                                case "R3023":        // 月K线历史数据查询
                                case "R3025":        // 年K线历史数据查询
                                // console.log(data.KLineCount)
                                    var msgTypeNow = getQueryType(KLineSocket.option.lineType);
                                    if( msgTypeNow.MsgType&&(MsgType.slice(1) != msgTypeNow.MsgType.slice(1))){
                                        return;
                                    }
                                    if(KLineSocket.HistoryData.queryTimes==0){
                                        $.each(KLineSocket.HistoryData,function(i,obj){
                                            if(obj instanceof Array){
                                                // KLineSocket.HistoryData[i] = new Array(data.KLineCount);
                                                // KLineSocket.HistoryData.dataLength = data.KLineCount;

                                                KLineSocket.HistoryData.dataLength = data.KLineCount>=720?720:data.KLineCount;
                                                KLineSocket.HistoryData[i] = new Array(KLineSocket.HistoryData.dataLength);
                                                


                                                if(i == "hCategoryList"){
                                                    $.each(KLineSocket.HistoryData.hCategoryList,function(i,o){
                                                        KLineSocket.HistoryData.hCategoryList[i] = "1997-01-01 一 13:00";          // 横轴
                                                    });
                                                }
                                                if(i == "hValuesList"){
                                                    
                                                    $.each(KLineSocket.HistoryData.hCategoryList,function(i,o){
                                                        KLineSocket.HistoryData.hValuesList[i] = [null,null,null,null];           // 值-开收低高
                                                    });
                                                }
                                                if(i == "hVolumesList"){
                                                    
                                                    $.each(KLineSocket.HistoryData.hCategoryList,function(i,o){
                                                        KLineSocket.HistoryData.hVolumesList[i] = [i,0,1];           // 值-开收低高
                                                    });
                                                }
                                            }
                                        });

                                        socket.getKWatch();      // 订阅当前日期K线=分钟K线
                                    }
                                    KCharts(dataList, "history");
                                    break;    
                                case "R8050":  //心跳包
                                    // console.log(data);
                                default:
                            }
                        }
                    });
                    //如果获取到消息，心跳检测重置
                    //拿到任何消息都说明当前连接是正常的
                    socket.reset().start();
                };
};

/*
 * 绘制KCharts图相关函数
 */
// K线图方法
function KCharts(dataList, isHistory){

    if(dataList){
        $("#withoutData").hide().siblings().show();
        // 解析数据
        var dataJsons = splitData(dataList, isHistory); 
        
        // 存储数据
        saveData(dataJsons, isHistory);
        // 画图
        chartPaint(isHistory);
        // 初始化并显示数据栏和数据信息框的信息
        initMarketTool();

        /*
         * K线图事件绑定
         */
        // ecahrts显示tooltip
        KLineSocket.KChart.on('showTip', function (params) {
            KLineSocket.KLineSet.mouseHoverPoint = params.dataIndex;
            var length = KLineSocket.HistoryData.hCategoryList.length;
            setToolInfo(length, 'showTip');
        });
        // 鼠标滑过，出现信息框
        $("#kline_charts").bind("mouseenter", function (event) {
            toolContentPosition(event);
            $("#kline_tooltip").show();

            _this = $("#kline");
        });
        $("#kline_charts").bind("mousemove", function (event) {
            KLineSocket.KLineSet.isHoverGraph = true;
            $("#kline_tooltip").show();
            toolContentPosition(event);

            _this = $("#kline");
        });
        $("#kline_charts").bind("mouseout", function (event) {
            KLineSocket.KLineSet.isHoverGraph = false;
            $("#kline_tooltip").hide();
            KLineSocket.KLineSet.mouseHoverPoint = 0;
            initMarketTool();// 显示信息

            $(_this).children(".charts-focus").blur();
            _this = window;
        });
    }
};
// 解析获取到的数据
function splitData(data, isHistory) {
    let k_date = [],                        // 日期
        k_day = [],                         // 星期
        k_time = [],                        // 时间
        k_categoryData = [],                // x轴分割线坐标数组
        k_values = [],                      // 二维数组：开收低高-四个数值的数组-蜡烛图
        k_valuesPercent = [],               // 二维数组：开收低高-四个百分比值-相对昨收
        k_zValues = [],                     // 涨幅-数值
        k_zValuesPercent = [],              // 涨幅-百分比
        k_volumns = [],                     // 柱形图数据-成交量
        k_amplitude = [],                   // 振幅-K线最高减去最低的值        
        k_amplPercent = [],                 // 振幅百分比-相对昨收
        week = ["日","一","二","三","四","五","六"],
        data_length = 0;

    // 遍历json，将它们push进不同的数组
    $.each(data,function(i,object){
        
        let e_date = formatDateSplit(object.Date),                 // 当天日期
            e_day = week[(new Date(e_date)).getDay()],        // 计算星期
            e_time;  

        if(KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year"){
            KLineSocket.HistoryData.hTime = formatTime((object.Time/100000>=1)?object.Time:("0"+object.Time));
            k_categoryData.push(e_date);
        }else{
            e_time = e_date + " " + e_day + " " + formatTime((object.Time/100000>=1)?object.Time:("0"+object.Time));
            k_categoryData.push(e_time);
        }  

        if(!KLineSocket.option.lastClose){
            KLineSocket.option.lastClose = object.Open;                          // 上一根柱子的收盘价
        }
        // 如果是最后一条数据的更新，lastClose就是前一根柱子的收盘价
        if(k_categoryData[0].toString() == KLineSocket.HistoryData.hCategoryList[KLineSocket.HistoryData.hCategoryList.length-1]){
            KLineSocket.option.lastClose = KLineSocket.HistoryData.hValuesList[KLineSocket.HistoryData.hValuesList.length-1][1];
        }

        let e_open = (object.Open),          // 开
            e_highest = (object.High),       // 高
            e_lowest = (object.Low),         // 低
            e_price = ((KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year")&&(!isHistory))?(object.Last):(object.Price),           // 收盘价
            e_value = [                                       // 开收低高-蜡烛图数据格式
                e_open, 
                e_price, 
                e_lowest, 
                e_highest
            ],
            e_valuePercent = [                                // 开收低高-百分比-相对上一根柱子的收盘价
                ((e_open-KLineSocket.option.lastClose)*100/KLineSocket.option.lastClose),
                ((e_price-KLineSocket.option.lastClose)*100/KLineSocket.option.lastClose),
                ((e_lowest-KLineSocket.option.lastClose)*100/KLineSocket.option.lastClose),
                ((e_highest-KLineSocket.option.lastClose)*100/KLineSocket.option.lastClose)
            ],
            e_volumnData = object.Volume,                              // 成交量---单位：股
            e_zValues = KLineSocket.option.lastClose?(e_price-KLineSocket.option.lastClose):0,               // 涨幅-相对昨收      
            e_zValuesPercent = (e_zValues*100/KLineSocket.option.lastClose),              // 涨幅百分比
            e_amplitude = (e_highest - e_lowest),                      // 振幅
            e_amplPercent = (100*e_amplitude/KLineSocket.option.lastClose);               // 振幅百分比

        if(isHistory){
            e_volume = (e_price-e_open)>=0?[i,e_volumnData,-1]:[i,e_volumnData,1];   // 成交量-数组，存储索引，值，颜色对应的值                         
        }else{
            e_volume = (e_price-e_open)>=0?[KLineSocket.HistoryData.hVolumesList.length,e_volumnData,-1]:[KLineSocket.HistoryData.hVolumesList.length,e_volumnData,1];  
        }

        KLineSocket.option.lastClose = e_price;

        // 每条数据存入数组中
        k_date.push(e_date);                
        k_day.push(e_day);   
        k_time.push(e_time);        
            
        k_values.push(e_value);             
        k_valuesPercent.push(e_valuePercent);
        k_volumns.push(e_volume);   
        k_zValues.push(e_zValues);
        k_zValuesPercent.push(e_zValuesPercent);
        k_amplitude.push(e_amplitude);
        k_amplPercent.push(e_amplPercent);
    });

    // 返回K线图所需数据对象
    return {
        date: k_date,                       
        day: k_day,                        
        categoryData: k_categoryData,       
        values: k_values,     
        valuesPercent: k_valuesPercent,              
        volumes: k_volumns,                 
        zValues: k_zValues,                 
        zValuePercent: k_zValuesPercent,
        amplitude: k_amplitude,
        amplPercent: k_amplPercent
    }
};

// 保存获取的数据到相对应的数据中，存入数据对象
function saveData(data, isHistory){
    if(isHistory){
        // 所有数据总长度
        var categoryLength = KLineSocket.HistoryData.hCategoryList.length;
        // 查询到的数据总长度
        var dataLength = data.categoryData.length;

        // 日、周、月、年的K线
        // 第一次查询历史数据，直接计算长度，总长度-数据长度=第一条历史数据索引值
        // 第二次以后减去每次200条，和第一次的199条即可
        if(KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year"){
            if(KLineSocket.HistoryData.queryTimes==0){
                var index = categoryLength - dataLength;
            }else{
                var index = categoryLength -199 - KLineSocket.HistoryData.watchDataCount - 200*(KLineSocket.HistoryData.queryTimes - 1 ) - dataLength;
            }
        }else{
            // 分钟周期K线，第一次查询当日数据，直接计算长度，总长度-数据长度=第一条历史数据索引值
            // 第二次才开始查询历史数据-199条
            // 所以，在第三次以后，以后减去每次200条，和第二次的199条即可
            if(KLineSocket.HistoryData.queryTimes==0){
                var index = categoryLength -  dataLength;
                KLineSocket.HistoryData.dataLengthToday = dataLength;
            }else if(KLineSocket.HistoryData.queryTimes==1){
                var index = categoryLength - KLineSocket.HistoryData.dataLengthToday - dataLength - KLineSocket.HistoryData.watchDataCount;
            }else{
                var index = categoryLength - KLineSocket.HistoryData.dataLengthToday -199 - KLineSocket.HistoryData.watchDataCount - 200*(KLineSocket.HistoryData.queryTimes - 2 ) - dataLength;
            }
        }

        $.each(data.volumes,function(i,o){
            o[0] = o[0]+index;
        })
        
        // 将模拟的假数据进行拼接，重新赋值给历史数组
        KLineSocket.HistoryData.hDate = KLineSocket.HistoryData.hDate.slice(0,index).concat(data.date,KLineSocket.HistoryData.hDate.slice(index+dataLength));
        KLineSocket.HistoryData.hDay = KLineSocket.HistoryData.hDay.slice(0,index).concat(data.day,KLineSocket.HistoryData.hDay.slice(index+dataLength));
        KLineSocket.HistoryData.hCategoryList = KLineSocket.HistoryData.hCategoryList.slice(0,index).concat(data.categoryData,KLineSocket.HistoryData.hCategoryList.slice(index+dataLength));
        KLineSocket.HistoryData.hValuesList = KLineSocket.HistoryData.hValuesList.slice(0,index).concat(data.values,KLineSocket.HistoryData.hValuesList.slice(index+dataLength));
        KLineSocket.HistoryData.hValuesPercentList = KLineSocket.HistoryData.hValuesPercentList.slice(0,index).concat(data.valuesPercent,KLineSocket.HistoryData.hValuesPercentList.slice(index+dataLength));
        KLineSocket.HistoryData.hVolumesList = KLineSocket.HistoryData.hVolumesList.slice(0,index).concat(data.volumes,KLineSocket.HistoryData.hVolumesList.slice(index+dataLength));
        KLineSocket.HistoryData.hZValuesList = KLineSocket.HistoryData.hZValuesList.slice(0,index).concat(data.zValues,KLineSocket.HistoryData.hZValuesList.slice(index+dataLength));
        KLineSocket.HistoryData.hZValuesListPercent = KLineSocket.HistoryData.hZValuesListPercent.slice(0,index).concat(data.zValuePercent,KLineSocket.HistoryData.hZValuesListPercent.slice(index+dataLength));
        KLineSocket.HistoryData.hZf = KLineSocket.HistoryData.hZf.slice(0,index).concat(data.amplitude,KLineSocket.HistoryData.hZf.slice(index+dataLength));
        KLineSocket.HistoryData.hZfList = KLineSocket.HistoryData.hZfList.slice(0,index).concat(data.amplPercent,KLineSocket.HistoryData.hZfList.slice(index+dataLength));
        
    }else{
        var n_date = data.date[0];
        var n_day = data.day[0];
        var n_category = data.categoryData[0];  // 最后一分钟的时间
        var n_values = data.values[0];          // 要存储的values
        var n_zValues = data.zValues[0];        // 涨跌
        var n_zValuePercent = data.zValuePercent[0]; // 涨跌幅
        var n_volumes = data.volumes[0];            // 成交量
        var n_valuesPercent = data.valuesPercent[0];
        var n_zf = data.amplitude[0];
        var n_zfList = data.amplPercent[0];
        var lastTime = KLineSocket.HistoryData.hCategoryList[KLineSocket.HistoryData.hCategoryList.length-1];

        // 最新一条是历史category数据中的最后一条，则更新最后一条数据,否则push到数组里面
        if(n_category.toString() == lastTime){

            n_volumes[0] = n_volumes[0]-1;

            KLineSocket.HistoryData.hValuesList[KLineSocket.HistoryData.hValuesList.length-1] = n_values;
            KLineSocket.HistoryData.hVolumesList[KLineSocket.HistoryData.hVolumesList.length-1] = n_volumes;
            KLineSocket.HistoryData.hZValuesList[KLineSocket.HistoryData.hZValuesList.length-1] = n_zValues;
            KLineSocket.HistoryData.hZValuesListPercent[KLineSocket.HistoryData.hZValuesListPercent.length-1] = n_zValuePercent;
            KLineSocket.HistoryData.hValuesPercentList[KLineSocket.HistoryData.hValuesPercentList.length-1] = n_valuesPercent;
            KLineSocket.HistoryData.hZf[KLineSocket.HistoryData.hZf.length-1] = n_zf;
            KLineSocket.HistoryData.hZfList[KLineSocket.HistoryData.hZfList.length-1] = n_zfList;
        }else{
            KLineSocket.HistoryData.watchDataCount++;
            KLineSocket.HistoryData.hDate.push(n_date);
            KLineSocket.HistoryData.hDay.push(n_day);
            KLineSocket.HistoryData.hCategoryList.push(n_category);
            KLineSocket.HistoryData.hValuesList.push(n_values);
            KLineSocket.HistoryData.hVolumesList.push(n_volumes); 
            KLineSocket.HistoryData.hZValuesList.push(n_zValues);
            KLineSocket.HistoryData.hZValuesListPercent.push(n_zValuePercent);
            KLineSocket.HistoryData.hValuesPercentList.push(n_valuesPercent);
            KLineSocket.HistoryData.hZf.push(n_zf);
            KLineSocket.HistoryData.hZfList.push(n_zfList);
        };
    }
};
// 绘制/画K线图
function chartPaint(isHistory){
    if(isHistory){
        
        // 第一次请求时，确定
        if(KLineSocket.HistoryData.queryTimes==0){
            // zoom起始的位置
            var startZoom = (60/KLineSocket.HistoryData.dataLength>=1)?0:Math.ceil(100-80/(KLineSocket.HistoryData.dataLength+10)*100);
            var maxValueSpan=1000;
            var minValueSpan=10;
            // 绘制K线图
            KLineSocket.KChart.setOption({
                backgroundColor: "#fff",
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                hoverLayerThreshold:3000,
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#555' 
                    },
                    type: 'line',
                    lineStyle:{
                        type: 'dotted',
                        color: '#000'
                    },
                    show:true,
                    triggerTooltip:false
                },
                grid: [
                    {
                        top: "5%",
                        height: '62.4%'
                    },
                    {
                        top: '77.8%',
                        height: '12.2%'
                    }
                ],
                dataZoom: [
                {
                        show: true,
                        xAxisIndex: [0, 1],
                        type: 'slider',
                        top: '91.5%',
                        start: startZoom,
                        end: 100,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize:'100%',
                        handleStyle:{
                            color:"#f2f2f2",
                            borderColor: "#b4b4b4"
                        },
                        dataBackground: {
                            lineStyle: {
                                color: "rgba(0,0,0,1)"
                            },
                            areaStyle: {
                                color: "rgba(0,0,0,0)"
                            }
                        },
                        maxValueSpan: maxValueSpan,
                        minValueSpan: minValueSpan,
                        labelFormatter: function (valueStr) {
                            
                            if(KLineSocket.option.lineType!="mline"){
                                var valueList = KLineSocket.HistoryData.hCategoryList[valueStr].split(" ");
                                return valueList[valueList.length-1];
                            }

                        },
                        showDetail: true
                    },
                {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: startZoom,
                        end: 100,
                        maxValueSpan: maxValueSpan,
                        minValueSpan: minValueSpan
                    },
                ],
                visualMap: {
                    show: false,
                    seriesIndex: 1,
                    dimension: 2,
                    pieces: [
                        {   value: 1, 
                            color: '#3bc25b'
                        },
                        {
                            value: -1,
                            color: "#e22f2a"
                        }
                    ]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: KLineSocket.HistoryData.hCategoryList,
                        scale: true,
                        boundaryGap: false,
                        axisTick:{ show:false },
                        axisLine: { show:false },
                        splitLine: {
                            show: true,
                            interval: function(index,value){
                                
                                var valueList = KLineSocket.HistoryData.hCategoryList;
                                var timeCurr = valueList[index].split(" ")[2];
                                var startTime = xml.options.nowDateTime[0].startTime;
                                var endTime = xml.options.nowDateTime[0].endTime;
                                var startTime1 = xml.options.nowDateTime[xml.options.nowDateTime.length-1].startTime1;
                                var endTime1 = xml.options.nowDateTime[xml.options.nowDateTime.length-1];
                                
                                switch(KLineSocket.option.lineType){
                                    case "day":
                                        var value = setCategoryPrev(valueList,index,"-",1,4,0);
                                        return value;
                                        break;
                                    case "week":
                                        var value = setCategoryPrev(valueList,index,"-",1,12,1);
                                        return value;
                                        break;
                                    case "month":
                                        var value = setCategoryPrev(valueList,index,"-",0,3,0);
                                        return value;
                                        break;
                                    case "year":
                                        var value = setCategoryPrev(valueList,index,"-",0,8,0);
                                        return value;
                                        break;
                                    case "minute":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,1,valueList[index],1);
                                        return value;
                                        break;
                                    case "fivem":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,5,valueList[index],2);
                                        return value;
                                        break;
                                    case "tenm":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,10,valueList[index],2);
                                        return value;
                                        break;
                                    case "fifm":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,15,valueList[index],2);
                                        return value;
                                        break;
                                    case "thim":
                                    case "hour":
                                        var value = setCategoryPrev(valueList,index," ",0,null,1,"-",2);
                                        return value;
                                        break;
                                    default:;
                                }
                            },
                            lineStyle: {
                                color: '#efefef'
                            }
                        },
                        axisLabel: {
                            show: true,
                            color: '#666',
                            fontSize: 12,
                            showMaxLabel: true,
                            showMinLabel: true,
                            interval: function(index,value){
                                var valueList = KLineSocket.HistoryData.hCategoryList;
                                var timeCurr = valueList[index].split(" ")[2];
                                var startTime = xml.options.nowDateTime[0].startTime;
                                var endTime = xml.options.nowDateTime[0].endTime;
                                var startTime1 = xml.options.nowDateTime[xml.options.nowDateTime.length-1].startTime1;
                                var endTime1 = xml.options.nowDateTime[xml.options.nowDateTime.length-1];
                                switch(KLineSocket.option.lineType){
                                    case "day":
                                        var value = setCategoryPrev(valueList,index,"-",1,4,0);
                                        return value;
                                        break;
                                    case "week":
                                        var value = setCategoryPrev(valueList,index,"-",1,12,1);
                                        return value;
                                        break;
                                    case "month":
                                        var value = setCategoryPrev(valueList,index,"-",0,3,0);
                                        return value;
                                        break;
                                    case "year":
                                        var value = setCategoryPrev(valueList,index,"-",0,8,0);
                                        return value;
                                        break;
                                    case "minute":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,1,valueList[index],1);
                                        return value;
                                        break;
                                    case "fivem":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,5,valueList[index],2);
                                        return value;
                                        break;
                                    case "tenm":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,10,valueList[index],2);
                                        return value;
                                        break;
                                    case "fifm":
                                        var value = setCategoryMin(timeCurr,startTime1,startTime,15,valueList[index],2);
                                        return value;
                                        break;
                                    case "thim":
                                    case "hour":
                                        var value = setCategoryPrev(valueList,index," ",0,null,1,"-",2);
                                        return value;
                                        break;
                                    default:;
                                }
                            },
                            formatter : function(value, index){
                                // 年-周-月-日 都是日期格式
                                var year,month,day,time;
                                var startTime = xml.options.nowDateTime[0].startTime;
                                switch(KLineSocket.option.lineType){
                                    case "day":
                                        // year = value.split("-")[0];
                                        // month = Number(value.split("-")[1]);
                                        // day = Number(value.split("-")[2]);
                                        // return year +"/"+month+"/"+day;
                                        // break;
                                        year = value.split("-")[0];
                                        month = Number(value.split("-")[1]);
                                        return year+"/"+month;
                                        break;
                                    case "week":
                                        // year = value.split("-")[0];
                                        // month = Number(value.split("-")[1]);
                                        // return year+"/"+month;
                                        // break;
                                    case "month":
                                        year = value.split("-")[0];
                                        // month = Number(value.split("-")[1]);
                                        return year;
                                        break;
                                    case "year":
                                        year = value.split("-")[0];
                                        return year;
                                        break;
                                    case "minute":
                                    case "fivem":
                                        time = value.split(" ")[2];
                                        return Number(time.split(":")[0])+":"+time.split(":")[1];
                                        break;
                                    case "tenm":
                                    case "fifm":
                                        // time = value.split(" ")[2];
                                        // return Number(time.split(":")[0])+":"+time.split(":")[1];
                                        // break;
                                    case "thim":
                                    case "hour":
                                        month = Number(value.split("-")[1]);
                                        day = Number(value.split(" ")[0].split("-")[2]);
                                        return month+"/"+day;
                                        break;
                                    default:;
                                }
                            }
                        },
                        axisPointer: {
                            show:true,
                            label: {
                                show:true,
                                formatter: function(params){
                                    return params.value.replace(/-/g,"/");
                                }
                            }
                        }

                    },
                    {
                        type: 'category',
                        gridIndex: 1,

                        data: KLineSocket.HistoryData.hCategoryList,
                        scale: true,
                        axisTick: { show:false },
                        boundaryGap: false,
                        axisLine: { show: false },
                        axisLabel: { show: false },
                        splitLine: { show: false },
                        axisPointer: {
                            label: {
                                show:false
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        scale: true,
                        splitNumber: 3,
                        splitArea: { show: false },
                        axisTick:{ show:false },
                        axisLine: { show: false },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#efefef'
                            }
                        },
                        axisLabel: {
                            show: true,
                            color: '#000',
                            fontSize: 12,
                            formatter: function (value, index) {
                                return (value).toFixed(xml.options.decimal);
                            }
                        },
                        axisPointer: {
                            show:true,
                            label: {
                                show:true,
                                formatter: function(params){
                                    return params.value.toFixed(xml.options.decimal);
                                }
                            }
                        }
                    },
                    {
                        type:'value',
                        scale: true,
                        gridIndex: 1,
                        min: 0,
                        axisTick:{ show:false },
                        axisLabel: {
                            show: true,
                            color: '#000',
                            fontSize: 14,
                            formatter: function (value, index) {
                                setyAsixName(value);
                                return;
                            }
                        },
                        axisLine: { 
                            show: true,
                            inZero: true,
                            lineStyle: {
                                color: '#efefef'
                            }
                        },
                        splitNumber: 2,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#efefef'
                            }
                        }
                    },
                ],
                series: [
                    {
                        name: 'K',
                        type: 'candlestick',
                        showSymbol: false,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                color: '#e22f2a',
                                color0: '#3bc25b',
                                borderColor: '#e22f2a',
                                borderColor0: '#3bc25b'
                            }
                        },
                        barMaxWidth: 20,
                        data: KLineSocket.HistoryData.hValuesList,
                        markPoint: {
                            symbolSize: 20,
                            data: [
                                {
                                    name: 'highest value',
                                    type: 'max',
                                    valueDim: 'highest',
                                    label: {
                                        normal: {
                                            position: 'insideBottomLeft',
                                            color: "#555",
                                            fontSize: 14,
                                            offset: [10,20]
                                        }
                                    },
                                    itemStyle: {
                                        normal:{
                                            color: "rgba(0,0,0,0)"
                                        }
                                    }
                                },
                                {
                                    name: 'lowest value',
                                    type: 'min',
                                    valueDim: 'lowest',
                                    label: {
                                        normal: {
                                            position: 'insideTopLeft',
                                            color: "#555",
                                            fontSize: 14,
                                            offset: [10,10]
                                        }
                                    },
                                    itemStyle: {
                                        normal:{
                                            color: "rgba(0,0,0,0)"
                                        }
                                    }
                                }
                            ]
                        },

                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: KLineSocket.HistoryData.hVolumesList,
                        itemStyle: {
                            normal: {
                                color: '#e22f2a',
                                color0: '#3bc25b'
                            }
                        },
                        barMaxWidth: 20
                    }
                ]
            });

            // 第一次绘制图形后,开始请求历史数据，周期K线和日K线不同
            KLineSocket.HistoryData.queryTimes++;

            // 日、周、月、年第一次查询的就是历史数据
            // 所以第一次绘制图形后，直接请求index为-200的历史数据即可
            // 于是，更新日、周、月、年数据查询参数
            KLineSocket.option.HistoryKQAllDayPrev = $.extend({},KLineSocket.option.HistoryKQAllDayPrev,{StartIndex:"-"+KLineSocket.HistoryData.queryTimes*200});
            if(KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year"){
                // 请求index为-200的历史数据
                KLineSocket.getHistoryKQAllDayPrev();
            }else{
                // 而分钟周期K线，请求的是前一天开始的数据（被称为历史数据）
                // 意义是，从此时才开始请求历史数据
                // 所以，这是事先定义好的 index 为-1的199条数据，
                // 于是直接请求该参数即可
                KLineSocket.getHistoryKQFirstMinPrev();
            }
            
        }
        else{
           // 绘制K线图
            KLineSocket.KChart.setOption({
                xAxis: [
                    {
                        data: KLineSocket.HistoryData.hCategoryList,
                    },
                    {
                        data: KLineSocket.HistoryData.hCategoryList,
                    }
                ],
                series: [
                    {
                        data: KLineSocket.HistoryData.hValuesList
                    },
                    {
                        data: KLineSocket.HistoryData.hVolumesList
                    }
                ]
            },false,true); 

            
            

            
            
            if(KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year"){
                
                KLineSocket.HistoryData.queryTimes++;

                // 日、周、月、年的查询参数，在进行查询时就已经是查询历史数据了
                // 所以在queryTimes查询数据次数更新后更新查询参数
                // 更新日、周、月、年数据查询参数
                KLineSocket.option.HistoryKQAllDayPrev = $.extend({},KLineSocket.option.HistoryKQAllDayPrev,{StartIndex:"-"+KLineSocket.HistoryData.queryTimes*200});
                
                if((KLineSocket.HistoryData.queryTimes+1)*200>KLineSocket.HistoryData.dataLength){
                    var count = KLineSocket.HistoryData.dataLength + 1 - (KLineSocket.HistoryData.queryTimes)*200+"";
                    KLineSocket.option.HistoryKQAllDayPrev = $.extend({},KLineSocket.option.HistoryKQAllDayPrev,{Count: count});
                    if(!KLineSocket.HistoryData.stopQuery){

                        KLineSocket.getHistoryKQAllDayPrev();
                        
                    }
                    KLineSocket.HistoryData.stopQuery = true;
                    // KLineSocket.HistoryData.queryTimes--;
                }

                if(!KLineSocket.HistoryData.stopQuery){

                    KLineSocket.getHistoryKQAllDayPrev();
                    
                }
                
                
            }else{

                // 当第一次绘制完图表之后，更新历史数据的查询参数
                // 分钟周期K线的查询，第一次是当天的数据，而历史数据是从前一个交易日开始算的，
                // 所以在queryTimes查询数据次数更新前更新查询参数
                // 更新分钟周期K线数据查询参数
                // dataLengthToday
                KLineSocket.option.HistoryKQAllMinPrev = $.extend({},KLineSocket.option.HistoryKQAllMinPrev,{StartIndex:"-"+KLineSocket.HistoryData.queryTimes*200});
            
                KLineSocket.HistoryData.queryTimes++;

                if(KLineSocket.HistoryData.dataLengthToday+(KLineSocket.HistoryData.queryTimes)*200>KLineSocket.HistoryData.dataLength){
                    
                    

                    var count = KLineSocket.HistoryData.dataLength + 1 - KLineSocket.HistoryData.dataLengthToday - (KLineSocket.HistoryData.queryTimes-1)*200 + "";
                    KLineSocket.option.HistoryKQAllMinPrev = $.extend({},KLineSocket.option.HistoryKQAllMinPrev,{Count: count});
                    
                    if(!KLineSocket.HistoryData.stopQuery){

                        KLineSocket.getHistoryKQAllMinPrev();
                        
                    }
                    KLineSocket.HistoryData.stopQuery = true;
                    // KLineSocket.HistoryData.queryTimes--;
                }

                if(!KLineSocket.HistoryData.stopQuery){

                    KLineSocket.getHistoryKQAllMinPrev();
                    
                }
            }
            



        }

    }else{
        // 初始化并显示数据栏和数据信息框的信息
        if(KLineSocket.KChart.getOption()&&KLineSocket.KChart.getOption().series.length!=0){
            KLineSocket.KChart.setOption({
                xAxis:[
                    {
                        data: KLineSocket.HistoryData.hCategoryList
                    },
                    {
                        data: KLineSocket.HistoryData.hCategoryList
                    },
                    // {
                    //     data: KLineSocket.HistoryData.hCategoryList
                    // }
                ],
                series: [
                    {
                        data: KLineSocket.HistoryData.hValuesList,
                    },
                    {
                        data: KLineSocket.HistoryData.hVolumesList
                    },
                    // {
                    //     data: KLineSocket.HistoryData.hVolumesList
                    // }
                ]
            },false,true);
        }
         
    }
};
// 1，5，10，15分钟判断是否显示标签
// 参数 当前时间，开盘时间1，开盘时间，间隔数
function setCategoryMin(timeCurr,startTime1,startTime,minNum,valueCurr,splitNum){
    // if((timeCurr.split(":")[0]==startTime1.split(":")[0])&&((timeCurr.split(":")[1]/1==startTime1.split(":")[1]/1-1+minNum/1))){
    //     return true;
    // }
    if((timeCurr.split(":")[0]==startTime.split(":")[0])&&((timeCurr.split(":")[1]/1==startTime.split(":")[1]/1+minNum/1))){
        if(valueCurr&&valueCurr.split(" ")[0].split("-")[2]%splitNum==0){
            // console.log(valueCurr.split(" ")[0].split("-")[2])
            return true;
        }
    }
    

}
// 年月日判断是否显示标签
// 类目轴数组，当前index，隔断的字符串，所需的数据在数组的索引，间隔数，余数
function setCategoryPrev(valueList,index,timeSplit,splitNum,num,yu,minSplit,minNum){
    // 判断前一个数据和当前数据不一样
    if(valueList[index-1]&&(valueList[index-1].split(timeSplit)[splitNum]!=valueList[index].split(timeSplit)[splitNum])){
        if(num){
            if(valueList[index].split(timeSplit)[splitNum]%num==yu){
                return true;
            }else{
                return false;
            }
        }
        if(minNum){
            if(valueList[index].split(timeSplit)[splitNum].split(minSplit)[2]%minNum==yu){
                return true;
            }else{
                return false;
            }
        }
        return true
    }else{
        return false
    }
}
// 信息框的位置： 左-右
function toolContentPosition(event) {
    var offsetX = event.offsetX;
    var continerWidth = $("#kline_charts").width(), toolContent = $("#kline_tooltip").width();
    var centerX = continerWidth / 2;
    if (offsetX > centerX) {
        $("#kline_tooltip").css("left", 83/830*continerWidth);
    } else {
        $("#kline_tooltip").css({"left":"auto","right":83/830*continerWidth});
    }
};
// 设置成交量的单位变化状况
function setyAsixName(value) {
    var data = setUnit(value,true);
    var maximun = (data=="0"?"0":floatFixedZero(data.value))
    var yAxisName = (data=="0"?"量":data.unit);
    $(".volumn div:first").text(maximun);
    $(".volumn div:last").text(yAxisName);
};
// 初始化设置显示信息
function initMarketTool() {
    var length = KLineSocket.HistoryData.hCategoryList.length;
    if (!KLineSocket.KLineSet.isHoverGraph || KLineSocket.KLineSet.isHoverGraph && !KLineSocket.HistoryData.hCategoryList[KLineSocket.KLineSet.mouseHoverPoint]) {
        setToolInfo(length, null);
    }
};
// 信息框和提示栏：区分 默认的信息 和 hover上去的信息显示
function setToolInfo(length, showTip){ 
    var setPoint;
    if(KLineSocket.KLineSet.mouseHoverPoint>0){
        if(KLineSocket.KLineSet.mouseHoverPoint>length-1){
            KLineSocket.KLineSet.mouseHoverPoint = length-1;
        }else{
            KLineSocket.KLineSet.mouseHoverPoint = Math.round(KLineSocket.KLineSet.mouseHoverPoint);
        }
    }else{
        KLineSocket.KLineSet.mouseHoverPoint = 0;
    }
    if(showTip){
        setPoint = KLineSocket.KLineSet.mouseHoverPoint;
    }else{
        setPoint = length-1;
    }
    var countent = $("#kline");
    if (length) {
        $(".date", countent).text(KLineSocket.HistoryData.hDate[setPoint].replace(/-/g,'/')); //日期
        $(".day", countent).text(KLineSocket.HistoryData.hDay[setPoint]); //星期
        // 分钟K线每根柱子都有一条时间数据
        // 日K线，只有最后一根存在当前分钟时间数据
        if(KLineSocket.option.lineType=="day"||KLineSocket.option.lineType=="week"||KLineSocket.option.lineType=="month"||KLineSocket.option.lineType=="year"){
            KLineSocket.HistoryData.hTime = (KLineSocket.HistoryData.hTime=="00:00")?null:KLineSocket.HistoryData.hTime;
            if(showTip){
                $(".time", countent).text((KLineSocket.KLineSet.mouseHoverPoint==length-1)?KLineSocket.HistoryData.hTime:null); //时间
            }else{
                $(".time", countent).text(KLineSocket.HistoryData.hTime);
            }
        }else{
            $(".time", countent).text(KLineSocket.HistoryData.hCategoryList[setPoint].split(" ")[2]); //时间
        }

        $(".open", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hValuesList[setPoint][0])+"("+floatFixedTwo(KLineSocket.HistoryData.hValuesPercentList[setPoint][0])+"%)")
            .attr("class","open pull-right "+((setPoint==0)?"":getColorName(KLineSocket.HistoryData.hValuesPercentList[setPoint][0],0))); //开
        
        $(".price", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hValuesList[setPoint][1])+"("+floatFixedTwo(KLineSocket.HistoryData.hValuesPercentList[setPoint][1])+"%)")
            .attr("class","price pull-right "+getColorName(KLineSocket.HistoryData.hValuesPercentList[setPoint][1],0)); //收
        
        $(".lowest", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hValuesList[setPoint][2])+"("+floatFixedTwo(KLineSocket.HistoryData.hValuesPercentList[setPoint][2])+"%)")
            .attr("class","lowest pull-right "+getColorName(KLineSocket.HistoryData.hValuesPercentList[setPoint][2],0)); //低
        
        $(".highest", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hValuesList[setPoint][3])+"("+floatFixedTwo(KLineSocket.HistoryData.hValuesPercentList[setPoint][3])+"%)")
            .attr("class","highest pull-right "+getColorName(KLineSocket.HistoryData.hValuesPercentList[setPoint][3],0)); //高
        
        $(".z-value", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hZValuesList[setPoint])+"("+floatFixedTwo(KLineSocket.HistoryData.hZValuesListPercent[setPoint])+"%)")
            .attr("class","z-value pull-right "+getColorName(KLineSocket.HistoryData.hZValuesList[setPoint],0));   // 涨跌
        
        
        $(".amplitude", countent).text(floatFixedDecimal(KLineSocket.HistoryData.hZf[setPoint])+"("+floatFixedTwo(KLineSocket.HistoryData.hZfList[setPoint])+"%)");   // 振幅

        var volume = KLineSocket.HistoryData.hVolumesList[setPoint][1];

        $(".deal-Vol em").text(parseFloat(volume/100).toFixed(2));//量--单位:手

        if(volume>=100){
            //量--单位:手
            $(".volume", countent).text(setUnit(floatFixedZero(volume/100))+"手");
        }else{
            //量--单位:股
            $(".volume", countent).text(volume+"股");
        }
        
    }else{
        $(".date", countent).text("-");
        $(".day", countent).text("-");
        $(".time", countent).text("-");
        $(".open", countent).text("-");
        $(".highest", countent).text("-");
        $(".price", countent).text("-");
        $(".lowest", countent).text("-");
        $(".volume", countent).text("-");
        $(".z-value", countent).text("-");
        $(".amplitude", countent).text("-");

    }
};
