// pages/myPrise/myPrise.js
let Promise = require('../../common/es6-promise.js');
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
const app = getApp()
const sUrl = app.globalData.serverUrl;
var service = require('../../utils/service.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataItem: [],//已授权的获取文章信息
    dataItem_unauthorized: [],//未授权的获取文章信息
    page: 1,//页码
    nodata: 2,//首次进入有数据
    nomoredata: 2,//加载有更多数据
    userInfo: {},
    userscope: 0,//用户未授权
    loading: 0,//加载中

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          that.setData({
            userscope:1
          })
          that.getMyHistory();
        } else {
          that.setData({
            userscope: 0,
          })
          var info = wx.getStorageSync('_read_record');
          console.log(info)
          if (info.length) {
            that.data.nodata = 1;
            for (var i in info) {
              info[i].coverage = info[i].coverage.split(',')
            }
            console.log(info,98989)
            that.setData({
              dataItem_unauthorized: info
            })
          } else {
            that.data.nodata = 0
          }
        }
      }
    })
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getMyHistory: function () {
    var that = this;
    if (that.data.nomoredata == 1) {
      return
    }
    wx.request({
      url: sUrl + '/ucenter/index/history',
      method: 'GET',
      data: { page: that.data.page, pageSize: 10 },
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        console.log(res)
        setTimeout(function () {
          if (res.data.code == 0) {
            console.log(res)
            if (res.data.data.length <= 0) {
              if (that.data.dataItem.length > 0) {
                that.setData({
                  nomoredata: 1//加载无新数据
                })
              } else {
                that.setData({
                  nodata: 1//首次进入无数据
                })
              }
            } else {
              if (res.data.data.length < 10) {
                that.setData({
                  nomoredata: 1//数据小于10条
                })
            }else{
                that.setData({
                  nodata: 2,//首次进入有数据
                  nomoredata: 2//加载有新数据
                })
                
            }
              var rdata = res.data.data
              for (var i in rdata) {
                rdata[i].snap.coverage = rdata[i].snap.coverage.split(',')
              }
              rdata = that.data.dataItem.concat(res.data.data)
              console.log(rdata,8879)
              that.setData({
                dataItem: rdata
              })
          }
          }
          else if (res.data.code == 10020001) {
            that.getToken(that.getMyHistory)
          }
        }, 700)
        
      },
      fail: res => {
        that.setData({
          userscope: 1,
          nomoredata: 3//加载无新数据
        })
      }
    })
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
    var that = this
    if (that.data.userscope){
      that.data.page = that.data.page + 1
      that.getMyHistory()
    }
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
  
})