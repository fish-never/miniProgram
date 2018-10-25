const app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor:"#ffffff",
      backgroundColor: '#03011C'
    })
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
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  toPage: function (e) {
    wx.navigateTo({
      url: '../mainPage/index',
    })
    var that = this
    that.formSubmit(e)
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