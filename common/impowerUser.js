import fetch from './fetch'
import config from '../config/config'
import dot from '../dotLib/dot'
import auth from './auth'
import store from '../stores/todoStore'
const app = getApp();
var mta = require("../utils/mta_analysis.js");// 腾讯mta接入

let impowerUser = {
  login: function () {
    auth.remove()
    wx.login({
      success: res => {
        let data = {
          code: res.code
        }
        if (app.globalData.track.counselor  != '') {
          data.counselor = app.globalData.track.counselor
        }
        fetch.post({
          url: config.api.user.login0,
          data: data,
          success: res => {
            if (res.data.success) {
              auth.set(res.data.response.authToken)
            }
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '网络错误，请稍后再试',
              showCancel: false
            })
          }
        })
      }
    })
  },
  // 授权个人信息
  postUserInfo: function (data = {
    signature: '',
    iv: '',
    encryptedData: ''
  }) {
    return this.setUserInfo('login', data, response => {
      store.changeMe(response)
    })
  },
  // 授权手机号
  postPhone: function (data = {
    iv: '', encryptedData: '', mode: '', scene: ''
  }) {
    return this.setUserInfo('getPhoneNumber', data, response => {
      let phone = response.phone;
      if (typeof phone !== 'undefined' && phone != '') {
        // 更新用户信息
        fetch.get({
          url: config.api.user.me,
          success: result => {
            if (result.data.response) {
              store.changeMe(result.data.response)
            }
          }
        });
        // 接入总部打点 提供新手机号
        dot.newUser({
          phone: phone,
          consultantAccount: app.globalData.track.counselor,
          source: 1
        });
        // mba
        mta.Data.userInfo = {
          'open_id': app.globalData.track.openid,
          'phone': response.phone
        };
      }
    })
  },
  // 更改用户信息
  setUserInfo: function (api, data, callback) {
    return new Promise((resolve, reject) => {
      fetch.post({
        url: config.api.user[api],
        data: data,
        success: res => {
          if (!res.data.success) reject(false);

          if (typeof res.data.response.code !== 'undefined' && res.data.response.code == 0) {
            wx.showToast({
              title: '服务器出错了',
              image: "../../image/requestFailed.png",
              complete: () => {
                impowerUser.login();
              }
            });
            reject(false);
          } else {
            if(!res.data.response) reject(false);
            if (!app.globalData.track.counselor && res.data.response.counselor) {
              app.globalData.track.counselor = res.data.response.counselor
            }
            callback.call(this, res.data.response);
            resolve(res.data.response);
          }
        },
        fail: err => {
          reject(err)
        }
      });
    })

  }
}
module.exports = impowerUser;
