require.config({
    baseUrl: "../js/lib",
    paths: {
        jquery: 'jquery',
        public:'../public',
        marketCenter:'../marketCenter',
    },
    shim: {
        jquery:{
            exports:'$'
        },
        'jquery.pagination': {
            deps: ['jquery'],
            exports: 'jQuery.fn.pagination'
        },
        echarts:{
            exports:'echarts',
            deps:[]
        },
        public:{
            deps: ['jquery']
        },
        marketCenter:{
            deps:['jquery','public','echarts']
        }
    }
});
var scripts = document.getElementsByTagName("script");
for(var i=0;i<scripts.length;i++){
    var module = scripts[i].getAttribute("require-module");
    if(module != undefined && module != ""){
        require([module],null);
        break;
    }
}