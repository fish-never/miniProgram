import dot from './utils/dot.js'
//let auth = require('common/auth').auth;
import auth from './common/auth'
let Promise = require('common/es6-promise.js');
var util = require('utils/util')
var wxApi = require('utils/wxApi')
var wxRequest = require('utils/wxRequest')

var scence = 0;
dot.enable()
dot.registerApp({
  serverUrl: 'https://datacenter.sunlands.com/datacenter_app/dataService',
  appId: '',
  openId: wx.getStorageSync('_user_openid'),
  siteId: '',
  unionId: '',
});
//https://datacenter.sunlands.com/datacenter_app/dataService 产品环境 
//https://enterapp.sunlands.com/datacenter_app/dataService 测试环境

dot.registerApp({
  _verbose: true
});

dot.start()
//app.js
App({
  onLaunch: function (options) {
    console.log(options)
    // 展示本地存储能力
    var that=this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())//分享过来是
    var token_time = wx.getStorageSync('token_time')
    var fromId = 0
    var scene = decodeURIComponent(options.query.scene)//参数二维码传递过来的参数
    if (scene && scene !== "undefined") {
      var arr = []
      arr = scene.split(',')
      var fromId = arr[0]
      that.globalData.fromId = fromId;
    }
    if (options.query.user_id){
      fromId = options.query.user_id
      that.globalData.fromId = fromId;
    }
    console.log(fromId)
    //wx.setStorageSync('logs', logs)
    const loginMini = () => {
      auth.remove()
      wx.login({
        success: res => {
          let data = {
            code: res.code,
            fromId: fromId,
            envelopeRecordId:options.query.envelopeRecordId,
            version: that.globalData.version_id
          }
          if(options.query.counselor){
            data.counselor=options.query.counselor
          }
          if(options.query.scene){
            data.scene=options.query.scene
          }
          wx.request({
            url: that.globalData.serverUrl + '/login/index/index',
            method:'GET',
            data:data,
            success:res=>{
              if (res.data.code == 0){
                var _user_token = res.data.data.token
                var _user_openid = res.data.data.openid
                var _user_unionId = res.data.data.unionid
                var _user_id = res.data.data.userid
                var token_time = Date.parse(new Date()) + 23 * 60 * 60 * 60
                var _isCheck = res.data.data.setting.isCheck
                var has_phone = res.data.data.has_phone
                var openShare = res.data.data.setting.openShare
                wx.setStorageSync('token_time', token_time);
                wx.setStorageSync('_user_token', _user_token);
                wx.setStorageSync('_user_openid', _user_openid);
                wx.setStorageSync('_user_unionId', _user_unionId);
                wx.setStorageSync('_user_id', _user_id);
                wx.setStorageSync('_isCheck', _isCheck);
                wx.setStorageSync('has_phone', has_phone);
                wx.setStorageSync('openShare', openShare);
                that.globalData.s_token = wx.getStorageSync('_user_token');
                that.globalData.s_openid = wx.getStorageSync('_user_openid');
                that.globalData.s_userid = wx.getStorageSync('_user_id');
                that.globalData._isCheck = wx.getStorageSync('_isCheck');
                that.globalData.has_phone = wx.getStorageSync('has_phone');
                that.globalData.openShare = wx.getStorageSync('openShare');

                auth.set(res.data.data.token)
                setPromise()
              }
            },
            fail:res=>{
              wx.showModal({
                title:'提示',
                content:'网络错误，请稍后再试',
                showCancel:false
              })
            }
          })
        }
      })
    }

    //promise阻塞请求
    const setPromise=()=>{
      this.globalData.promise=new Promise((resolve,reject)=>{
        resolve()
      })
    }
    // 判断token是否过期强制login
    if (auth.get()) {
      wx.checkSession({
        success: _ => {
          wx.request({
            url: config.api.user.checkSession,
            method: 'GET',
            header: {
              'auth-token': auth.get(),
              client: 'ananas',
            },
            success: res => {
              if (res.data.success && res.data.response.status === 200) {
                setPromise()
              } else {
                loginMini()
              }
            },
            fail: () => {
              loginMini()
            }
          })
        },
        fail: () => {
          loginMini()
        }
      })
    } else {
      loginMini()
    }
    
  },
  onShow: function (options) {
    this.globalData.query = options.query
    options={}
    var that = this
    //判断token是否失效
    // if (options && options.query && options.query.article_id) {
    //   return
    // } else {
    //   that.getToken(that.getLabel)
    // } 
      //判断token是否失效
        
  },
  /**获取用户标签及权重 */
  getLabel: function () {
    var that = this;
    var sUrl = this.globalData.serverUrl;
    var stoken = this.globalData.s_token
    wx.request({
      url: sUrl + '/tag/index/tags',
      method: 'GET',
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(wx.getStorageSync('_user_token'))
          if (res.data.data.length > 0) {
            wx.redirectTo({
              url: '../../pages/index1/index1', 
              //url: '../../pages/topicDetail/topicDetail'
            })
          } else {
            wx.redirectTo({
              url: '../../pages/label/label',
              //url: '../../pages/usercenter/usercenter'
            })
          }
        } else if (res.data.code == 10020001) {
          that.getToken(that.getLabel)
        }else {
          console.log(res)
        }
      }
    })
  },
  globalData: {
    userInfo: {
      userId: ''
    },
    serverUrl: 'https://toutiao.ministudy.com',
    imgUrl:'https://img-toutiao.ministudy.com',
    s_token: '',
    s_openid: '',
    query: {},
    askedArtId:[],//已点击过一键咨询的文章id列表
    version_id: '20401',
    fromId: 0,
    promise:null,//request阻塞promise
  },
  
  getToken:function(funC){
    var that =this
    var wxLogin = wxApi.wxLogin()
    var fromId = 0
    if (options.query.scene) {
      var arr = []
      arr = options.query.scene.split('%2C')
      var fromId = arr[0]
    }
    console.log(fromId)
    wxLogin().then(res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code;
      var url = that.globalData.serverUrl + '/login/index/index'
      var params = {
        code: res.code,
        fromId: that.globalData.fromId,
        version: that.globalData.version_id
      }
      return wxRequest.getRequest(url, params)
    }).then(res => {
      var _user_token = res.data.data.token
      var _user_openid = res.data.data.openid
      var _user_unionId = res.data.data.unionid
      var token_time = Date.parse(new Date()) + 23 * 60 * 60 * 60
      wx.setStorageSync('_user_token', _user_token);
      wx.setStorageSync('token_time', token_time);
      wx.setStorageSync('_user_openid', _user_openid);
      wx.setStorageSync('_user_unionId', _user_unionId);
      that.globalData.s_token = wx.getStorageSync('_user_token');
      that.globalData.s_openid = wx.getStorageSync(' _user_openid');
      funC()
    })
  },

  getCurrentDateStr(){
    // 计算当前年月日
    let date = new Date()
    let year = date.getFullYear() +''
    let month = date.getMonth()+1 +''
    let day = date.getDate()+''
    return year+month+day
  },

  // 用户授权后 获取用户信息 缓存用户信息
  saveUserInfo(res){
    wx.setStorage({
      key:"nickName",
      data:res.userInfo.nickName,
      fail(){
        console.log('缓存用户昵称失败')
      },
    })
  },
})


//联调环境  http://www.toutiao.com
//浩子测试域名 http://haozi.toutiao.com
// 测试域名
// 1，weapp：https://toutiao.trylife.cn
// 2，manage:
// 访问后台首页：http://toutiaomanage.ministudy.com/（本地域名）
// 前端代码访问api域名：manage - api.ministudy.com（本地域名）
// 图片测试域名：https://tt-toutiao.ministudy.com

// 线上域名：
// 1，weapp：https://toutiao.ministudy.com
// 2，manage:
// 访问后台首页：http://manage-toutiao.ministudy.com
// 前端代码访问api域名：manage - api - toutiao.ministudy.com