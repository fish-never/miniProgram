import dot from '../../utils/dot.js'

var app= getApp();
const sUrl = app.globalData.serverUrl;
var jslength = 0;
// pages/label/label.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sss: wx.getStorageSync('_user_token'),
    text:'立即开启',
    totalNum:3,
    trueNum:0,
    unchoose:true,
    arrow:[],
    showLabel:false,
    canClick:true,
    sendArr:[],
    choosearr:[],
    pageLabels:[
      { index:0,name: "自考", id: 1, num:0},
      { index: 1, name: "资格证", id: 2, num: 0},
      { index: 2, name: "MBA", id: 4, num: 0},
      { index: 3, name: "职场", id: 125, num: 0},
      { index: 4, name: "情感", id: 20, num: 0 },
      { index: 5, name: "读书", id: 123, num: 0 },
      { index: 6, name: "电影", id: 21, num: 0 },
      { index: 7, name: "拍照", id: 7, num: 0 },
      { index: 8, name: "旅行", id: 79, num: 0 }
    ],
  labels:[],
  tag:'',
  cur:0
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getLabel()
    wx.setNavigationBarColor({
      frontColor:"#000000",
      backgroundColor: '#fff8ec'
    })
    //判断token是否失效
    var user_token = wx.getStorageSync('_user_token')
    if (user_token && user_token != '') {
     return
    } else {
      // 登录
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
        wx.removeStorageSync('_user_token')
        var _user_token = res.data.data.token
        var _user_openid = res.data.data.openid
        var _user_unionId = res.data.data.unionid
        wx.setStorageSync('_user_token', _user_token);
        wx.setStorageSync('_user_openid', _user_openid);
        wx.setStorageSync('_user_unionId', _user_unionId);
        app.globalData.s_token = wx.getStorageSync('_user_token');
        app.globalData.s_openid = wx.getStorageSync(' _user_openid');
      })
    }
  },
  /**获取用户标签及权重 */
  getLabel: function () {
    var that = this;
    var sUrl = app.globalData.serverUrl;
    wx.request({
      url: sUrl + '/tag/index/tags',
      method: 'GET',
      header:{
        "token": wx.getStorageSync('_user_token')
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
              wx.redirectTo({
                url: '../../pages/index1/index1',
                //url: '../../pages/reply/reply',
              })
          }else{
            this.setData({
              showLabel:true
            });
            // wx.hideLoading();
          }
        }
      }
    })
  },
/**提交或更新标签 */
  postLabel:function(){
    var that=this;
    that.data.sendArr=[]
    console.log('111')
    if (!that.data.canClick){
    for (var i in that.data.pageLabels){
      if (that.data.pageLabels[i].selected){
        var id = that.data.pageLabels[i].id
        that.data.sendArr.push({[id]:'10'})
      };
    }
    this.setData({
      labels: JSON.stringify(that.data.sendArr),
      cur: 1,
    })

     wx.request({
       url:sUrl +'/tag/index/index',
       method: 'POST',
       header: {
         "token": wx.getStorageSync('_user_token')
       },
       data: {
         tag_ids: that.data.labels
       },
       success: res => {
         console.log(res)
         if(res.data.code==0){
           if(res.data.data.result=="success"){
             wx.redirectTo({
              url: '../index1/index1'
             })
           }
         }
       },
       fail:res=>{
         taht.setData({
           text: 'bbb'
         })
       }
     })
    }else{
      // this.setData({
      //   tag: '请先选择标签哦！'
      // })
    }
  },
  chooseLabel:function(e){
    var that = this; 
    var item = e.target.dataset.item;
    var id = e.target.id;   
    item.selected = !item.selected;
     // console.log(that.data.arrow.indexOf({ [id]: '10' }))
      if (item.selected){
        if (that.data.unchoose) {
        this.data.pageLabels[item.index] = item;
        this.setData({
          pageLabels: this.data.pageLabels
        });
        that.data.trueNum += 1
        this.setData({
          text: '我选好了',
          trueNum: that.data.trueNum,
          cur: 1,
          canClick: false
        })
        that.data.arrow.push(id)
        if (that.data.arrow.length == 3) {
          
          this.setData({
            unchoose:false
          })
        }
        }
      }else{
        this.data.pageLabels[item.index] = item;
        this.setData({
          pageLabels: this.data.pageLabels
        });
        var index = that.data.arrow.indexOf(id);
        that.data.arrow.splice(index, 1);
        that.data.trueNum -= 1
        this.setData({
          
          trueNum: that.data.trueNum,
          unchoose: true
        })
        if (that.data.arrow.length == 0) {

          this.setData({
            text: '请选择',
            cur: 0,
            canClick: true
          })
        }
      }
  },
  //跳过标签页
  goIndex:function(){
    wx.redirectTo({
      url: '../index1/index1'
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
  
  }
})