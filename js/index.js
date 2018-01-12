require.config({
    baseUrl: "../js/lib",
    paths: {
        "jquery": "jquery",
        'moment':'moment.min',
        "public":'../public',
        "marketCenter":'../marketCenter',
    },
    shim: {
        'jquery':{
            exports:['$','jQuery']
        },
        'jquery.pagination': {
            deps: ['jquery'],
            exports: 'jQuery.fn.pagination'
        },
        'echarts':{
            exports:'echarts'
        },
        'moment':{
            init:function(){
                return {
                    moment : moment,
                }
            }
        },
        public:{
            deps: ['jquery'],
            // init:function(){
            //     return {
            //         formatDate : formatDate,
            //         formatTime : formatTime
            //     }
            // }
        },
        marketCenter:{
            deps:['jquery','public','moment'],
        }
    }
});
require(['moment','public','marketCenter'],function(m){
    initPage(m);
});