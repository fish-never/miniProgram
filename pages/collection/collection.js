// pages/collection/collection.js
var service = require('../../utils/service.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    bgImgs: ['topic001.png','']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    wx.hideShareMenu();
  
  },
  // 获取话题列表
  getList(){
    let params = {
      page:'1',
      pageSize:'9999'
    }
    service.request('/topic/index/index?', params, 'GET').then(res => {
      console.log(res.data)
      if(res.data.code==0){
          this.setData({
            list:res.data.data
          })
        console.log(util.bgImgIdx(2))
      }else{

      }
      
     })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})