
import dot from "../../../../utils/dot";

const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    src: '../images/face_nor@2x.jpg',   // 默认头像：'../images/face_nor@2x.jpg'   错误头像反馈：'../images/default_error@2x.png'
    isShowImg: false,
    status: 1,                          // 1：照相  2：设置  3：等待
    tipText:'AI识别人脸测测你的考过概率',
    showResult:false,  // default false      //  true
    percent:0,
    radarData:[10,80,70,60,30],
    radarDataCalc:[10,80,70,60,30],
    aiText:['正在检测你的照片','正在进行关键点的定位','考神忍不住多看了你两眼...'],
    radarDataText:['颜值','个性','态度','情绪','能力'],
    level:['学霸考生','热血考生','斜杠考生','萌新考生','佛系考生','犹豫考生','消极考生','次元考生'],
    levelSimple:'学霸',
    levelNum:0,
    levelText:[
      {
        ch:'“就算老师讲的毛线，我都能织成毛衣”',
        en:'我要稳稳的分数，能抵挡考试的残酷，在成堆学霸里，能有个归宿。',
      },
      {
        ch:'“把吃东西的时间都拿来学习、刷题”',
        en:'在做完足够的习题之前，我们仍然要耐得住寂寞、禁得起折磨。',
      },
      {
        ch:'“至少我尝试了许多不同的可能”',
        en:'今日你擅长的爱好，也许就是明日安身立命的本钱。',
      },
      {
        ch:'“没有未来的未来，不是我想要的未来”',
        en:'努力学习让我感觉萌萌哒，不负韶华不负心，不负青春不负梦。',
      },
      {
        ch:'“上课老师的声音真好听，可以可以”',
        en:'考不过也不觉得难过，该过的总会的过的，没过的下次再过。',
      },
      {
        ch:'“顾虑太多难起步，背负太多走弯路”',
        en:'人生，是一个拼搏的过程，只有成长，没有输赢。把犹豫一脚踢开，去拼吧！',
      },
      {
        ch:'“看准考证上的地址远不远，不远就去”',
        en:'理想总被现实击败，仍要勇敢迈出下一步！加油，青年！',
      },
      {
        ch:'“我更希望变成你的猫，而不是路人”',
        en:'一个做梦者，它的哲学就是睡觉和让别人睡觉，天空在它的眼里。',
      },
    ],
    levelTextDetail:[
      '不可大意，脚踏实地，沉着应对每一场考试。',
      '你的内心和外表都坚硬，不考高分誓不罢休！',
      '你擅长多线程任务，也得先把手上任务胜任好。',
      '始于颜值终于才华，努力学习遇见更好的自己。',
      '你所学习的东西，终有一天会回馈到你身上。',
      '曾经错过了昨天，请不要再错过眼前，立即行动！',
      '坚持学习，不要害怕付出，好运即将降临！',
      '自考路上有你的陪伴，便是最好的时光。',
    ],
    levelTextDetailNum:[
      '你超越了90万自考学员',
      '你超越了80万自考学员',
      '你超越了70万自考学员',
      '你超越了60万自考学员',
      '你超越了50万自考学员',
      '你超越了40万自考学员',
      '你超越了30万自考学员',
      '你超越了过去的自己',
    ],
    levelTextDetailNum2:[
      '考过概率超越了90万自考学员',
      '考过概率超越了80万自考学员',
      '考过概率超越了70万自考学员',
      '考过概率超越了60万自考学员',
      '考过概率超越了50万自考学员',
      '考过概率超越了40万自考学员',
      '考过概率超越了30万自考学员',
      '考过概率已超越了过去的自己',
    ],
    canvasHidden:true,
    showDetail:false,
    screenWidth:375,
    saveShareImg:'',
    modelflag: 0,
    has_phone: false,
    savetext: '正在保存...',
    lengimgflag:0,
    close:0,
  },
  onLoad: function (options) {
    let self = this
    self.ctx = wx.createCameraContext()
    wx.setNavigationBarColor({
      frontColor:"#ffffff",
      backgroundColor: '#03011C'
    })

    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        self.setData({
          screenWidth: res.screenWidth
        })
      }
    })

    // 测试 直接进入结果页
    // self.drawRadar()
/*    setTimeout(function () {
      self.share()
    },800)*/
/*    self.setData({
      showDetail:true,
    })*/
