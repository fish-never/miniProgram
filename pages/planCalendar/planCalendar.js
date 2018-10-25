// pages/planIndex/planIndex.js
const app = getApp()
var service = require('../../utils/service.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgNum: 0,
    allDate: [],
    allFullDate: [],
    signChance:0,//补签次数
    todayDate:'',
    showCover:true,//true为隐藏弹出框
    clickDayIndex:0,
    signTotal:0,//签到天数
    joinCount:0,//参与天数
    userCount:0,//参与人数
    planId:1,
    title:'',
    shareImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bgNum: 2, // 最多展示5个精选话题
      planId: 4,
      title: '每天喝8杯水',
      shareImg: ''
    })
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
          backgroundColor: '#2FC572F'
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

    this.getDateArray1();
    this.signTotal()
  },
  //
  hideCover(){
    this.setData({
      showCover: true, // 显示弹出框
    })
  },
  //补签
  showCoverF(e){
    let index = e.currentTarget.dataset.index
    if (this.data.allDate[index].canSign==1){
      this.setData({
        showCover: false, // 显示弹出框
        clickDayIndex: index
      })
    }else{
      wx.showToast({
        title: '该点击日期不可补签哦',
        icon: 'none',
        duration: 2000
      })
    }
  },
  supplement(){
    let index = this.data.clickDayIndex
    let params = {
      planId: parseInt(this.data.planId),
      day: this.data.allFullDate[index].date
    }
    let that = this;
    service.request('/growthplan/user/supplement?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let rdata = res.data.data;
        this.data.allDate[index].isSign = 1
        that.setData({
          signChance: res.data.data.signChance, // 补签次数
          allDate: this.data.allDate
        })
        wx.showToast({
          title: '补签成功',
          icon: 'success',
          duration: 2000
        })
        that.hideCover()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.hideCover()
      }
    })
  },

  getDateArray1() {
    var result = [];
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    if (currentDay == 0)
      currentDay = 7;
    var firstDate = new Date(currentDate.getTime() - (3 * 7 + currentDay - 1) * 24 * 3600 * 1000);
    var firstDay = firstDate.getDate();
    var endDate = new Date(currentDate.getTime() + (7 - currentDay) * 24 * 3600 * 1000);
    var endDay = endDate.getDate();
    var monthDays = (endDay - firstDay == 28) ? 0 : (firstDay + 28 - endDay) - 1;
    var currentIndex = firstDay;
    var currentRow = [];
    var itemYear = firstDate.getFullYear();
    var itemMonth = (firstDate.getMonth() + 1) < 10 ? "0" + (firstDate.getMonth() + 1) : "" + (firstDate.getMonth() + 1);
    for (var j = 0; j < 28; j++) {
      if (currentIndex > monthDays) {
        currentIndex = 1;
        itemYear = endDate.getFullYear();
        itemMonth = (endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : "" + (endDate.getMonth() + 1);
      }
      var currentCol = itemYear + itemMonth + (currentIndex < 10 ? "0" + currentIndex : "" + currentIndex);
      currentRow.push({
        'date': currentCol,
        'isSign': 0,
        'canSign': 0
      });
      currentIndex++;
    }
    result.push(currentRow);
    this.setData({
      allDate: result
    })
    //return result;
  },
  signTotal() {
    let params = {
      planId: this.data.planId,
    }
    let that = this;
    that.setData({
      signList: ['10','11','12'], // 最多展示5个精选话题
      todayDate: new Date().Format('yyyy年MM月dd日'),
      signChance:4,
      signTotal: 23,
      userCount: 65,
      joinCount: 678,
    })

      var result = [];
      var currentDate = new Date();
      var currentDay = currentDate.getDay();
      if (currentDay == 0)
        currentDay = 7;
      var firstDate = new Date(currentDate.getTime() - (3 * 7 + currentDay - 1) * 24 * 3600 * 1000);
      var firstDay = firstDate.getDate();
      var endDate = new Date(currentDate.getTime() + (7 - currentDay) * 24 * 3600 * 1000);
      var endDay = endDate.getDate();
      var monthDays = (endDay - firstDay == 28) ? 0 : (firstDay + 28 - endDay) - 1;
      var currentIndex = firstDay;
      var currentRow = [];
      var itemYear = firstDate.getFullYear();
      var itemMonth = (firstDate.getMonth() + 1) < 10 ? "0" + (firstDate.getMonth() + 1) : "" + (firstDate.getMonth() + 1);
      for (var j = 0; j < 28; j++) {
        if (currentIndex > monthDays) {
          currentIndex = 1;
          itemYear = endDate.getFullYear();
          itemMonth = (endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : "" + (endDate.getMonth() + 1);
        }
        var currentCol = itemYear + itemMonth + (currentIndex < 10 ? "0" + currentIndex : "" + currentIndex);
        currentRow.push({
          'date': currentCol,
          'isSign': 0,
          'canSign': 0,
          'isToday':0
        });
        currentIndex++;
      } 
      for (var j = 0; j < that.data.signList.length; j++) {
        for (var i = 0; i < currentRow.length; i++) {
          if (that.data.signList[j] == currentRow[i].date) {
            currentRow[i].isSign = 1
          }
        }
      }
      var today = new Date().Format("yyyyMMdd")
      var todayIndex
      for (var i = 0; i < currentRow.length; i++) {
        if (today == currentRow[i].date){
          todayIndex=i
          currentRow[i].isToday = 1
        }
      }
      for (var i = todayIndex - 6; i < todayIndex ; i++) {
        if (currentRow[i].isSign == 0) {
          currentRow[i].canSign=1
        }
      } 
      for (var i = todayIndex + 1; i < currentRow.length; i++) {
          currentRow[i].isfetrue = 1
      }
      this.setData({
        allFullDate: currentRow
      })
      for (var i = 0; i < currentRow.length; i++) {
        currentRow[i].date = currentRow[i].date.slice(-2)
      } 
      this.setData({
        allDate: currentRow
      })
  },
  onShareAppMessage: function (options) {
    var that = this
    // 来自页面内的按钮的转发
    if (options.from == 'button' || options.from == 'menu') {
      // ?x-oss-process=image/resize,m_mfit,h_400,w_500,limit_0  图片尺寸小于500*400
      //?x-oss-process=image/crop,w_500,h_400,g_center  图片尺寸大于500*400
      var theName = wx.getStorageSync('nickName')
      var tit = ''
      if (theName && theName != undefined) {
        tit = '@' + theName + '已加入' + that.data.title + '计划，已坚持' + that.data.signTotal+'天，邀你一起参与，成为更好的自己。'
      } else {
        tit = '我已加入' + that.data.title + '计划，已坚持' + that.data.signTotal +'天，邀你一起参与，成为更好的自己。'
      }
      return {
        title:tit,        // 默认是小程序的名称(可以写slogan等)
        imageUrl: that.data.shareImg,
        path: '/pages/planDetail/planDetail?bgNum=' + that.data.bgNum + '&planId=' + that.data.planId ,
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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})