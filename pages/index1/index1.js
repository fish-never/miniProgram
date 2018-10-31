//index.js
import dot from '../../utils/dot.js'
import {observer} from '../../libs/observer'
var util = require('../../utils/util')
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var throttle = require('../../common/throttle.js');
var json1 = require('../../json/data1.js');
var qcloud = require('../../utils/sdkRequst.js');
var qcloudlogin = require('../../utils/login.js');
let Promise = require('../../common/es6-promise.js');
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var getToken = require('../../utils/token.js');

//获取应用实例
const app = getApp()
const sUrl = app.globalData.serverUrl;
var onePlay = true;
var deviceInfo = wx.getSystemInfoSync()
var addition = {
  "deviceID": "",
  "version": deviceInfo.version,
  "platform": deviceInfo.platform,
  "geoPosition": "0,0",
  "contentId": "",
  "pullDownType": "manual",
  "offset": 0,
  "articleId": 0,
  "authRes": 0,
  "actionId": "listExposure",
  "actionType": "list",
  "commentId": 0,
  "tagId": 0,
};

Page(observer({
  data: {
    firstTab: true, //tab首页显示
    ctHeight: '',
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    sss: app.globalData.s_token,
    swiperItem: [{
        name: '推荐',
        id: '0'
      },
      {
        name: '自考',
        id: '1'
      },
      {
        name: '职场',
        id: '3'
      },
      {
        name: '文化',
        id: '5'
      },
      {
        name: '生活',
        id: '9'
      },
    ],
    dataItem: [
      
    ],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    curNavId: 0, //头部tab默认选中第一个
    curIndex:0,
    nodata: false,
    newRefeshdata: true,
    newdatanum: 0,
    loading: false,
    scrollTop: 0,
    isAndroid: true,
    animationData: {},
    refreshing: false,
    newdataS: 0,
    recommondContentIdArray: [],
    categoryContentIdArray: [],
    endTime: "",
    startTime: "",
    refreshContentIdArray: [],
    loadMoreContentIdArray: [],
    getRecommondInfoStatus: 0,
    pullDownStatus: 0,
    changeS: true,
    updataing: false,
    swipertime: 800,
    arrHight: [],
    arr: [],
    //isscoll:true
    sceneUserId: "", // 分享人ID
    sceneActicleId: "", //文章ID
    activityFlag: false, // 是否有活动
    activity: '', // 活动
    goAct: false,
    gotoArticle: false,
    tabwidth:''
  },
  /**
   * 页面信息的打点配置
   */
  __dot_page: function() {
    addition.sceneUserId = this.data.sceneUserId
    addition.sceneActicleId = this.data.sceneActicleId
    addition.sceneUserId = app.globalData.sceneUserId
    addition.sceneActicleId = app.globalData.sceneActicleId
    var addistr = JSON.stringify(addition);
    console.log(addition)
    return {
      title: 'listExposure',
      category: '浏览信息打点',
      addition: addistr,
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function(options) {
    // 从小程序码进入
    console.log(options)

    var that = this;
    // eg: `1,4,0`表示user_id为1, article_id 4, post_id为0.第4位为1跳活动页,前3为为0
    if (options.hasOwnProperty('scene')) {
      var scene = decodeURIComponent(options.scene) //参数二维码传递过来的参数
      console.log(scene, 999)
      let arr = [];
      arr = scene.split(',')
      console.log(arr, 8787)
      if (arr[0] == 0 && arr[1] == 0 && arr[2] == 0 && arr[3] == 2) { // 从二维码进去
        that.setData({
          activity: arr[3],
          activityFlag: true
        })
        console.log(that.data)

      } else {
        that.setData({
          sceneUserId: arr[0], // 分享人ID
          sceneActicleId: arr[1] //文章ID
        })
        app.globalData.sceneActicleId = arr[1] //全局article_id
        app.globalData.sceneUserId = arr[0] //全局user_id
      }

    } else if (options.hasOwnProperty('user_id')) {
      app.globalData.sceneUserId = options.user_id //全局user_id
      app.globalData.sceneActicleId = options.article_id //全局article_id

    } else {
      app.globalData.sceneActicleId = "" //全局article_id
      app.globalData.sceneUserId = "" //全局user_id
    }
    // wx.hideLoading();

    //为dataItem先创建结构
    var listNum = that.data.swiperItem.length
    for (var i = 0; i < listNum; i++) {
      that.data.dataItem[i] = {
        list:[],
        id: that.data.swiperItem[i].id
      }
    }
    that.setData({
      dataItem: that.data.dataItem
    });
    console.log('aaaaa' + options)
    //从公众号进入的参数tagid值分析
    if (options.tagid) {
      //that.data.currentTab = options.tagid
      that.setData({
        currentTab: options.tagid
      })
      //根据id值获取索引值，将索引值付给curIndex，牵制swiper滑动到当前页
      for (var i = 0; i < that.data.swiperItem.length;i++){
        if (that.data.swiperItem[i].id == that.data.currentTab){
          that.setData({
            curIndex: i
          })
          break;
        }
      }
      if (options.tagid == 0) {
        this.getRecommondInfo(1);
      }
    } else {
      this.getRecommondInfo(1);

    }

    //var theQuery = app.globalData.query
    //app.globalData.query = {}
    //分享场景进来跳转进入文章详情页
    if (options.article_id && options.article_id != 0) {
      that.setData({
        gotoArticle: true
      })

      
    }
    if (options.hasOwnProperty('promote') || that.data.activityFlag) { //从海报进入活动页
      console.log(app.globalData.s_userid)
      that.setData({
        goAct: true
      })
    }


  },
  onShow: function(options) {

  },
  onHide: function() {

  },
  onReady: function() {
    //  高度自适应
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "ios") {
          that.setData({
            isAndroid: false
          })
        }
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 56;
        clientHeight = clientHeight * rpxR;
        // var thewidth = (clientWidth*rpxR -110)/5;
        var thewidth = (clientWidth * rpxR) / 5
        that.setData({
          ctHeight: clientHeight,
          winHeight: calc,
          tabwidth: thewidth
        });
      }
    });
  },

  //根据推荐获取信息列表
  getRecommondInfo: function(num) {
    var that = this;
    that.setData({
      dataItem: json1.json1
    })
  },
  shuru: function() {
    var time = Date.parse(new Date())
    console.log('image----------' + time)
  },
  getCurrentDateStr(){
    // 计算当前年月日
    let date = new Date()
    let year = date.getFullYear() +''
    let month = date.getMonth()+1 +''
    let day = date.getDate()+''
    return year+month+day
  },
  //根据分类获取信息列表
  getInfo: function(tid,tindex) {
    var that = this;
    wx.request({
      url: sUrl + '/info/index/index',
      method: 'GET',
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      data: {
        type_id: tid
      },
      success: res => {
        if (res.data.code == 0) {
          var rdata = res.data.data.data
          this.data.categoryContentIdArray = [];
          for (var i in rdata) {
            this.data.categoryContentIdArray.push(rdata[i].id);
            rdata[i].coverage = rdata[i].coverage.split(',')
            if (rdata[i].read_count >= 10000 && rdata[i].read_count < 11000) {
              rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
            } else if (rdata[i].read_count >= 11000 && rdata[i].read_count < 10000000) {
              rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
            }
            if (rdata[i].comment_count >= 10000 && rdata[i].comment_count < 11000) {
              rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
            } else if (rdata[i].comment_count >= 11000 && rdata[i].comment_count < 10000000) {
              rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
            }
            if (rdata[i].like_count >= 10000 && rdata[i].like_count < 11000) {
              rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
            } else if (rdata[i].like_count >= 11000 && rdata[i].like_count < 10000000) {
              rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
            }
            // 大于10000w 展示1000w 取整数
            if (rdata[i].read_count >= 10000000) {
              rdata[i].read_count = parseInt(rdata[i].read_count / 10000) + "w"
            }
            if (rdata[i].comment_count >= 10000000) {
              rdata[i].comment_count = parseInt(rdata[i].comment_count / 10000) + "w"
            }
            if (rdata[i].like_count >= 10000000) {
              rdata[i].like_count = parseInt(rdata[i].like_count / 10000) + "w"
            }
          }

          that.data.dataItem[tindex].list = rdata
          that.setData({
            dataItem: that.data.dataItem,
            scrollTop: 0
          })
        } else if (res.data.code == 10020001) {
          that.getToken(that.getInfo, that.data.currentTab, that.data.curIndex)
        } else {
          console.log(res)
        }
        // //切换头部加载内容埋点

        let now = new Date().getTime();
        addition.tagId = this.data.curNavId;
        addition.timestamp = now;
        addition.contentId = this.data.categoryContentIdArray.toString();
        console.log(addition);
        var addistr = JSON.stringify(addition);
        dot.customEvent({
          event: 'changeTab',
          category: '动作信息打点',
          value: 'listExposure',
          addition: addistr
        })
      },
      fail: res => {
        that.setData({
          nomore: 2,
        })
        wx.showLoading({
          title: '请求失败',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }

    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  // checkCor: function() {
  //   if (this.data.currentTab > 8) {
  //     this.setData({
  //       scrollLeft: 600
  //     })

  //   } else if (this.data.currentTab > 6) {
  //     this.setData({
  //       scrollLeft: 450
  //     })

  //   } else if (this.data.currentTab > 4) {
  //     this.setData({
  //       scrollLeft: 300
  //     })

  //   } else if (this.data.currentTab > 2) {
  //     this.setData({
  //       scrollLeft: 150
  //     })

  //   } else {
  //     this.setData({
  //       scrollLeft: 0
  //     })

  //   }
  //   if (this.data.dataItem[this.data.curIndex].list.length <= 0) {
  //     if (this.data.currentTab == 0) {
  //       this.getRecommondInfo(1)
  //     } else {
  //       this.getInfo(this.data.currentTab, this.data.curIndex)
  //     }
  //   }
  //   this.setData({
  //     changeS: true,
  //   });

  // },
  // 滚动切换标签样式
  switchTab: throttle.throttle(function(e) {
    //if (this.data.changeS) {
      this.setData({
        swipertime: 800,
        changeS: false,
        currentTab: parseInt(this.data.swiperItem[e.detail.current].id),
        curNavId: parseInt(this.data.swiperItem[e.detail.current].id),
        curIndex: e.detail.current,
        nomore: 0,
      });
      // if (this.data.isscoll){
      //   this.checkCor();//this.data.isscoll为true,才执行checkCor，既若为点击tab,则不执行checkCor
      // }
      //this.checkCor()
      if (this.data.dataItem[this.data.curIndex].list.length <= 0) {
        if (this.data.currentTab == 0) {
          this.getRecommondInfo(1)
        } else {
          this.getInfo(this.data.currentTab, this.data.curIndex)
        }
      }
    //}
  }, 250),
  //切换头部tab
  tapChoose: throttle.throttle(function(e) {
    this.setData({
      swipertime: 10,
      //isscoll: false //点击tab,则不执行checkCor
    })
    let id = parseInt(e.target.dataset.id)
    let index = parseInt(e.target.dataset.index)
    if (this.data.currentTab == id) {
      return false;
    } else {
      this.setData({
        currentTab: id,
        currentTab: id
      })
    }
    this.setData({
      curNavId: id,
      nomore: 0,
      curIndex: index
      //dataItem:[]
    })

    if (id == 0) {
      this.getRecommondInfo(1)
    } else {
      this.getInfo(id,index)
    }

  }, 2000),
  //加载更多
  _onloadMore: function(e) {
    var that = this;
    //非推荐加载
    if (that.data.curNavId != 0) {
      var theList = that.data.dataItem[that.data.curIndex].list
      var bottomId = theList[theList.length - 1].id
      wx.request({
        url: sUrl + '/info/index/up',
        method: 'GET',
        header: {
          "token": wx.getStorageSync('_user_token')
        },
        data: {
          type_id: that.data.curNavId,
          id: bottomId
        },
        success: res => {
          if (res.data.code == 0) {
            var rdata = res.data.data.data;
            console.log(rdata)
            this.data.loadMoreContentIdArray = [];
            for (var i in rdata) {
              this.data.loadMoreContentIdArray.push(rdata[i].id);

              rdata[i].coverage = rdata[i].coverage.split(',')
              if (rdata[i].read_count >= 10000 && rdata[i].read_count < 11000) {
                rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
              } else if (rdata[i].read_count >= 11000 && rdata[i].read_count < 10000000) {
                rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
              }
              if (rdata[i].comment_count >= 10000 && rdata[i].comment_count < 11000) {
                rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
              } else if (rdata[i].comment_count >= 11000 && rdata[i].comment_count < 10000000) {
                rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
              }
              if (rdata[i].like_count >= 10000 && rdata[i].like_count < 11000) {
                rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
              } else if (rdata[i].like_count >= 11000 && rdata[i].like_count < 10000000) {
                rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
              }
              // 大于10000w 展示1000w 取整数
              if (rdata[i].read_count >= 10000000) {
                rdata[i].read_count = parseInt(rdata[i].read_count / 10000) + "w"
              }
              if (rdata[i].comment_count >= 10000000) {
                rdata[i].comment_count = parseInt(rdata[i].comment_count / 10000) + "w"
              }
              if (rdata[i].like_count >= 10000000) {
                rdata[i].like_count = parseInt(rdata[i].like_count / 10000) + "w"
              }
            }
            console.log(this.data.loadMoreContentIdArray)
            //上滑动作埋点
            // this.data.getRecommondInfoStatus = 1;

            let now = new Date().getTime();
            addition.tagId = this.data.curNavId;
            addition.timestamp = now;
            addition.contentId = this.data.loadMoreContentIdArray.toString();
            addition.actionId = 'listPaging';
            console.log(addition);
            var addistr = JSON.stringify(addition);
            dot.customEvent({
              event: 'pullUp',
              category: '动作信息打点',
              value: 'listPaging',
              addition: addistr
            })
            //rdata = that.data.dataItem.concat(rdata)
            that.data.dataItem[that.data.curIndex].list = that.data.dataItem[that.data.curIndex].list.concat(rdata)
            that.setData({
              dataItem: that.data.dataItem,
              nomore: 0
            })


            if (rdata.length < 15) {
              that.setData({
                nomore: 1,
              })
            }
          } else if (res.data.code == 10020001) {
            that.getToken(that._onloadMore)
          }
        },
        fail: res => {
          that.setData({
            nomore: 2,
          })
          wx.showLoading({
            title: '请求失败',
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      })
    } else {
      //推荐加载
      this.getRecommondInfo(1);
    }

  },
  //刷新处理
  _onrefesh: function(e) {
    var that = this;
    that.setData({
      updataing: true,
      scrollTop: 0
    })
    if (that.data.dataItem[that.data.curIndex].list.length <= 0) {
      if (that.data.curNavId == 0) {
        this.getRecommondInfo(1);
      } else {
        that.getInfo(that.data.curNavId, that.data.curIndex)
      }

    } else {
      setTimeout(() => {
        //非推荐刷新
        if (that.data.curNavId != 0) {
          var theList = that.data.dataItem[that.data.curIndex].list
          var topId = theList[0].id
          wx.request({
            url: sUrl + '/info/index/down',
            method: 'GET',
            header: {
              "token": wx.getStorageSync('_user_token')
            },
            data: {
              type_id: that.data.curNavId,
              id: topId
            },
            success: res => {
              if (res.data.code == 0) {
                var rdata = res.data.data.data;
                console.log(rdata)
                for (var i in rdata) {
                  this.data.refreshContentIdArray.push(rdata[i].id);
                  rdata[i].coverage = rdata[i].coverage.split(',')
                  if (rdata[i].read_count >= 10000 && rdata[i].read_count < 11000) {
                    rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
                  } else if (rdata[i].read_count >= 11000 && rdata[i].read_count < 10000000) {
                    rdata[i].read_count = Math.floor(rdata[i].read_count / 10000) + "w"
                  }
                  if (rdata[i].comment_count >= 10000 && rdata[i].comment_count < 11000) {
                    rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
                  } else if (rdata[i].comment_count >= 11000 && rdata[i].comment_count < 10000000) {
                    rdata[i].comment_count = Math.floor(rdata[i].comment_count / 10000) + "w"
                  }
                  if (rdata[i].like_count >= 10000 && rdata[i].like_count < 11000) {
                    rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
                  } else if (rdata[i].like_count >= 11000 && rdata[i].like_count < 10000000) {
                    rdata[i].like_count = Math.floor(rdata[i].like_count / 10000) + "w"
                  }
                  // 大于10000w 展示1000w 取整数
                  if (rdata[i].read_count >= 10000000) {
                    rdata[i].read_count = parseInt(rdata[i].read_count / 10000) + "w"
                  }
                  if (rdata[i].comment_count >= 10000000) {
                    rdata[i].comment_count = parseInt(rdata[i].comment_count / 10000) + "w"
                  }
                  if (rdata[i].like_count >= 10000000) {
                    rdata[i].like_count = parseInt(rdata[i].like_count / 10000) + "w"
                  }
                }
                console.log(this.data.refreshContentIdArray + 123123123)

                if (rdata.length <= 0) {
                  //没有新信息
                  that.setData({
                    newRefeshdata: false,
                    newdataS: 2,
                  })
                  setTimeout(function() {
                    that.setData({
                      newRefeshdata: true,
                    })
                  }, 1000)
                } else {
                  //显示刷新N条信息
                  that.setData({
                    newRefeshdata: false,
                    newdatanum: rdata.length,
                    newdataS: 1,
                  })

                  setTimeout(function() {
                    that.setData({
                      newRefeshdata: true,
                    })
                  }, 1500)
                }
                //渲染新数据

                that.data.dataItem[that.data.curIndex].list = rdata.concat(that.data.dataItem[that.data.curIndex].list)
                that.setData({
                  dataItem: that.data.dataItem,
                  updataing: false,
                })


              } else if (res.data.code == 10020001) {
                that.getToken(that._onrefesh)
              } else {
                that.setData({
                  newRefeshdata: false,
                  newdataS: 3,
                })
                setTimeout(function() {
                  that.setData({
                    newRefeshdata: true,
                  })
                }, 1000)
              }
              //下拉动作埋点
              // this.data.getRecommondInfoStatus = 1;
              let now = new Date().getTime();
              addition.tagId = this.data.curNavId;
              addition.timestamp = now;
              addition.contentId = this.data.refreshContentIdArray.toString();
              addition.actionId = 'listRefesh';
              addition.actionType = "list",
                console.log(addition);
              var addistr = JSON.stringify(addition);
              dot.customEvent({
                event: 'pullDown',
                category: '动作信息打点',
                value: 'listRefesh',
                addition: addistr
              })
            },
            fail: res => {
              that.setData({
                newRefeshdata: false,
                newdataS: 3,
              })
              setTimeout(function() {
                that.setData({
                  newRefeshdata: true,
                })
              }, 1000)
              wx.showLoading({
                title: '请求失败',
              })

              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
            }

          })

        } else {
          //推荐刷新
          this.getRecommondInfo(2);
        }
        this.setData({
          refreshing: false,
        });
      }, 1000);
    }

  },
  //转发
  onShareAppMessage: function(options) {
    var that = this;
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      //var eData = options.target.dataset;
      return {
        title: '+头条', // 默认是小程序的名称(可以写slogan等)
        path: '/pages/index1/index1', // 默认是当前页面，必须是以‘/’开头的完整路径
        //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        success: function(res) {
          // 转发成功之后的回调
          if (res.errMsg == 'shareAppMessage:ok') {
            wx.showShareMenu({
              // 要求小程序返回分享目标信息
              withShareTicket: true
            });
          }
        },
        // 　　　　fail: function () {
        //   　　　　　　// 转发失败之后的回调
        //   　　　　　　if (res.errMsg == 'shareAppMessage:fail cancel') {
        //     　　　　　　　　// 用户取消转发
        //   　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
        //     　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
        //   　　　　　　}
        // 　　　　},
        // 　　　　complete: fucntion() {
        //   　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
        // 　　　　},
      }
    }
    if (options.from == 'menu') {
      let id = wx.getStorageSync('_user_id')
      console.log(id)
      //var eData = options.target.dataset;
      return {
        title: '+头条', // 默认是小程序的名称(可以写slogan等)
        path: '/pages/index1/index1' + '?user_id=' + id, // 默认是当前页面，必须是以‘/’开头的完整路径
        //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        success: function(res) {
          // 转发成功之后的回调
          if (res.errMsg == 'shareAppMessage:ok') {
            wx.showShareMenu({
              // 要求小程序返回分享目标信息
              withShareTicket: true
            });
          }
        }
      }
    }
  },
  //获取token
  getToken: function(funC, cnum,dnum) {
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
      var _user_id = res.data.data.userid
      var _isCheck = res.data.data.setting.isCheck
      var openShare = res.data.data.setting.openShare
      var openShare = res.data.data.setting.openShare
      wx.setStorageSync('token_time', token_time);
      wx.setStorageSync('_user_token', _user_token);
      wx.setStorageSync('_user_openid', _user_openid);
      wx.setStorageSync('_user_unionId', _user_unionId);
      wx.setStorageSync('_user_id', _user_id);
      wx.setStorageSync('_isCheck', _isCheck);
      wx.setStorageSync('openShare', openShare);
      return funC(cnum,dnum)
    })
  },
  //收集推送码
  formSubmit: function(e) {
    var that = this
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type; // 根据type执行点击事件
    console.log(formId)
    wx.request({ // 发送到服务器
      url: app.globalData.serverUrl + '/send/index/formid',
      method: 'GET',
      data: {
        formid: formId
      },
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: function(res) {
        if (res.data.code == 0) {
          console.log("update")
        } else if (res.data.code == 10020001) {
         
        }
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      }
    });
  },

  gotoArticle: function(e) {
    // console.log(e)
    console.log(e)
    var that = this
    that.formSubmit(e)
    wx.navigateTo({
      url: '../article/article?article_id=' + e.currentTarget.id + '&content_id=' + e.currentTarget.dataset.content_id,
    })
  }
}))