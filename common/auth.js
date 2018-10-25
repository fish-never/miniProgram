module.exports.auth = {
  setAuth: function (auth) {
    try {
      wx.setStorageSync('auth-version', auth.version)
      wx.setStorageSync('auth-token', auth.token)
    } catch (e) {
      console.log('set auth fail')
    }
  },
  getAuthVersion: function () {
    try {
      return wx.getStorageSync('auth-version')
    } catch (e) {
      return 1;
    }
  },
  getAuthToken: function getAuthToken() {
    try {
      return wx.getStorageSync('auth-token')
    } catch (e) {
      return '';
    }
  },
  removeAuth: function () {
    try {
      wx.removeStorageSync('auth-version');
      wx.removeStorageSync('auth-token');
    } catch (e) {
      // Do something when catch error
    }
  }
}