/*    self.setData({
      has_phone: true,
    })*/

  },
  afterSetting(){
    let self = this
    // self.checkSetting()
    wx.redirectTo({
      url: '/pages/activity/faceRecognition/mainPage/index'
    })
  },
  checkSetting(){
    let self = this
    // 通过 wx.getSetting 先查用户是否授权了 "scope.camera"
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        if (!res.authSetting['scope.camera']) {
          console.log('未授权')
          self.setData({
            status: 2,
            isShowImg: true,
            src: '../images/face_nor@2x.jpg',
            tipText:'点击按钮进入设置页，授权后立即拍照'
          })

        } else {
          console.log('已授权')
          // 用户已授权
          self.setData({
            src: '../images/face_nor@2x.jpg',
            status: 1,
            isShowImg: false,
            tipText:'AI识别人脸测测你的考过概率',
          })
          self.ctx = wx.createCameraContext()
        }
      },
      fail(){
        self.setData({
          status: 2,
          isShowImg: true,
          src: '../images/face_nor@2x.jpg',
          tipText:'点击按钮进入设置页，授权后立即拍照'
        })
        console.log('获取授权信息失败  转到授权界面')
      },
    })

  },
  takePhoto() {
    let self = this
    self.setData({
      src: '../images/face_nor@2x.jpg',
      status: 1,
      isShowImg: false,
      tipText:'AI识别人脸测测你的考过概率',
    })
    this.ctx.takePhoto({
      quality: 'normal',
      success: (res) => {
        self.requestAi(res.tempImagePath)
      },
    })
  },
  cameraError(err){
    let self = this;
    console.log(err);
    self.checkSetting()
  },
  requestAi(filePath){
    let self = this
    wx.getFileInfo({
      filePath:filePath,
      success(resFile) {
        console.log(resFile)
        if(resFile.size<(1024*1024)){    // 图片不超过1m
          let idx = 1
          self.setData({
            tipText: self.data.aiText[0],
          })
          let timer = setInterval(function () {
            self.setData({
              tipText: self.data.aiText[idx],
            })
            if(idx+1<3){
              idx = idx+1
            }else{
              idx = 0
            }
          },1500)

          self.setData({
            src: filePath,
            isShowImg:true,
            status:3,
          })
          wx.uploadFile({
            url:serverUrl + '/ump/fortunetelling/index',
            header: {
              'content-type': 'multipart/form-data',
              "token": wx.getStorageSync('_user_token')
            },
            filePath: filePath,
            name: 'img',
            success: function(res){
              setTimeout(()=>{
// 上传图片返回 data 是字符串
                let data = JSON.parse(res.data).data
                // "beauty":70,"personality":89,"attitude":65,"emotion":68,"ability":29
                let draw_data = data.draw_data || {}
                self.setData({
                  percent:data.probability,
                  radarDataCalc: [
                    draw_data.beauty,
                    ((draw_data.personality*1*0.0214-1.154)*draw_data.personality>0?((draw_data.personality*1*0.0214-1.154)*draw_data.personality).toFixed(0):10),
                    ((draw_data.attitude*1*0.0214-1.154)*draw_data.attitude>0?((draw_data.attitude*1*0.0214-1.154)*draw_data.attitude).toFixed(0):10),
                    ((draw_data.emotion*1*0.0214-1.154)*draw_data.emotion>0?((draw_data.emotion*1*0.0214-1.154)*draw_data.emotion).toFixed(0):10),
                    ((draw_data.ability*1*0.0214-1.154)*draw_data.ability>0?((draw_data.ability*1*0.0214-1.154)*draw_data.ability).toFixed(0):10),
                  ],
                  radarData: [
                    draw_data.beauty,
                    draw_data.personality,
                    draw_data.attitude,
                    draw_data.emotion,
                    draw_data.ability,
                  ],
                })
                // 绘制雷达图 显示结果页
                self.drawRadar()
                self.setData({
                  showResult: true,
                  showDetail:true,
                })
                // 判断是否已经获取手机号
                self.setData({
                  has_phone: data.has_phone|| false
                })
                // 计算 levelNum
                self.setData({
                  levelNum: self.data.level.indexOf(data.level),
                })
                self.setData({
                  levelSimple: data.level.replace('考生',''),
                })
                console.log(self.data.levelSimple)
                // 清除定时器
                clearInterval(timer)
              },3500)
            },
            fail(){
              wx.showModal({
                content: '图片上传失败，请重新操作。',
                showCancel:false
              })
              self.setData({
                src: '../images/face_nor@2x.jpg',
                status: 1,
                isShowImg: true,
                tipText:'AI识别人脸测测你的考过概率',
              })

            },
          })
        }else{
          wx.showModal({
            content: '拍摄或选择的图片超过1M，请重新操作。',
            showCancel:false
          })
        }
      },
      fail(){
        wx.showModal({
          content: '获取图片信息失败',
          showCancel:false
        })
      },
    })
  },
