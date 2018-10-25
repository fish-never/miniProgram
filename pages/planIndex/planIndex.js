// pages/planIndex/planIndex.js
const app = getApp()
var service = require('../../utils/service.js')
var json2 = require('../../json/data2.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  playList:[],
    userInfo:{},
    userscope:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlans()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //收集推送码
  formSubmit: function (e) {
    var that = this
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type; // 根据type执行点击事件
    console.log(formId)
    let params = {
      formid: formId,
    }
    service.request('/send/index/formid?', params, 'GET').then(res => {
      if (res.data.code == 0) {
          console.log("update") 
      } else {
        console.log(res)
      }

    })
  },
  toPage: function (e) {
    let self = this
    self.formSubmit(e)
    wx.navigateTo({
      url: '../planDetail/planDetail?bgNum=' + (e.currentTarget.dataset.index%6) + '&planId=' + e.currentTarget.dataset.planid + '&isAdd=' + e.currentTarget.dataset.isadd,
    })
  },
  toplanList: function (e) {
    let self = this
    self.formSubmit(e)
    wx.navigateTo({
      url: '../planList/planList',
    })
  },
  //获取用户计划列表
  getPlans() {
    let params = {
      page: 1,
      pageSize: 6
    }
    let that = this; 
    that.setData({
      playList: json2.json2
    })
    service.request('/growthplan/user/plan-list?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let n = res.data.data.length;
        if (n > 0) {
          that.setData({
            playList: res.data.data, // 最多展示5个精选话题
          })
        }else{
          that.setData({
            playList: [], // 最多展示5个精选话题
          })
        }
      } else {

      }

    })
  },
  //立即打卡
  addSign(e){
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let params = {
      planId: parseInt(item.plan_id)
    }
    wx.showLoading({
      title: '打卡中',
    })
    let that = this;
    service.request('/growthplan/user/add-sign?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        item.sign_total = parseInt(item.sign_total)+1
        item.is_sign=1
        that.data.playList[index]=item
          that.setData({
            playList: that.data.playList
          })
        wx.hideLoading()
        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '打卡失败',
          icon: 'none',
          duration: 1000
        })
      }

    })
  },
  //用户是否授权
  checkUserInfo() {
    var self = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          self.setData({
            userscope: 1
          })
          // 缓存信息
          wx.getUserInfo({
            success(res) {
              app.saveUserInfo(res)
            }
          })
        } else {
          self.setData({
            userscope: 0,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPlans()
    let that = this
    that.checkUserInfo()
    
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
  onShareAppMessage: function (options) {
    var that = this
    // 来自页面内的按钮的转发
    if (options.from == 'button' || options.from == 'menu') {
      // ?x-oss-process=image/resize,m_mfit,h_400,w_500,limit_0  图片尺寸小于500*400
      //?x-oss-process=image/crop,w_500,h_400,g_center  图片尺寸大于500*400
      var tit=''
      let nickName = ''
      try {
        let val = wx.getStorageSync('nickName')
        if (val) {
          nickName = '@' + val
        }
      } catch (e) {
      }
   
      return {
        title: (nickName || '我') + '邀你一起加入成长计划，养成好习惯，遇见更好的自己。',        // 默认是小程序的名称(可以写slogan等)
        path: '/pages/planIndex/planIndex',
        imageUrl: 'https://img-toutiao.ministudy.com/2018_08_21/share_project_all.png',
        //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        success: function (res) {
          // 转发成功之后的回调
          if (res.errMsg == 'shareAppMessage:ok') {
            wx.showShareMenu({
              // 要求小程序返回分享目标信息
              withShareTicket: true
            });
          }
        },
      }
    }
  }
})