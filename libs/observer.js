var mobx = require('./mobx');
var autorun = mobx.autorun;
var observable = mobx.observable;
var action = mobx.action;
var mta = require("../utils/mta_analysis.js");// 腾讯mta接入

var isObservable = mobx.isObservable;
var isObservableArray = mobx.isObservableArray;
var isObservableObject = mobx.isObservableObject;
var isObservableValue = mobx.isObservableValue;
var isObservableMap = mobx.isObservableMap;

var _mergeGetterValue = function(res, object){
  Object.getOwnPropertyNames(object).forEach( function(propertyName){
    if(propertyName === "$mobx"){ return };
    var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
    if( descriptor && !descriptor.enumerable && !descriptor.writable ){
      res[propertyName] = toJS(object[propertyName]);
    }
  })
}

var toJS = function(source, detectCycles, __alreadySeen) {
    if (detectCycles === void 0) { detectCycles = true; }
    if (__alreadySeen === void 0) { __alreadySeen = []; }
    function cache(value) {
        if (detectCycles)
            __alreadySeen.push([source, value]);
        return value;
    }
    if (isObservable(source)) {
        if (detectCycles && __alreadySeen === null)
            __alreadySeen = [];
        if (detectCycles && source !== null && typeof source === "object") {
            for (var i = 0, l = __alreadySeen.length; i < l; i++)
                if (__alreadySeen[i][0] === source)
                    return __alreadySeen[i][1];
        }
        if (isObservableArray(source)) {
            var res = cache([]);
            var toAdd = source.map(function (value) { return toJS(value, detectCycles, __alreadySeen); });
            res.length = toAdd.length;
            for (var i = 0, l = toAdd.length; i < l; i++)
                res[i] = toAdd[i];
            return res;
        }
        if (isObservableObject(source)) {
            var res = cache({});
            for (var key in source)
                res[key] = toJS(source[key], detectCycles, __alreadySeen);
            _mergeGetterValue(res, source);
            return res;
        }
        if (isObservableMap(source)) {
            var res_1 = cache({});
            source.forEach(function (value, key) { return res_1[key] = toJS(value, detectCycles, __alreadySeen); });
            return res_1;
        }
        if (isObservableValue(source))
            return toJS(source.get(), detectCycles, __alreadySeen);
    }

    if (Object.prototype.toString.call(source) ===  '[object Array]') {
      return source.map( function(value) {
        return toJS(value);
      });
    }
    if (source !== null && typeof source === 'object') {
      var res = {};
      for (var key in source){
        res[key] = toJS(source[key]);
      }
      return res;
    }
    return source;
}


// page时间
var pageStartTime = 0; //记录进入时间
var pageLoadTime = 0; //记录开始渲染时间

// appLaunch
var launchTime = new Date().getTime();
var launchReady = false;
import log from '../common/log'
import * as logContext from  '../common/context'
import TodoStore from '../stores/todoStore'

var observer = function(page){

  var oldOnLoad = page.onLoad;
  var oldOnReady = page.onReady;
  var oldOnShow = page.onShow;
  var oldOnUnload = page.onUnload;
  var oldOnHide = page.onHide;
  var old__dot_page = page.__dot_page;

  if(!page.props) {
    // 默认带上store 防止报错
    page.props = {
      store: TodoStore
    }
  }
  page._update = function() {
    //console.log('_update');
    var newData = {};
    var props = this.props || {};
    this.setData({props: toJS(props)});
  }
  page.__dot_page = function () {
    return {
      title: '',
    }
    if( old__dot_page ) {
      old__dot_page.apply(this, arguments);
    }
  }
  // 自定义onshow
  page.onShow = function() {
    // 设置page信息 --------->
    let oldPageContext = logContext.getPageContext();
    logContext.registerPage({
      prevPvId: oldPageContext.pvId,
      prevUrl: oldPageContext.url,
      prevRoute: oldPageContext.route,
      query: this.options,
      pvId: logContext.rid(),
      url: this.route +logContext.encodeUrlParams(this.options),
      route: this.route
    });

    // 拦截无网情况
    wx.getNetworkType({
      success: res => {
        getApp().globalData.networkType = res.networkType
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType == 'none') {
        }
      }
    })
    // 监听网络状况
    wx.onNetworkStatusChange((res) =>{
      if(!res.isConnected || res.networkType == 'none'){
        TodoStore.changeTip(false)
      }else{
        TodoStore.changeTip(true)
      }
    })


    pageStartTime = new Date().getTime();

    if(typeof this.data !== 'undefined'){
      var that = this;

      log.enter();

      //  support observable props here
      that.props = mobx.observable(that.props);

      that._autorun = autorun( function(){
        //console.log('autorun');
        that._update();
      });

      if( oldOnShow ) {
        oldOnShow.apply(this, arguments);
      }
    }
  }

  page.onLoad = function(options) {
    // 扫描二维码携带参数
    if(Object.keys(options).length > 0){
      if(typeof options.sceue !== 'undefined'){
        app.globalData.track.scene = sceue
      }
    }

    mta.Page.init(); // 初始化mta统计
    // console.log('我是observer里的this(等同于小程序)\n', this)
    var that = this;
    // support observable props here
    that.props = mobx.observable(that.props);
    pageLoadTime = new Date().getTime();
    that._autorun = autorun( function(){
      //console.log('autorun');
      that._update();
    });

    if( oldOnLoad ) {
      oldOnLoad.apply(this, arguments);
    }
  }

  page.onReady = function() {
    var that = this;
    // support observable props here
    that.props = mobx.observable(that.props);

    // 第一个页面ready 发送小程序启动日志
    if(!launchReady){
      log.launchApp({
        loadTime: new Date().getTime()-launchTime
      });
      launchReady = true;
    }
    //page页面加载日志
    log.pageLoad({
      duration: new Date().getTime()-pageLoadTime
    });

    that._autorun = autorun( function(){
      //console.log('autorun');
      that._update();
    });

    if( oldOnReady ) {
      oldOnReady.apply(this, arguments);
    }
  }

  page.onUnload = function() {
    // clear autorun
    this._autorun();

    // 页面离开日志
    log.leave({
      duration: new Date().getTime() - pageStartTime
    });

    if( oldOnUnload ) {
      oldOnUnload.apply(this, arguments);
    }
  }

  page.onHide = function() {
    // clear autorun
    this._autorun();

    //页面离开日志
    log.leave({
      duration: new Date().getTime() - pageStartTime
    });
    // todo page切换隐藏时设置title为''
    logContext.registerPage({
      title: ''
    })
    if( oldOnHide ) {
      oldOnHide.apply(this, arguments);
    }
  }

  return page;
}

export {
  observer,
}