/*  getCameraAccess() {
    wx.openSetting({
      success: (res) => {
        /!*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         *!/
        res.authSetting = {
          "scope.userInfo": true,
          "scope.camera": true
        }
      }
    })
  },*/
  selectImage(){
    let self = this
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['album'],
      success(res){
        self.requestAi(res.tempFilePaths[0])
      },
      fail(){
        console.log('选择失败')
      },
    })
  },
  canSelectImage(){
    (this.data.isShowImg && this.data.status==3)?'disable':''
  },

  // 结果页一些方法
  drawRadar(){
    // 雷达图
    let self = this
    let chart = new wxCharts({
      canvasId: 'radarCanvas',
      type: 'radar',
      categories: self.data.radarDataText,
      dataPointShape:false,
      series: [{
        name: ' ',
        data: self.data.radarData,
        color:'#913FA3'
      }],
      width: 250,
      height: 240,
      extra: {
        radar: {
          max: 100,
          labelColor :'#50E3C2',
          gridColor:'#50E3C2',
        }
      },
      title:{
        color :'#50E3C2',
      }
    });
  },
  getPhoneNumber(e){
    let self = this
    if (e.detail.errMsg.indexOf('fail') == -1) {  // 成功获取手机号
      wx.request({
        url: app.globalData.serverUrl + '/user/update/mobile',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "token": wx.getStorageSync('_user_token') // 默认值
        },
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          console.log('手机号绑定成功')
        },
        fail: function () {
          console.log('手机号绑定失败')
        }
      })
      self.setData({
        showDetail:true,
      })
    }
  },
  hasGetPhoneNumber(){
    let self = this
    self.setData({
      showDetail:true,
    })
  },

  modelshow: function () {
    this.setData({ modelflag: 1 })
  },
  // 遮罩层隐藏
  modelceal: function () {
    this.setData({ modelflag: 0 })
  },
  //转发
  onShareAppMessage: function (res) {
    this.modelceal()
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '测测考运|10月自考你考过的概率是多少？来测！',
      path: '/pages/index1/index1?promote=promote' + '&user_id=' + app.globalData.s_userid,
    }
    // 转发成功之后的回调
    if (res.errMsg == 'shareAppMessage:ok') {
      wx.showShareMenu({
        // 要求小程序返回分享目标信息
        withShareTicket: true
      });
    }
  },
  lengimgceal: function () {
    this.setData({ lengimgflag: 0 })
  },
  // 遮罩层隐藏  
  modelceal: function () {
    this.setData({ modelflag: 0 })
  },
  shareBox(){
    let self = this
    self.setData({
      modelflag: 1
    })
  },
  share(){
    let self = this
    let that = this
    let ctx = wx.createCanvasContext('share');
    let unit = self.data.screenWidth / 375
    that.modelceal()
    wx.showLoading({ title: '正在生成图片' })
    self.setData({
      modelflag:0,
      canvasHidden: false,
    })

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 240,
      height: 200,
      destWidth: 360,
      destHeight: 300,
      quality:1,
      canvasId: 'radarCanvas',
      success: function(res) {
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '雷达图绘制中。请稍后重试。',
            showCancel: false
          })
        }else{
          // 暂存雷达图  开始绘制图片
          wx.getImageInfo({
            src: 'https://img-toutiao.ministudy.com/2018_08_13/share-simple-bg.jpg',
            success: function (res) {
              ctx.drawImage(res.path,0,0,740,1120)
              ctx.drawImage(('../images/tag/'+(self.data.levelNum+1)+'.png'),246,158,250,58)
              ctx.drawImage(res.tempFilePath,188,246,360,300)

              ctx.setFontSize(28)
              ctx.setFillStyle("#50E3C2")
              ctx.fillText(self.data.levelText[self.data.levelNum].ch, 120, 750,510)
              // ctx.fillText(self.data.levelText[self.data.levelNum].en, 75, 378,249)

              ctx.draw(false,()=>{
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: 740,
                  height: 1120,
                  destWidth: 740,
                  destHeight: 1120,
                  quality:1,
                  canvasId: 'share',
                  success: function(res) {
                    if (!res.tempFilePath) {
                      wx.showModal({
                        title: '提示',
                        content: '图片绘制中，请稍后重试',
                        showCancel: false
                      })
                    }else{
                      self.setData({
                        canvasHidden: true,
                        saveShareImg: res.tempFilePath,
                      })
                      wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,//临时路径
                        success: function (res) { // 用户点击保存图片
                          //that.setData({ generating: false })

                          if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                            wx.hideLoading()
                            wx.showModal({
                              title: '分享到微信',
                              content: '图片已保存到相册，快去分享吧！',
                              showCancel: false,
                              success: function (res) {
                                if (res.confirm) {
                                  console.log('用户点击确定')
                                }
                              }
                            })
                          } else {
                            //that.lengimgceal();
                          }
                        },
                        // 图片保存失败
                        fail: function (res) {// 用户点击取消
                          if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") { // 第二次弹窗的取消：取消保存
                            //that.lengimgceal();
                            //that.setData({ generating: false })
                            // that.setData({ savetext: "保存失败，请重试" });
                            wx.hideLoading();// 关闭loading
                            //that.setData({ generateModel: false });
                          } else { // 第一次弹窗就取消：权限取消
                            //that.setData({ generating: false })
                            //  that.setData({ savetext: "保存失败，请重试" });
                            wx.hideLoading();// 关闭loading
                            //that.setData({ generateModel: false });
                            //that.lengimgceal();
                            wx.showModal({ // 设置没打开
                              title: '保存失败',
                              content: '图片保存失败，请检查图片保存设置是否打开',
                              confirmText: '前往设置',
                              showCancel: true,
                              success: function (res) {
                                if (res.confirm) {
                                  // 打开设置页面
                                  wx.openSetting();
                                } else {
                                }
                              }
                            })
                          }
                        }
                      })

                    }
                  }
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

        }

      }
    })

  },




  shareDetail(){
    let self = this
    let that = this
    wx.showLoading({ title: '正在生成图片' })
    let ctx = wx.createCanvasContext('share');
    let unit = self.data.screenWidth / 375
    that.modelceal()
    self.setData({
      canvasHidden: false,
    })
    wx.getImageInfo({
      src: 'https://img-toutiao.ministudy.com/2018_08_13/share-detail-bg.jpg',
      success: function (res) {
        // 暂存雷达图  开始绘制图片
        ctx.drawImage(res.path,0,0,740,1120)
        ctx.drawImage(self.data.src,332,168,96,96)
        ctx.drawImage('../images/avatar-cover.png',326,158,126,110)
        ctx.setFillStyle("#50E3C2")
        ctx.setFontSize(28)
        ctx.fillText(self.data.levelText[self.data.levelNum].ch, 120, 760,510)
        ctx.fillText(self.data.levelTextDetailNum2[self.data.levelNum], 190, 482,510)
        ctx.setFontSize(20)
        ctx.fillText(self.data.level[self.data.levelNum].replace('考生',''),400,258)
        ctx.setFontSize(80)
        ctx.fillText(self.data.percent+'%', 300, 400)
        // ctx.fillText(self.data.levelText[self.data.levelNum].en, 75, 378,249)
        ctx.draw(false,()=>{
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 740,
            height: 1120,
            destWidth: 740,
            destHeight: 1120,
            quality:1,
            canvasId: 'share',
            success: function(res) {
              if (!res.tempFilePath) {
                wx.showModal({
                  title: '提示',
                  content: '图片绘制中，请稍后重试',
                  showCancel: false
                })
              }else{
                self.setData({
                  canvasHidden: true,
                  saveShareImg: res.tempFilePath,
                })
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,//临时路径
                  success: function (res) { // 用户点击保存图片
                    //that.setData({ generating: false })

                    if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                      wx.hideLoading()
                      wx.showModal({
                        title: '分享到微信',
                        content: '图片已保存到相册，快去分享吧！',
                        showCancel:false,
                        success: function (res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                          }
                        }
                      })
                    } else {
                      //that.lengimgceal();
                    }
                  },
                  // 图片保存失败
                  fail: function (res) {// 用户点击取消
                    if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") { // 第二次弹窗的取消：取消保存
                      //that.lengimgceal();
                      //that.setData({ generating: false })
                      // that.setData({ savetext: "保存失败，请重试" });
                      wx.hideLoading();// 关闭loading
                      //that.setData({ generateModel: false });
                    } else { // 第一次弹窗就取消：权限取消
                      //that.setData({ generating: false })
                      //  that.setData({ savetext: "保存失败，请重试" });
                      wx.hideLoading();// 关闭loading
                      //that.setData({ generateModel: false });
                      //that.lengimgceal();
                      wx.showModal({ // 设置没打开
                        title: '保存失败',
                        content: '图片保存失败，请检查图片保存设置是否打开',
                        confirmText: '前往设置',
                        showCancel: true,
                        success: function (res) {
                          if (res.confirm) {
                            // 打开设置页面
                            wx.openSetting();
                          } else {
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
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
   * 页面信息的埋点配置
   */
  __dot_page: function () {
    return {
      title: 'title',
    }
  },
})