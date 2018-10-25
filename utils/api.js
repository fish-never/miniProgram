import dotContext from './context.js';
import {timestamp} from './common.js'

const behaviorPath = '/userBehavior.jpg';
const devicePath = '/userDeviceInfo.jpg';
const userPath = '/userInfo.jpg';
const cardRelationPath = '/cardRelation.jpg';

const behaviorEventIdName = {
    '1001': '浏览页面', '1002': '登录','1003': '搜索', '1004': '分享转发',
    '1005': '注册', '1006': '点赞','1007': '播放视频', '1008': '预约',
    '1009': '回复', '1010': '用户授权','1011': '点击元素', '1012': '发起咨询',
    '1013': '发帖', '1014': '页面加载完成','1015': '页面离开', '1016': '启动小程序',
    '1017': '握手', '1018': '咨询师初始化','1019': '结束视频播放', '1020': '拉新', '1021': '自定义事件'
}

const seq = [], seqSize = 2000;

function saveSeq(params) {
    seq.push(params);
    if (seq.length > seqSize) {
        seq.shift();
    }
}

function resendSeq(){
    let r = seq.shift();
    while(r !== undefined){
        const { url, method, data } = r;
        wx.request({
            url,
            method,
            data,
        })
        r = seq.shift();
    }
}

let readyResolve;
const readyPromise = new Promise((resolve, reject) => {
    readyResolve = resolve
})

