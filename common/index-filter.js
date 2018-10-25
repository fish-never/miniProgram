function indexFilter(pageObj) {
  if (pageObj.onShow) {
    let _onShow = pageObj.onShow;
    pageObj.onShow = function () {
      var that = this;
      var sUrl = this.globalData.serverUrl;
      var stoken = this.globalData.s_token
      wx.request({
        url: sUrl + '/tag/index/tags',
        method: 'GET',
        header: {
          "token": stoken
        },
        success: res => {
          if (res.data.code == 0) {
            if (res.data.data.length > 0) {
              wx.redirectTo({
                //url: '../../pages/index1/index1'
              })
            }else{
              let currentInstance = getPageInstance();
              _onShow.call(currentInstance);
            }
          }
        }
      })
     
    }
  }
  return pageObj;
}

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.indexFilter = indexFilter;