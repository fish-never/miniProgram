import dot from '../../utils/dot.js'
let Promise = require('../../common/es6-promise.js');
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var app= getApp();

// pages/label/label.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var theQuery = app.globalData.query
    console.log(theQuery)
    //判断token是否失效
    
    if (options && options.query && options.query.article_id) {
      return
    } else {
      that.getLabel()
    } 
  },
  /**获取用户标签及权重 */
  getLabel: function () {
    var that = this;
    console.log(app.globalData.serverUrl)
    console.log(wx.getStorageSync('_user_token'))
    wx.request({
      url: app.globalData.serverUrl + '/tag/index/tags',
      method: 'GET',
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        console.log(res)
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '../../pages/index1/index1',
            //url: '../../pages/usercenter/usercenter'
          })
/*          if (res.data.data.length > 0) {
            wx.redirectTo({
              url: '../../pages/index1/index1',
              //url: '../../pages/usercenter/usercenter'
            })
          } else {
            wx.redirectTo({
              url: '../../pages/label/label',
              //url: '../../pages/usercenter/usercenter'
            })
          }*/
        } else if (res.data.code == 10020001) {
          that.getToken(that.getLabel)
        } else {
          console.log(res)
        }
      },
      fail:res=>{
        console.log(res)
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
        fromId: app.globalData.fromId,
        version: app.globalData.version_id
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.getLabel()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})