
var app = getApp();
let baseApiUrl = app.globalData.serverUrl
let defaultHeaders = {
    'Content-Type': 'application/json'
}
function request(url, data, method, header={}) {
  return new Promise(function (reslove, reject) {
    wx.request({
      url: baseApiUrl + url,
      data: data,
      method: method, 
      header: Object.assign(defaultHeaders, header,{
        token: wx.getStorageSync('_user_token')
      }),
      success: function (res) {
        if (res.statusCode != 200) {
          reject(res);
          return
        } else if (res.data.code == 10020001){
          console.log('invalida token.')
          refreshToken().then(resp=>{
            console.log('request aggin...')
            request(url, data, method, header).then((resp) => {
              reslove(resp)
            })
          })
          return
        }
        reslove(res);
      },
      fail: function (res) {
        reject(res);
      },
      complete: function (res) {
      }
    })
  })
}

function refreshToken(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        console.log(res)
        request('/login/index/index', {
          code: res.code,
          fromId: app.globalData.fromId,
          version: app.globalData.version_id
        }).then(res => {
          var _user_token = res.data.data.token
          var _user_openid = res.data.data.openid
          var _user_unionId = res.data.data.unionid
          var _user_id = res.data.data.userid
          var token_time = Date.parse(new Date()) + 23 * 60 * 60 * 60
          var _isCheck = res.data.data.setting.isCheck
          var openShare = res.data.data.setting.openShare
          wx.setStorageSync('token_time', token_time);
          wx.setStorageSync('_user_token', _user_token);
          wx.setStorageSync('_user_openid', _user_openid);
          wx.setStorageSync('_user_unionId', _user_unionId);
          wx.setStorageSync('_user_id', _user_id);
          wx.setStorageSync('_isCheck', _isCheck);
          wx.setStorageSync('openShare', openShare);
          app.globalData.s_token = wx.getStorageSync('_user_token');
          app.globalData.s_openid = wx.getStorageSync('_user_openid');
          app.globalData.s_userid = wx.getStorageSync('_user_id');
          app.globalData._isCheck = wx.getStorageSync('_isCheck');
          app.globalData.openShare = wx.getStorageSync('openShare');
          defaultHeaders.token = res.data.data.token
          resolve(res.data)
        })
      },
      fail(res) {
        reject()
      }
    })
  })
}

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "H+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "S+": this.getMilliseconds()
  };

  //因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：



  if (/(y+)/.test(fmt)) {
    //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。

    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {

      //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
}

module.exports = {
  refreshToken: refreshToken,
  request: request
}
