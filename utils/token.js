let Promise = require('../common/es6-promise.js');
var wxApi = require('wxApi');
var wxRequest = require('wxRequest')
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
function getToken(urlindex) {
  var wxLogin = wxApi.wxLogin()
  wxLogin().then(res => {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    var code = res.code;
    var url = urlindex
    var params = {
      code: res.code
    }
    wxRequest.getRequest(url, params)
  })
}

module.exports = {
  getToken: getToken
}


