// pages/topicDetail/topicDetail.js
const app = getApp()
var service = require('../../utils/service.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,   //默认当前tab
    swipertime: 800,
    swiperItem: [
      { name: '最热', id: '0' },
      { name: '最新', id: '1' },
    ],
    ctHeight: '',
    winHeight: "",//窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    newdataS: 0,
    scrollTop: 0,
    curNavId: 0,//头部tab默认选中第一个
    dataItem: [],
    topic_id:'1',
    topicDel:{},
    newlist:[],
    hotlist:[],
    curIndex: 0, 
    pageNum:10,
    newPage:1,
    hotPage:1,
    refreshing: false,
    nodata:1,//0加载失败，1加载中，2加载完
    nodata1:1,
    bgNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      topic_id: options.topic_id,
      bgNum: options.bgNum
    })  
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
        var calc = clientHeight * rpxR -388;
        clientHeight = clientHeight * rpxR
        that.setData({
          ctHeight: clientHeight,
          winHeight: calc
        });
      }
    });
    this.getTopicInfo()
    this.getNewList()
    this.getHotList()
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
      curIndex:id,
    })
    if (id == 1) {
      this.data.newPage=1
      this.getNewList()
    } else {
      this.data.hotPage = 1
      this.getHotList()
    }

  },
//根据话题id获取话题详情
getTopicInfo:function(){
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
  switchTab:function(e){
    this.setData({
      curNavId: e.detail.current,
    });

  },
//根据话题id获取最新帖子
  getNewList:function(){
    let that = this;
    if (that.data.nodata != 2) {
    let params = {
      topic_id: parseInt(that.data.topic_id),
      num:that.data.pageNum,
      new_or_hot: 'new',
      page: that.data.newPage,
    }
    service.request('/post/index/index?', params, 'GET').then(res => {
      if (res.data.code == 0) {
        let rdata = res.data.data.list;
        // that.changType(rdata)
        if (rdata.length>0){
          if (rdata.length>=10){
            if (that.data.newPage === 1) {
              that.setData({
                newlist: rdata,
                nodata: 1
              })
            }else{
              that.setData({
                newlist: that.data.newlist.concat(rdata),
                nodata: 1
              })
            }         
          }else{
            if (that.data.newPage === 1) {
              that.setData({
                newlist: rdata,
                nodata: 2
              })
            } else {
              that.setData({
                newlist: that.data.newlist.concat(rdata),
                nodata: 2
              })
            }  
          } 
          that.data.newPage = res.data.data.page.page        
        }else{
          that.setData({
            nodata: 2
          })
        }
      } 
    }).catch(res=>{
      that.setData({
        nodata: 0
      })
    })
    }
  },
  //根据话题id获取最新帖子
  getHotList: function () {
    let that = this;
    if (that.data.nodata1!=2){
    let params = {
      topic_id: parseInt(that.data.topic_id),
      num: that.data.pageNum,
      new_or_hot: 'hot',
      page:that.data.hotPage
    }
    service.request('/post/index/index?', params, 'GET').then(res => {
      console.log(res.data)
      if (res.data.code == 0) {
        
        let rdata = res.data.data.list;
        // that.changType(rdata)
        if(rdata.length>0){
          if (rdata.length >= 10) {
            if (that.data.hotPage === 1) {
              that.setData({
                nodata1: 1,
                hotlist: rdata
              })
            } else {
              that.setData({
                nodata1: 1,
                hotlist: that.data.hotlist.concat(rdata)
              })
            }
          } else {
            if (that.data.hotPage === 1) {
              that.setData({
                nodata1: 2,
                hotlist: rdata
              })
            } else {
              that.setData({
                nodata1: 2,
                hotlist: that.data.hotlist.concat(rdata)
              })
            }
          } 
          that.data.hotPage = res.data.data.page.page
        }else{
          that.setData({
            nodata1: 2
          })
        }
      }else{
        console.log('fail')
      }
    }).catch(res => {
      that.setData({
        nodata1: 0
      })
    })
    }
  },
  //转化content
  // changType(list) {
  //   list.forEach(item => {
  //     let str = item.content.content;
  //     str = str.substr(0, 62);
  //     let newtext = str.replace(/(#.*?#)/g, function (a) {
  //       return '<a style="color:#FD782D">' + a + "</a>"
  //     })
  //     let moreHtml = ''
  //     if (item.content.content.length > 62) {
  //       moreHtml = '<span style="color:#8EA6B0">......显示全部</span>'
  //     }
  //     item.content.content = newtext + moreHtml;
  //     item.content.images = item.content.images || [];
  //   })
  // },
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
  onShareAppMessage: function (options) {
    var that=this
    // 来自页面内的按钮的转发
    if (options.from == 'button' || options.from == 'menu') {
      // ?x-oss-process=image/resize,m_mfit,h_400,w_500,limit_0  图片尺寸小于500*400
      //?x-oss-process=image/crop,w_500,h_400,g_center  图片尺寸大于500*400
      return {
        title: that.data.topicDel.name,        // 默认是小程序的名称(可以写slogan等)
        path: '/pages/topicStickersDetail/topicStickersDetail?topic_id=' + that.data.topicDel.id,
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
  gotoArticle:function(e){
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
    if (that.data.curNavId == 1) {
      that.data.newPage = that.data.newPage+1
      that.getNewList()
    }else{
      that.data.hotPage = that.data.hotPage + 1
      that.getHotList()
    }
  },
  moreAgain: function (e) {
    var that = this;
    //非推荐加载
    if (that.data.curNavId == 1) {
      that.getNewList()
    } else {
      that.getHotList()
    }
  },
  
})