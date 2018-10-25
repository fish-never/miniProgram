import dotApi from './api'
import context from "./context";
import { rid, encodeUrlParams } from './common';

let enabled = false;
function enable() {
    if (enabled){
        return
    }
    enabled = true;
    const _App = App
    const _Page = Page
    App = function( config ) {
        const { onLaunch, onShow } = config;
        _App.call(this, {

            ...config,

            __dot: {
                launchStart: undefined,
                launchEnd: undefined
            },

            onLaunch: function(options) {
                this.__dot.launchStart = new Date().getTime();
                context.registerApp({
                    vvId: rid(),
                    scene: options.scene,
                    fromTicket: options.shareTicket,
                })
                const queryString = encodeUrlParams(options)
                context.registerPage({
                    path: options.path,
                    url: queryString ? `${options.path}?${queryString}` : options.path,
                })
                uploadSystemInfo()
                onLaunch && onLaunch.apply(this, arguments)
            },

            onShow: function(options) {
                onShow && onShow.apply(this, arguments)
                this.__dot.launchEnd = new Date().getTime()
                const launchTime = this.__dot.launchStart ? this.__dot.launchEnd - this.__dot.launchStart : undefined; //页面启动时长
                if (launchTime){
                    wx.getNetworkType({
                        complete: res => {
                            const {networkType} =  res || {}
                            dotApi.launchApp({ duration: launchTime, networkType});
                        }
                    })
                    this.__dot.launchStart = undefined;
                }
            },
        })
    }


    Page = function( config ) {
        const { onLoad, onShow, onHide, onUnload } = config;
        _Page.call(this, {

            ...config,

            __dot: {
                loadStart: undefined,
                loadEnd: undefined,
                stayStart: undefined,
                stayEnd: undefined,
                inHide: false,
            },

            onLoad: function(options) {
                this.options = options;
                this.__dot.loadStart = new Date().getTime();
                onLoad && onLoad.apply(this, arguments)
            },

            onShow: function() {
                this.__dot.inHide = false
                this.__dot.stayStart = new Date().getTime();
                const queryString = encodeUrlParams(this.options)
                const { path, url, pvId } = context.getPageContext();
                const prePage = {
                    prevPath: path,
                    prevUrl: url,
                    prevPvId: pvId,
                }
                const curPage = {
                    pvId: rid(),
                    path: this.route,
                    url: queryString ? `${this.route}?${queryString}` : this.route,
                }

                context.registerPage({
                    ...prePage,
                    ...curPage,
                })

                this.__dot.loadEnd = new Date().getTime();
                const loadTime = this.__dot.loadStart ? this.__dot.loadEnd - this.__dot.loadStart : undefined; //页面加载时长

                const { title, category, addition} = (this.__dot_page && this.__dot_page()) || {}
                if (title === undefined) {
                    console.warn(`没有找到打点属性title， 请确保页面${this.route}定义了__dot_page方法`)
                }
                if (loadTime !== undefined){
                    dotApi.pageLoad(
                        { duration: loadTime, title, category, addition }
                    )
                    this.__dot.loadStart = undefined;
                }
                dotApi.pageView({title, category, addition})
                onShow && onShow.apply(this, arguments)
                
            },

            onHide: function() {
                this.__dot.inHide = true
                const { title, category, addition} = (this.__dot_page && this.__dot_page()) || {}
                this.__dot.stayEnd = new Date().getTime();
                const stayTime =  this.__dot.stayEnd - this.__dot.stayStart; //页面停留时间
                dotApi.pageLeave(
                    {duration: stayTime, title, category, addition}
                )

                onHide && onHide.apply(this, arguments)
            },

            onUnload: function() {
                if (!this.__dot.inHide) {
                    const { title, category, addition} = (this.__dot_page && this.__dot_page()) || {}
                    this.__dot.stayEnd = new Date().getTime();
                    const stayTime =  this.__dot.stayEnd - this.__dot.stayStart; //页面停留时间
                    dotApi.pageLeave(
                        {duration: stayTime, title, category, addition}
                    )
                }
                onUnload && onUnload.apply(this, arguments)
            },

        })
    }
}

function uploadSystemInfo() {
    wx.getSystemInfo({
        success: res => {
            dotApi.device(res)                        
        }
    })
}

export default{
    enable,
    getPageContext: context.getPageContext,
    getAppContext: context.getAppContext,
    registerApp: context.registerApp,
    ...dotApi
}