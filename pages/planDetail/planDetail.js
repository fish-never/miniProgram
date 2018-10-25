
const app = getApp()
var service = require('../../utils/service.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgNum: 0,
    encryptedData: '',
    share_icon:'',
    title:'',
    sign_total:'',
    userscope: 0,
    iv: '',
    planId:'',
    currentTab: 0,   //默认当前tab
    swipertime: 800,
    swiperItem: [
      { name: '最新打卡', id: '0' },
      { name: '热门打卡', id: '1' },
      { name: '打卡排行', id: '2' },
    ],
    ctHeight: '',
    winHeight: "",//窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    newdataS: 0,
    scrollTop: 0,
    curNavId: 0,//头部tab默认选中第一个
    dataItem: [],
    topic_id: '1',
    topicDel: {},
    ranklist: [ ],
    newlist: [],
    hotlist: [],
    curIndex: 0,
    pageNum: 10,
    newPage: 1,
    hotPage: 1,
    rankPage:1,
    refreshing: false,
    nodata: 1,//0加载失败，1加载中，2加载完
    nodata1: 1,
    nodata2: 1,
    planDel:{}, // 计划详情
    is_add:0, //0没有加入计划,1加入计划
    is_sign:0,
    date:'',
    day:'',
    Moth: "",
    today: '',
    showCover: true,//true为隐藏弹出框
    week: [
      {
        is_sign:0,
        date: "一",
        today:false
      }, 
      {
        is_sign: 0,
        date: "二",
        today: false
      }, 
      {
        is_sign: 0,
        date: "三",
        today: false
      },
      {
        is_sign: 0,
        date: "四",
        today: false
      },
      {
        is_sign: 0,
        date: "五",
        today: false
      },
      {
        is_sign: 0,
        date: "六",
        today: false
      },
      {
        is_sign: 0,
        date: "日",
        today: false
      }, ],
      isHide:0//隐藏最热和最新打卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
      this.setData({
        bgNum: options.bgNum, // 最多展示5个精选话题
        planId: options.planId,
        is_add: parseInt(options.is_add)
      })

    if (wx.getStorageSync('_isCheck') === "0") {
      this.setData({
        swiperItem: [
          { name: '打卡排行', id: '2' },
        ],
        isHide:1
      })
    }
    this.getPlanDetail()
    if (wx.getStorageSync('_isCheck') === "0") {
      this.getRankList()
    } else {
      this.getNewList()
      this.getHotList()
      this.getRankList()
    }
    switch (parseInt(this.data.bgNum)) {
      case 0:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#FB745F'
        })
        break;
      case 1:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#3F67E9'
        })
        break;
      case 2:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#33C774'
        })
        break;
      case 3:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#FECC21'
        })
        break;
      case 4:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#A83DE8'
        })
        break;
      case 5:
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#FD8C6B'
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  高度自适应
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 388;
        clientHeight = clientHeight * rpxR
        that.setData({
          ctHeight: clientHeight,
          winHeight: calc
        });
      }
    });
    this.getTopicInfo()
    this.getPlanDetail()
  },
  //切换头部tab
  tapChoose: function (e) {
    this.setData({
      swipertime: 10,
      //isscoll: false //点击tab,则不执行checkCor
    })
    let id = parseInt(e.target.dataset.id)
    this.setData({
      curNavId: id,
      curIndex: id,
    })
    if (id == 1) {
      this.data.newPage = 1
      this.getHotList()
    } else if(id == 0) {
      this.data.hotPage = 1
      this.getNewList()
    }else{
      this.data.rankPage = 1
      this.getRankList() 
    }

  },
  //加入计划
  add:function(){
    let that = this;
    let params = {
      planId: parseInt(that.data.planId),
    }
    service.request('/growthplan/user/add-plan?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        that.getPlanDetail();
        let rdata = res.data.data;
        that.setData({
          is_add: 1,
          is_sign: 0
        })
      }else{
        wx.showModal({
          title: '定制计划过多',
          content: '为了能够更加专注的养成习惯，最多只可以定制6个成长计划哦~',
          showCancel: false,
          success: function (res) {
          }
        })
      }
    })
  },
  hideCover() {
    this.setData({
      showCover: true, // 显示弹出框
    })
  },
  //打卡 growthplan/user/add-sign
  addSign: function () {
    let that = this;
    let params = {
      planId: parseInt(that.data.planId),
    }
    service.request('/growthplan/user/add-sign?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let rdata = res.data.data;
        if (parseInt(rdata.ongoingCount)==3){
          that.setData({
            showCover: false, // 显示弹出框
          })
        }else{
          wx.navigateTo({
            url: '/pages/planSign/planSign?bgNum=' + (that.data.bgNum % 6) + '&planId=' + that.data.plan_id + '&topic_id=' + that.data.topic_id,
          });
        }
        that.getPlanDetail();
      }else{
        wx.showToast({
          title: '打卡失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getPlanDetail: function () {
    let that = this;
    let myDate = new Date();//获取系统当前时间
    console.log(myDate)
    let weekIndex = myDate.getDay();//获取当前星期X(0-6,0代表星期天)
    that.getDay(myDate, weekIndex);
    let params = {
      planId: parseInt(that.data.planId),
    }
    that.setData({
      planDel: {
        user_icon:'',
        title:'每天看书1小时',
        user_count:45,
        is_sign:0,
        is_add:1,
        topic_id:4,
        plan_id:4,
      },
      is_sign: that.data.planDel.is_sign,
      is_add: that.data.planDel.is_add,
      topic_id: that.data.planDel.topic_id,
      plan_id: that.data.planDel.id,
      share_icon: that.data.planDel.share_icon,
      title: that.data.planDel.title,
      sign_total: that.data.planDel.sign_total
    })
    service.request('/growthplan/plan/info?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let rdata = res.data.data;
        that.setWeek(rdata.sign_history, weekIndex)
        that.setData({
          planDel: rdata,
          is_sign: rdata.is_sign,
          is_add:rdata.is_add,
          topic_id: rdata.topic_id,
          plan_id: rdata.id,
          share_icon: rdata.share_icon,
          title: rdata.title,
          sign_total: rdata.sign_total
        })
        // 设置navigationBar
        if (rdata.is_add == 1){
          wx.setNavigationBarTitle({
            title: rdata.title
          })
        }else{
          wx.setNavigationBarTitle({
            title:"计划详情"
          })
        }

      }
    })
  },
  setWeek(data,flag){
    let that = this;
    data.forEach(item => {
      let date = item.replace(/(\d\d\d\d)(\d\d)(\d\d)/, "$1/$2/$3");
      let index = new Date(date).getDay(); //获取当前星期X(0-6,0代表星期天)
      let n = index - 1;
      if(flag == 0 || flag > n){
        if (n >= 0) {
          let data = 'week[' + n + '].is_sign'
          that.setData({
            [data]: 1
          })
        } else {
          let data = 'week[' + 6 + '].is_sign'
          that.setData({
            [data]: 1
          })
        }
      }
    })
  },
  getDay(myDate,weekIndex){
    let that = this;
    let Moth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    let today = myDate.getDate(); //获取当前日(1-31)
    that.setData({
      Moth: Moth + 1,
      today: today
    })
    switch (weekIndex) {
      case 0:
        that.setData({
          day: "周日"
        })
        break;
      case 1:
        that.setData({
          day: "周一"
        })
        break;
      case 2:
        that.setData({
          day: "周二"
        })
        break;
      case 3:
        that.setData({
          day: "周三"
        })
        break;
      case 4:
        that.setData({
          day: "周四"
        })
        break;
      case 5:
        that.setData({
          day: "周五"
        })
        break;
      case 6:
        that.setData({
          day: "周六"
        })
        break;
    }
    if (weekIndex == 0) {
      let item = 'week[6].today';
      that.setData({
        [item]: true
      })
    } else {
      let index = weekIndex - 1;
      let item = 'week[' + index + '].today';
      that.setData({
        [item]: true
      })
    }
  },
  //根据话题id获取话题详情
  getTopicInfo: function () {
    let that = this;
    let params = {
      id: parseInt(that.data.topic_id),
    }
    service.request('/topic/info/view?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let rdata = res.data.data;
        that.setData({
          topicDel: rdata
        })
      }
    })
  },
  switchTab: function (e) {
    this.setData({
      curNavId: e.detail.current,
    });

  },
  // 打卡排行
  getRankList: function(){
    let that = this;
    if (that.data.nodata != 2) {
      let params = {
        planId: parseInt(that.data.planId),
        pageSize: that.data.pageNum,
        page: that.data.rankPage,
      }
      service.request('/growthplan/plan/rank?', params, 'GET').then(res => {
        if (res.data.code == 0) {
          let rdata = res.data.data.list;
          if (rdata.length > 0) {
            if (rdata.length >= 10) {
              if (that.data.rankPage === 1) {
                that.setData({
                  ranklist:rdata,
                  nodata2: 1
                })
              } else {
                that.setData({
                  ranklist: that.data.ranklist.concat(rdata),
                  nodata2: 3
                })
              }
            } else {
              if (that.data.rankPage === 1) {
                that.setData({
                  ranklist: rdata,
                  nodata2: 4
                })
              } else {
                that.setData({
                  ranklist: that.data.ranklist.concat(rdata),
                  nodata2: 2
                })
              }
            }
            that.data.rankPage = parseInt(res.data.data.page)
          } else {
            that.setData({
              nodata2: 2
            })
          }
        }
      }).catch(res => {
        that.setData({
          nodata2: 0
        })
      })
    } 
  },
  //最新打卡
  getNewList: function () {
    let that = this;
    if (that.data.nodata != 2) {
      let params = {
        planId: parseInt(that.data.planId),
        pageSize: that.data.pageNum,
        page: that.data.newPage,
      }
      service.request('/growthplan/plan/new-post?', params, 'GET').then(res => {
        if (res.data.code == 0) {

          let rdata = res.data.data.list;
          if (rdata.length > 0) {
            if (rdata.length >= 10) {
              if (that.data.newPage === 1) {
                that.setData({
                  newlist: rdata,
                  nodata: 4
                })
              } else {
                that.setData({
                  newlist: that.data.newlist.concat(rdata),
                  nodata: 3
                })
              }
              console.log(that.data.newlist, that.data.newPage)
            } else {
              if (that.data.newPage === 1) {
                console.log(rdata)
                that.setData({
                  newlist: rdata,
                  nodata: 4
                })
                console.log(that.data.newlist, that.data.newPage)
              } else {
                that.setData({
                  newlist: that.data.newlist.concat(rdata),
                  nodata: 2
                })
              }
            }
            that.data.newPage = parseInt(res.data.data.page)
          } else {
            that.setData({
              nodata: 2
            })
          }
        }
      }).catch(res => {
        that.setData({
          nodata: 0
        })
      })
    }
  },
  //热门打卡
  getHotList: function () {
    let that = this;
    if (that.data.nodata1 != 2) {
      let params = {
        planId: parseInt(that.data.planId),
        page: parseInt(that.data.hotPage),
        pageSize: that.data.pageNum,
      }
      service.request('/growthplan/plan/hot-post?', params, 'GET').then(res => {
        if (res.data.code == 0) {
          let rdata = res.data.data.list;
          if (rdata.length > 0) {
            if (rdata.length >= 10) {
              if (that.data.hotPage === 1) {
                that.setData({
                  nodata1: 1,
                  hotlist: rdata
                })
              } else {
                that.setData({
                  nodata1: 3,
                  hotlist: that.data.hotlist.concat(rdata)
                })
              }
            } else {
              if (that.data.hotPage === 1) {
                that.setData({
                  nodata1: 4,
                  hotlist: rdata
                })
              } else {
                that.setData({
                  nodata1: 2,
                  hotlist: that.data.hotlist.concat(rdata)
                })
              }
            }
            that.data.hotPage = parseInt(res.data.data.page)
          } else {
            that.setData({
              nodata1: 2
            })
          }
        } else {
          console.log('fail')
        }
      }).catch(res => {
        that.setData({
          nodata1: 0
        })
      })
    }
  },
  hideCover() {
    this.setData({
      showCover: true, // 显示弹出框
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this
    self.checkUserInfo()
    if (wx.getStorageSync('_isCheck') === "0") {
      this.getRankList()
    } else {
      this.getNewList()
      this.getHotList()
      this.getRankList()
    }
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

  checkUserInfo() {
    var self = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          self.setData({
            userscope: 1
          })
        } else {
          self.setData({
            userscope: 0,
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    wx.setStorageSync('nickName', e.detail.userInfo.nickName);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let self = this
    let nickName = ''
    try {
      let val = wx.getStorageSync('nickName')
      if (val) {
        nickName = '@' + val
      }
    } catch (e) {
    }
    if(self.data.is_add == 1){
      return {
        title: (nickName || '我') + "已加入[" + self.data.title + ']计划,已坚持' + self.data.sign_total + '天,邀你一起参与,成为更好的自己',
        imageUrl: self.data.share_icon,
        success: function (res) {

        },
      }
    }else{
      return {
        title: (nickName || '') + "邀你一起参与[" + self.data.title + ']计划,养成好习惯,成为更好的自己',
        imageUrl: self.data.share_icon,
        success: function (res) {

        },
    }

    }
  },
  
  gotoArticle: function (e) {
    var that = this
    //that.formSubmit(e)
    wx.navigateTo({
      url: '../articleNode/articleNode?topic_id=' + e.currentTarget.id,
    })
  },
  //加载更多
  lower: function (e) {
    var that = this;
    //非推荐加载
    if (that.data.curNavId == 0) {
      that.data.newPage = that.data.newPage + 1
      that.getNewList()
    } else if (that.data.curNavId  == 1){
      that.data.hotPage = that.data.hotPage + 1
      that.getHotList()
    }else{
      that.data.rankPage = that.data.rankPage + 1
      this.getRankList()
    }
  },
  moreAgain: function (e) {
    var that = this;
    //非推荐加载
    if (that.data.curNavId == 0) {
      that.getNewList()
    } else if (that.data.curNavId == 1){
      that.getHotList()
    }else{
    this.getRankList()
    }
  },

})