const app = getApp();
Page({
  data: {
    hasShowAllText:false,
    onRandom:false,
    titleImg:'../images/title_text0.png',
    textIdx:0,
    timer:null,
    test:0,
  },
  onLoad: function (options) {
    let self = this
    wx.setNavigationBarColor({
      frontColor:"#ffffff",
      backgroundColor: '#AD3E40'
    })
    // 判断本地缓存是或否有抽签结果
    wx.getStorage({
      key: 'lotteryResult',
      success: function(res) {
        if(res.data.date == self.getCurrentDateStr()){
          console.log('已抽签，显示结果')
          self.toRestultPage(res.data.resultIdx)
        }
      },
      fail(e){
        // 取不到值
        console.log('还没抽过签')
      }
    })
  },
  toRestultPage(result){
    wx.redirectTo({
      url: '/pages/activity/lottery/resultPage/index?result='+result
    })
  },
  randomCard(){
    let self = this
    const innerAudioContext = wx.createInnerAudioContext()
    // 设定音频路径 播放音频
    innerAudioContext.src = '/audio/xiu.mp3';
    innerAudioContext.loop = true;
    innerAudioContext.play();
    if(self.data.timer){
      clearInterval(self.data.timer)
    }
    let intervals = 200
    let timer = setInterval(function () {
      if(self.data.textIdx<6){
        self.setData({
          textIdx:self.data.textIdx+1
        })
      }else{
        self.setData({
          textIdx:0
        })
      }
      if(intervals>50){
        intervals-25
      }
    },intervals)
    self.setData({
      timer:timer,
      onRandom:true,
    })
    setTimeout(()=>{
      if(self.data.timer){
        clearInterval(self.data.timer)
      }
      let resultIdx = (Math.random()*6).toFixed(0)*1
      // 播放结果提示音
      innerAudioContext.src = '/audio/ending.mp3';
      innerAudioContext.loop = false;
      innerAudioContext.play();
      self.setData({
        hasShowAllText:true,
        textUrl:resultIdx,
        onRandom:false,
      })
      // 抽签成功 设置本地缓存抽签结果数字 跳转到抽签结果页
      wx.setStorage({
        key:"lotteryResult",
        data:{
          resultIdx:resultIdx,
          date:self.getCurrentDateStr()
        },
        fail(){
          console.log('抽签结果缓存失败')
        },
      })
      self.toRestultPage(resultIdx)
    },3000)
  },
  getCurrentDateStr(){
    // 计算当前年月日
    let date = new Date()
    let year = date.getFullYear() +''
    let month = date.getMonth()+1 +''
    let day = date.getDate()+''
    return year+month+day
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
          console.log("update")
        } else if (res.data.code == 10020001) {
          that.getToken(that.getInfo)
          console.log("TokenErr")
        }
      },
      fail: function (res) {
        console.log(res)
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