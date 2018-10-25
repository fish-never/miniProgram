 import dot from '../../utils/dot.js'
let Promise = require('../../common/es6-promise.js');
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var app= getApp();
const sUrl = app.globalData.serverUrl;
var useropenid = wx.getStorageSync('_user_openid');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userscope:0,//用户未授权
    openShare: 0,
    thirdTab: true, //tab首页显示
  },

  /**
   * 页面信息的打点配置
   */
  __dot_page: function () {
    return {
      title: '打点demo首页',
      category: '用户信息打点',
      addition: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(app.globalData.openShare)
    that.setData({
      openShare: app.globalData.openShare
    })
    //this.getLabel()
    wx.setNavigationBarColor({
      frontColor:"#ffffff",
      backgroundColor: '#344750'
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          console.log('yishouquan')
          that.getInfo()
          that.setData({
            userscope:1
          })
        } else {
          console.log('meiyou')
          that.setData({
            userscope: 0,
          })
        }
      }
    })
    
  },
  //一键咨询前授权
  isUser: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      that.setData({
        userscope: 1,
      })
      wx.request({
        url: app.globalData.serverUrl + '/user/update/base-info',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "token": wx.getStorageSync('_user_token') // 默认值
        },
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.getInfo()
          } else if (res.data.code == 10020001) {
            var wxLogin = wxApi.wxLogin()
            wxLogin().then(res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var code = res.code;
              var url = app.globalData.serverUrl + '/login/index/index'
              var params = {
                code: res.code
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
              wx.showModal({
                title: '授权失败',
                showCancel: false,
                content: '授权失败,请重新授权',
                success: function (res) {
                  that.setData({
                    userscope: 0,
                  })
                }
              })
            })
            
          }else{
            wx.getUserInfo({
              success: function (res) {
                res.userInfo.nickname = res.userInfo.nickName
                // 本地缓存用户昵称
                wx.setStorage({
                  key:"nickName",
                  data:res.userInfo.nickName,
                  fail(){
                    console.log('缓存用户昵称失败')
                  },
                })
                res.userInfo.avatar_url = res.userInfo.avatarUrl
                console.log(res.userInfo)
                that.setData({
                  userInfo: res.userInfo
                })
                wx.request({
                  url: app.globalData.serverUrl + '/user/update/base-info',
                  method: 'POST',
                  header: {
                    'content-type': 'application/json',
                    "token": wx.getStorageSync('_user_token') // 默认值
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  success: function (res) {
                    if (res.data.code == 0) {
                      wx.setStorageSync("login", "ok")  //表示用户授权成功了
                    }
                  }
                })
              }
            })
          }
        }
      })
    } else {

      wx.showModal({
        title: '授权失败',
        showCancel: false,
        content: '需要授权才能查看个人相关信息，请在授权弹窗中点击允许按钮。',
        success: function (res) { 
          that.setData({
            userscope: 0,
          })
        }
      })
    }
  },
  /**获取用户头像及昵称 */
  getInfo: function () {
    console.log('111')
    var that = this;
    var sUrl = app.globalData.serverUrl;
    wx.request({
      url: sUrl + '/ucenter/index/user',
      method: 'GET',
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        if (res.data.code == 0) {
          var rdata = res.data.data
          if (rdata) {
            that.setData({
              userInfo: rdata
            })
          }
          // 本地缓存用户昵称
          wx.setStorage({
            key:"nickName",
            data:res.data.data.nickname,
            fail(){
              console.log('缓存用户昵称失败')
            },
          })
        } else if (res.data.code == 10020001) {
          that.getToken(that.getInfo)
        } else{
          console.log('res.userInfo')
          wx.getUserInfo({
            success: function (res) {
              res.userInfo.nickname = res.userInfo.nickName
              // 本地缓存用户昵称
              wx.setStorage({
                key:"nickName",
                data:res.userInfo.nickName,
                fail(){
                  console.log('缓存用户昵称失败')
                },
              })
              res.userInfo.avatar_url = res.userInfo.avatarUrl
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
              wx.request({
                url: app.globalData.serverUrl + '/user/update/base-info',
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  "token": wx.getStorageSync('_user_token') // 默认值
                },
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  if (res.data.code == 0) {
                    wx.setStorageSync("login", "ok")  //表示用户授权成功了
                  }
                }
              })
            }
          })
          
        }
      },
      fail:res =>{
        console.log('2222')
      }
    })
  },
  //获取token
  getToken: function (funC, cnum) {
    var that = this
    var wxLogin = wxApi.wxLogin()
    wxLogin().then(res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code;
      var url = app.globalData.serverUrl + '/login/index/index'
      var params = {
        code: res.code,
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
      return funC(cnum)
    })
  },
  //收集推送码
  formSubmit: function (e) {
    var that = this
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type; // 根据type执行点击事件
    console.log(formId)
    wx.request({  // 发送到服务器
      url: app.globalData.serverUrl + '/send/index/formid',
      method: 'GET',
      data: {
        formid: formId
      },
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log("update")
        } else if (res.data.code == 10020001) {
          that.getToken(that.getInfo)
          console.log("TokenErr")
        }
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  gotoHistory: function (e) {
    wx.navigateTo({
      url: '../myHistory/myHistory',
    })
    var that = this
    that.formSubmit(e)

  },
  gotoMyComment: function (e) {
      wx.navigateTo({
        url: '../mycomment/mycomment',
      })
      var that = this
      this.formSubmit(e)
  },
  gotoMyPrise: function (e) {
    wx.navigateTo({
      url: '../myPrise/myPrise',
    })
    var that = this
    that.formSubmit(e)
  },
  gotoAbout: function (e) {
    wx.navigateTo({
      url: '../about/about',
    })
    var that = this
    that.formSubmit(e)
  },
  gotoReward: function(e){
    wx.navigateTo({
      url: '../activity/faceRecognition/mainPage/index',     // pages/activity/faceRecognition/enterPage/index
    })
    
    var that = this
    that.formSubmit(e)
    console.log(useropenid)
  },
  gotoTopicList: function(e){
    wx.navigateTo({
      url: '../topicList/topicList',
    })

    var that = this
    that.formSubmit(e)
    console.log(useropenid)
  },
  gotoCommunity: function (e) {
    wx.navigateTo({
      url: '../community/community',
    })
    var that = this
    that.formSubmit(e)
    console.log(useropenid)
  },
  gotoLottery: function(e){
    let self = this
    wx.getStorage({
      key: 'lotteryResult',
      success: function(res) {
        if(res.data.date != self.getCurrentDateStr()){
          wx.navigateTo({
            url: '/pages/activity/lottery/index'
          })
        }else{
          wx.navigateTo({
            url: '/pages/activity/lottery/resultPage/index?result='+res.data.resultIdx,     // pages/activity/faceRecognition/enterPage/index
          })
        }
      },
      fail(){
        // 获取抽签信息失败 跳转到抽签页面
        wx.navigateTo({
          url: '/pages/activity/lottery/index'
        })
      },
    })

    var that = this
    that.formSubmit(e)
    console.log(useropenid)
  },

  getCurrentDateStr(){
    // 计算当前年月日
    let date = new Date()
    let year = date.getFullYear() +''
    let month = date.getMonth()+1 +''
    let day = date.getDate()+''
    return year+month+day
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          console.log('yishouquan')
          that.getInfo()
          that.setData({
            userscope: 1
          })
        } else {
          console.log('meiyou')
          that.setData({
            userscope: 0,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})