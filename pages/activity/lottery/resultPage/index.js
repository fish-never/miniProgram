const app = getApp();
var wxApi = require('../../../../utils/wxApi');
Page({
  data: {
    textUrl:'../images/card_xue@2x.png',
    textUrlArr:[
      '../images/card_xue@2x.png',
      '../images/card_xi@2x.png',
      '../images/card_shi@2x.png',
      '../images/card_yi@2x.png',
      '../images/card_zhong@2x.png',
      '../images/card_xin@2x.png',
      '../images/card_yang@2x.png',
    ],
    titleImg:'',
    animationData:{},
    showTheModal:true,
    resultModalClass:'',
    resultNum:0,
    resultText:[
      '所有的不开心和坏运气都给我退散，你命里从来都不缺好福气和好时光',
      '来呀，造作呀，反正有大把时光，来呀，折腾吧，反正有无穷精力，趣玩吧',
      '总会找到一些让你欢喜让你忧的小寄托，跟着自己的节奏动次打次的忙起来吧',
      '铁打的学校流水的期末考，铁打的班主任流水的家长会，考神会保佑你的',
      '去年的五百次期待，换来了今年的无数次“意外”，这美妙的意外究竟什么时候到来',
      '很多时候别人对你好，并不是因为别人喜欢你，而是因为他们喜欢对人好',
      '在最美的年纪，炼出最好的身材，收拾打扮下，去吸引大街上所有异性的目光',
    ],
    matchUserInfo:{
      avatar:'',
      nickname:'',
      wx_account:'',
      open_id:'',
    },
    canvasHidden:true,
    avatarUrl:'',
  },
  onLoad: function (options) {
    let self = this

    // 自测开关

    self.cardMove()
    setTimeout(function () {
      self.setData({
        showTheModal:false,
        resultModalClass:'z-index-under',
      })
    },2500)
    wx.getStorage({
      key: 'lotteryResult',
      success: function(res) {
        if(res.data.date != self.getCurrentDateStr()){
          wx.redirectTo({
            url: '/pages/activity/lottery/index'
          })
        }
      },
      fail(){
        // 获取抽签信息失败 跳转到抽签页面
        wx.redirectTo({
          url: '/pages/activity/lottery/index'
        })
      },
    })
    wx.setNavigationBarColor({
      frontColor:"#ffffff",
      backgroundColor: '#AD3E40'
    })
    self.setData({
      textUrl:self.data.textUrlArr[options.result],
      resultNum:options.result,
      titleImg:'https://img-toutiao.ministudy.com/2018_08_13/title_text'+options.result+'.png',   // https://img-toutiao.ministudy.com/2018_08_13/title_text0.png

    })
    // 判断无缓存匹配 请求接口
    wx.getStorage({
      key: 'matchUserInfo',
      success: function(res) {
        if(res.data.date == self.getCurrentDateStr()){
          self.setData({
            matchUserInfo:res.data
          })
        }else{
          self.getMatchUser()
        }
      },
      fail(e){
        // 取不到值
        self.getMatchUser()
      }
    })
    // 获取用户头像 保存canvas 图会用到
    wx.getUserInfo({
      success:function (res) {
        let userInfo = JSON.parse(res.rawData)
        self.setData({
          avatarUrl:userInfo.avatarUrl
        })
      }
    })
  },
  cardMove(){
    console.log(1111);
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 1500
    })
    this.animation.scale(0.20,0.20).top('582rpx').left('415rpx').step()
    this.setData({
      animationData:this.animation.export()
    })
  },
  getCurrentDateStr(){
    // 计算当前年月日
    let date = new Date()
    let year = date.getFullYear() +''
    let month = date.getMonth()+1 +''
    let day = date.getDate()+''
    return year+month+day
  },
  getMatchUser(){
    let self = this;
    // 获取匹配人 ump/draw/index
    wx.getStorage({
      key: '_user_token',
      success: function(res) {
        wx.request({
          url: app.globalData.serverUrl + '/ump/draw/index',
          method: 'GET',
          header: {
            'content-type': 'application/json', // 默认值
            "token": res.data // 默认值
          },
          success: function(res) {
            if(res.data.code == 0){
              self.setData({
                matchUserInfo:res.data.data
              })
              res.data.data.date = self.getCurrentDateStr()
              // 本地缓存匹配结果 1 天内
              wx.setStorage({
                key:"matchUserInfo",
                data:res.data.data,
                fail(){
                  console.log('抽签结果缓存失败')
                },
              })
            }else if(res.data.code == 10020001){
              self.reFreshToken(function () {
                self.getMatchUser()
              })
              console.log(res.data)
            }
          }
        })
      },
      fail(){
        wx.showToast({
          title: '获取本地token失败',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },
  teaseResult(){
    let self = this
    wx.setClipboardData({
      data: self.data.matchUserInfo.wx_account || '',
      success: function(res) {
        wx.showModal({
          title: '解锁有缘人',
          content: '微信号已复制，快去添加TA为好友吧！',
          showCancel:false,
          success: function(res) {

          }
        })
      }
    })
    self.addBind()
  },
  addBind(){
    let self = this
    // 请求接口
    wx.getStorage({
      key: '_user_token',
      success: function(res) {
        wx.request({
          url: app.globalData.serverUrl + '/ump/draw/add-user-bind',
          method: 'GET',
          data:{
            bind_open_id:self.data.matchUserInfo.open_id
          },
          header: {
            'content-type': 'application/json', // 默认值
            "token": res.data // 默认值
          },
          success: function(res) {
            if(res.data.code == 10020001){
              self.reFreshToken(()=>{
                self.addBind()
              })
            }
          }
        })
      },
      fail(){

      },
    })

  },
  onShareAppMessage(res){
    let self = this
    let shareTitle = '帮我攒幸运值，送你一支幸运签。'
    try {
      var nickName = wx.getStorageSync('nickName')
      if (nickName) {
        // Do something with return value
        shareTitle = nickName +'@我，'+shareTitle
      }
    } catch (e) {
      // Do something when catch error
    }
    return {
      title:shareTitle,
      path:'/pages/index1/index1?scene=0,0,0,2',
      imageUrl:'https://img-toutiao.ministudy.com/2018_08_10/'+ self.data.resultNum +'.jpg'
    }

  },
  saveResult(){
    let self = this
    wx.showLoading({ title: '正在生成图片' })
    let ctx = wx.createCanvasContext('share');
    self.setData({
      canvasHidden: false
    })
    wx.getImageInfo({
      src: 'https://img-toutiao.ministudy.com/2018_08_13/bg_share.jpg',
      success: function (res) {
        ctx.drawImage(res.path,0,0,750,1140)
        ctx.drawImage('../images/'+self.data.resultNum+'.png',316,282,120,448)
        ctx.drawImage('../images/bg-logo.png',122,860,160,160)
        console.log(self.data.avatarUrl)
        if(self.data.avatarUrl){
          ctx.drawImage(self.data.avatarUrl,168,906,68,68)
        }
        ctx.drawImage('../images/qr-code-cover.png',122,860,160,160)

        ctx.draw(false,()=>{
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 1140,
            destWidth: 750,
            destHeight: 1140,
            quality:1,
            canvasId: 'share',
            success: function(res) {
              self.setData({
                canvasHidden: true,
              })
              wx.saveImageToPhotosAlbum({
                filePath:res.tempFilePath,
                success(resSave) {
                  wx.showModal({
                    title: '分享到朋友圈',
                    content: '幸运签已保存到相册，快去分享吧！',
                    showCancel:false,
                    success: function(res) {

                    }
                  })
                },
                fail(){
                  wx.showToast({
                    title: '保存失败,请确认已开启存储授权。',
                    icon: 'none',
                    duration: 2000
                  })
                },
              })
            },
            complete(){
              wx.hideLoading()
            },
          })
        });
      },
      fail(){
        wx.showToast({
          title: '保存图片失败，请检查您的网络连接后重试。',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  // 获取token
  reFreshToken(callback){
    wx.login({
      success(res){
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.serverUrl + '/login/index/index',
            method: 'GET',
            data:{
              code: res.code
            },
            success: function(res) {
              var _user_token = res.data.data.token
              var _user_openid = res.data.data.openid
              var _user_unionId = res.data.data.unionid
              var token_time = Date.parse(new Date()) + 23 * 60 * 60 * 60
              wx.setStorageSync('_user_token', _user_token);
              wx.setStorageSync('token_time', token_time);
              wx.setStorageSync('_user_openid', _user_openid);
              wx.setStorageSync('_user_unionId', _user_unionId);
              callback && callback()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(err){
        console.log('登录失败！2' + err)
      },
    });
  },
  //收集推送码
  formSubmit: function (e) {
    var that = this
    let formId = e.detail.formId;
    let type = e.detail.target.dataset.type; // 根据type执行点击事件
    console.log(formId)
    wx.request({  // 发送到服务器
      url: app.globalData.serverUrl + '/send/index/formid',
      method: 'GET',
      data: {
        formid: formId
      },
      header: {
        "token": wx.getStorageSync('_user_token')
      },
      success: function (res) {
        if (res.data.code == 0) {
        } else if (res.data.code == 10020001) {
          try{
            that.getToken(that.getInfo)
          }catch (e) {
            
          }
          console.log("TokenErr")
        }
        // console.log(res)
      },
      fail: function (res) {
        // console.log(res)
      }
    });
  },
  toPage: function (e) {
    let self = this
    self.formSubmit(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面信息的埋点配置
   */
  __dot_page: function () {
    return {
      title: 'title',
    }
  },
})