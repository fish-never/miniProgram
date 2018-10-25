// pages/mycomment/mycomment.js
let Promise = require('../../common/es6-promise.js');
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
function timeRest(stringTime) {
  var stringTime = stringTime.replace(/-/g, "/");
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp2 = timestamp2 / 1000;
  var nowTime = new Date().getTime();
  var resultTime = parseInt(nowTime / 1000) - parseInt(timestamp2);
  if (resultTime < 10 * 60) {
    return "刚刚"
  } else if (resultTime > 10 * 60 && resultTime < 60 * 60) {
    return "" + Math.ceil(resultTime / 60) + "分钟前";
  } else if (resultTime >= 60 * 60 && resultTime < 60 * 60 * 24) {
    return "" + Math.ceil(resultTime / (60 * 60)) + "小时前";
  }
  // else if (resultTime >= 60 * 60 * 24 && resultTime < 60 * 60 * 24 * 3) {
  //   return "" + Math.ceil(resultTime / (60 * 60 * 24)) + "天前";
  // } 
  else {
    stringTime = stringTime.replace(/\//g, "-");
    // return stringTime.slice(0, 4) + "-" + stringTime.slice(5, 7) + "-" + stringTime.slice(8, 10);  年月日
    return stringTime
  }
}
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  commentList:[],
  page:1,//列表页码
  pagesize:10,
  nodata:2,//首次进入有数据
  nomoredata: 2//加载有更多数据
  },
  //获取我的评论列表
  getCommentList:function(){
    var that = this;
    if (that.data.nomoredata==1){
      return
    }
    var sUrl = app.globalData.serverUrl;
    wx.request({
      url: sUrl + '/ucenter/index/comment?page=' + that.data.page +'&pageSize='+that.data.pagesize,
      method: 'GET',
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data.length<=0){
            if (that.data.commentList.length>0){
              that.setData({
                nomoredata: 1//加载无新数据
              })
            }else{
              that.setData({
                nodata: 1//首次进入无数据
              })
            }
          }else{
            if (res.data.data.length <10){
              that.setData({
                nodata: 2,//首次进入有数据
                nomoredata: 1//加载无新数据
              })
            }else{
            that.setData({
              nodata: 2,//首次进入有数据
              nomoredata: 2//加载有新数据
            })
            }
            //转换时间
            res.data.data.forEach(val => {
              timeRest(val.created_at)
              Object.assign(val, {
                created_at: timeRest(val.created_at),
              })
            })
            var rdata = that.data.commentList.concat(res.data.data)
              that.setData({
                commentList:rdata
              })
          }
        } else if (res.data.code == 10020001) {
          that.getToken(that.getCommentList)
        }
      },
      fail:res => {
        that.setData({
          nomoredata: 3//加载无新数据
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommentList()
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
  var that=this
  that.data.page = that.data.page+1
  that.getCommentList()
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
  }
})