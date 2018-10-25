const service = require('../../utils/service.js')
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    planList: [{}],
    hasMore:true,
    loadingStatus:true,
    hasTimer:false,
    userscope:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.getPlanList()
  },
  getPlanList(page) {
    let self = this
    if(!self.data.hasTimer){
      self.setData({
        loadingStatus:true,
        hasTimer:true,
      })
      service.request('/growthplan/plan/index', {
        pageSize: 10,
        page: page || self.data.currentPage,
      }, 'GET').then((res) => {
        let dataList = [...res.data.data]
        if(self.data.currentPage>1){
          let tempList = [...self.data.planList]
          dataList = tempList.concat(dataList)
        }
        if(res.data.data.length < 10){
          self.setData({
            hasMore:false,
            planList: dataList,
            loadingStatus:false,
            hasTimer:false,
          })
        }else{
          setTimeout(function () {
            self.setData({
              planList: dataList,
              loadingStatus:false,
              hasTimer:false,
            })
          },1000)
        }
      })
    }
  },
  getMore() {
    let self = this
    if(!self.data.hasTimer){
      this.setData({
        currentPage:this.data.currentPage+1,
      })
      if(self.data.hasMore){
        self.getPlanList()
      }
    }

  },
  toPlanDetail(event){
    console.log(event)
    let idx = event.currentTarget.dataset.index
    let planId = event.currentTarget.dataset.planId
    let is_add = event.currentTarget.dataset.is_add
    wx.navigateTo({
      url: '../planDetail/planDetail?bgNum='+(idx%6)+'&planId='+planId + '&is_add=' + is_add,
    })
  },
  addPlan(event){
    let self = this
    service.request('/growthplan/user/add-plan', {
      planId: event.currentTarget.dataset.plan.id,
    }, 'GET').then((res) => {
      if(res.data.code == 0){
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
        let add = 'planList['+event.currentTarget.dataset.index+'].is_add'
        let count = 'planList['+event.currentTarget.dataset.index+'].user_count'
        self.setData({
          [add]:1,
          [count]:res.data.data.userCount
        })
      }else if(res.data.code == '10090007'){
        wx.showModal({
          title: '定制计划过多',
          content: '为了能够更加专注的养成习惯，最多只可以定制6个成长计划哦~',
          showCancel:false,
          success: function(res) {
          }
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    })
  },
  delPlan(event){
    let self = this
    wx.showModal({
      title: '退出计划',
      content: '确定要退出该成长计划吗？退出计划会中断记录，但是打卡不会丢失。',
      success: function(res) {
        if (res.confirm) {
          service.request('/growthplan/user/del-plan', {
            planId: event.currentTarget.dataset.plan.id,
          }, 'GET').then((res) => {
            if(res.data.code == 0){
              wx.showToast({
                title: '退出成功',
                icon: 'success',
              })
              let add = 'planList['+event.currentTarget.dataset.index+'].is_add'
              let count = 'planList['+event.currentTarget.dataset.index+'].user_count'
              self.setData({
                [add]:0,
                [count]:res.data.data.userCount
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          })
        }
      }
    })
  },
  checkUserInfo(){
    var self=this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          self.setData({
            userscope: 1
          })
          // 缓存信息
          wx.getUserInfo({
            success(res){
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self=this
    self.checkUserInfo()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let self = this
    let nickName = ''
    try {
      let val = wx.getStorageSync('nickName')
      if(val){
        nickName = '@'+val
      }
    } catch (e) {
    }
    return {
      title: (nickName)+"邀你一起加入成长计划，养成好习惯，遇见更好的自己。",
      imageUrl:'https://img-toutiao.ministudy.com/2018_08_21/share_project_all.png',
      path:'/pages/planIndex/planIndex',
      success: function (res) {

      },
    }
  },
})