const base = {

    start: function() {
        readyResolve()
    },

    /**
     * 浏览页面
     * title 浏览页面的标题
     * category 浏览页面内容的分类，例如课程/帖子/资讯
     * additon 附加信息
     */
    pageView: function( object = {} ) {
        readyPromise.then(_ => {
            const {title, category, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(true),
                event_id: '1001',
                title,
                category,
                label: addition
            })
        })
    },

    /**
     * 自定义事件
     * event 自定义事件名称
     * category  分类
     * value 一些状态值
     * addition 附加信息
     */
    customEvent: function( object = {} ) {
        readyPromise.then(_ => {
            const {event, category, value, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(true),
                event_id: '1021',
                extend: event,
                value,
                category,
                label: addition
            })
        })
    },

    /**
     * 微信小程序登录
     * success 登录是否成功
     * addition 附加信息
     */
    login: function( object = {} ) {
        readyPromise.then(_ => {
            const {success, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(true),
                event_id: '1002',
                value: success === false ? 0 : 1,
                label: addition
            })
        })
    },

    /**
     * 搜索
     * text 搜索的文本
     * addition 附加信息
     */
    search: function( object = {} ) {
        readyPromise.then(_ => {
            const {text, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1003',
                value: text,
                label: addition
            })
        })
    },

    /**
     * 分享、转发
     * title 分享的标题
     * category 分享的分类
     * source 分享的来源，页面内分享值为1，点击右上角菜单分享为0
     * addition 附加信息
     */
    share: function( object = {} ) {
        readyPromise.then(_ => {
            const { title, category, source, addition } = object;
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1004',
                value: source,
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 点赞
     * title 点赞的内容
     * category 点赞内容相关的分类
     * addition 附加信息
     */
    like: function( object = {} ) {
        readyPromise.then(_ => {
            const {title, category, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1006',
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 播放视频
     * title 播放视频的名字
     * category 播放视频的分类
     * addition 附加信息
     */
    playVideo: function( object = {} ) {
        readyPromise.then(_ => {
            const { title, category, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1007',
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 预约
     * title 预约的主题
     * category 预约的分类
     * businessDate 预约时间
     * addition 附加信息
     */
    subscribe: function( object = {} ) {
        readyPromise.then(_ => {
            const { title, category, businessDate, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1008',
                title,
                category,
                label: addition,
                business_date: businessDate
            })    
        })
    },

    /**
     * 回复
     * title 回复的主题
     * category 主题分类
     * comment 回复的内容
     * addition 附加信息
     */
    reply: function( object = {} ) { //1009
        readyPromise.then(_ => {
            const { title, category, comment, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1009',
                title,
                category,
                label: addition,
                comment
            })    
        })
    },

    /**
     * 用户授权操作
     * category 授权的分类，例如用户信息/地理位置/手机号
     * success 授权是否成功
     * addition 附加信息
     */
    authorize: function( object = {} ) { //1010
        readyPromise.then(_ => {
            const { category, success, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1010',
                category,
                label: addition,
                value: success === false ? 0 : 1
            })    
        })
    },

    /**
     * 点击元素
     * clickElement 点击元素的描述
     * url 如果点击的元素会跳转页面，收集跳转的url
     * addition 附加信息
     */
    clickElement: function( object = {} ){ //1011
        readyPromise.then(_ => {
            const { clickElement, url, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1011',
                label: addition,
                click_element: clickElement,
                value: url
            })    
        })
    },

    /**
     * 发起咨询
     * clickElement 点击的元素
     * chatId
     * title 发起咨询的主题
     * category 发起咨询的分类
     * addition 附加信息
     */
    consult: function( object = {} ){ //1012
        readyPromise.then(_ => {
            const { clickElement, chatId, title, category, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1012',
                label: addition,
                click_element: clickElement,
                chat_id: chatId,
                title,
                category
            })    
        })
    },

    /**
     * 发帖
     * title 帖子的标题
     * category 帖子内容的分类
     * addition 附加信息
     */
    newPost: function( object = {} ) { //1013
        readyPromise.then(_ => {
            const {title, category, addition} = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1013',
                label: addition,
                title,
                category
            })    
        })
    },

    /**
     * 页面加载完成
     * title 加载的页面的标题
     * category 加载的页面的分类
     * duration 加载时长（毫秒数）
     * addition 附加信息
     */
    pageLoad: function( object = {} ){
        readyPromise.then(_ => {
            const { duration, title, category, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1014',
                duration,
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 离开页面
     * title 页面标题
     * category 页面分类
     * duration 用户停留时间（毫秒数）
     * addition 附加信息
     */
    pageLeave: function( object = {} ){
        readyPromise.then(_ => {
            const { duration, title, category, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1015',
                duration,
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 小程序启动
     * duration 启动时长（毫秒数）
     * networkType 手机网络类型
     */
    launchApp: function({ duration, networkType }) {
        readyPromise.then(_ => {
            const appContext = dotContext.getAppContext()
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                scene: appContext.scene,
                from_ticket: appContext.fromTicket,
                event_id: '1016',
                duration,
                network_type: networkType
            })    
        })
    },

    /**
     * 视频播放完毕
     * duration 用户观看时长(毫秒数)
     * title 视频标题
     * category 视频分类
     * addition 附加信息
     */
    playEnd: function(object){
        readyPromise.then(_ => {
            const { duration, title, category, addition } = object
            dotRequest(behaviorPath, {
                ...buildBehaviorParams(),
                event_id: '1019',
                duration,
                title,
                category,
                label: addition
            })    
        })
    },

    /**
     * 拉新/用户手机号授权
     * opportunityId 机会id
     * consultantAccount 咨询师EM
     * studentId 学生id
     * phone 学生电话
     * qq 学生qq
     * wechat 学生微信
     * label 事件附加信息
     * source 来源：小程序内1，拉新2
     */
    newUser: function (object) {
        readyPromise.then(_ => {
            const { opportunityId, consultantAccount, studentId, phone, qq, wechat, label, source } = object
            dotRequest(cardRelationPath, {
                ...buildBehaviorParams(),
                event_id: '1020',
                opportunity_id: opportunityId,
                consultant_account: consultantAccount,
                student_id: studentId,
                mobile: phone,
                qq,
                wechat,
                label,
                source,
            })
        })
    },

    /**
     * 上传设备信息
     * 参数信息可参考微信小程序的定义
     */
    device: function(object) {
        readyPromise.then(_ => {
            const {
                brand, fontSizeSetting, language,
                model, pixelRatio, platform,
                screenHeight, screenWidth, system,
                version, windowHeight, windowWidth,
                SDKVersion
            } = object;
            const appContext = dotContext.getAppContext()
            dotRequest(devicePath, {
                union_id: appContext.unionId,
                open_id: appContext.openId,
                app_id: appContext.appId,
                site_id: appContext.siteId,
                product: appContext.product,
                brand,
                model,
                pixel_ratio: pixelRatio,
                screen_width: screenWidth,
                screen_height: screenHeight,
                window_width: windowWidth,
                window_height: windowHeight,
                language,
                version,
                system,
                platform,
                fontsize_setting: fontSizeSetting,
                sdk_version: SDKVersion,
                send_time: timestamp(),
            })    
        })
    },

    /**
     * 用户信息
     * 参数信息可参考小程序定义
     */
    userInfo: function(object) {
        readyPromise.then(_ => {
            const {
                nickName, avatarUrl, gender,
                city, province, country,
                language, latitude, longitude,
                phoneNum
            } = object
            const appContext = dotContext.getAppContext()
            dotRequest(userPath, {
                union_id: appContext.unionId,
                open_id: appContext.openId,
                app_id: appContext.appId,
                site_id: appContext.siteId,
                product: appContext.product,
                send_time: timestamp(),
                nick_name: nickName,
                avatar_url: avatarUrl,
                gender,
                city,
                province,
                country,
                language,
                latitude,
                longitude,
                phone_num: phoneNum,
                source: '1' //来源于小程序
            })    
        })
    }

}

function dotRequest(rqPath, params) {
    let paramsString = {} ;
    Object.keys(params).forEach(key => {
        paramsString[key] = (params[key] !== undefined && params[key] !== null) ? params[key].toString() : params[key]
    })

    const appContext = dotContext.getAppContext()
    if (appContext._verbose === true) {
        if (behaviorPath === rqPath){
            const event = behaviorEventIdName[paramsString.event_id]
            console.log(`send log ${event}`, paramsString)
        }else{
            console.log(`send log ${rqPath}`, paramsString)
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${appContext.serverUrl}${rqPath}`,
            method: 'POST',
            data: paramsString,
            success: res => {
                resolve(res)
                resendSeq();
            },
            fail: error => { // 处理发送失败的情况
                saveSeq({
                    url: `${appContext.serverUrl}${rqPath}`,
                    data: paramsString,
                    method: 'POST'
                })
            }
        })
    })
}

function buildBehaviorParams(withPrevPage = false){
    const appContext = dotContext.getAppContext()
    const pageContext = dotContext.getPageContext()
    const prevPage = !withPrevPage ? {} : {
        prev_path: pageContext.prevPath,
        prev_url: pageContext.prevUrl,
        prev_pvid: pageContext.prevPvId,
    }
    return {
        union_id: appContext.unionId,
        open_id: appContext.openId,
        app_id: appContext.appId,
        site_id: appContext.siteId,
        product: appContext.product,
        vv_id: appContext.vvId,
        pv_id: pageContext.pvId,
        path: pageContext.path,
        url: pageContext.url,        
        send_time: timestamp(),
        ...prevPage
    }
}


export default base;