var app = getApp();
const service = require('../../utils/service.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    imagePaths:[],
    imagePathsFinal:[],
    topic_id:'',
    planId:'',
    bgNum:'',
    send:false,
    userscope:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    console.log('options.bgNum',options.bgNum)
    self.setData({
      topic_id:options.topic_id,
      planId:options.planId,
      bgNum:options.bgNum,
    })
    // 读取本地内容
    wx.getStorage({
      key: 'planSign',
      success: function(res) {
        if(res.data.date == app.getCurrentDateStr()){
          self.setData({
            content:res.data.content
          })

        }
      },
      fail(){
        console.log('读取本地缓存失败');
        wx.setStorage({
          key:"planSign",
          data:{
            content:'',
            date:app.getCurrentDateStr()
          },
          fail(){
            console.log('缓存失败')
          },
        })
      },
      complete(){
        // 如果缓存 没有感想内容 设置发布框默认值
        if(!self.data.content){
          self.setData({
            content:'打卡'
          })
        }
      }
    })
  },
  takePhoto(){
    let self = this
    wx.chooseImage({
      count:9,
      sizeType:['compressed'],
      // sourceType:['camera'],
      success(res){
        // 判断选择图片和已选图片是否超过9张
        let totalCount = res.tempFilePaths.length+self.data.imagePaths.length
        if(totalCount > 9){
          wx.showToast({
            title: '最多选择9张图片',
            icon: 'none',
          })
        }else{
          let uploadArr = [...self.data.imagePaths]
          uploadArr = uploadArr.concat(res.tempFilePaths)
          self.setData({
            imagePaths:uploadArr
          })
          console.log(res.tempFilePaths);
          console.log(self.data.imagePaths);
        }
      },
    })
  },
  deleteImage(event){
    let self = this
    let idx = event.currentTarget.dataset.index
    let tempArr = [...self.data.imagePaths]
    tempArr.splice(idx, 1)
    self.setData({
      imagePaths:tempArr
    })
  },
  bindTextAreaBlur: function(e) {
    let self = this
    self.setData({
      content:e.detail.value
    })
  },
  textareaInput: function(e) {
    let self = this
    self.setData({
      content:e.detail.value
    })
  },
  sendSign(){
    console.log(this.data.content)
    let self = this
    if(self.data.content.trim().length>1){
      if(self.data.content.trim().length>200){
        wx.showToast({
          title: '输入内容不能超过200个字符',
          icon: 'none',
        })
      }else{
        // 设置loading 开始传图 请求
        wx.showLoading({
          title:'发布中',
          mask:true,
        })
        let uploadArr = []
        let imageTempPaths = []
        for(let i = 0;i<self.data.imagePaths.length;i++){
          let uploadItem = self.uploadFile(self.data.imagePaths[i]).then((url)=>{
            imageTempPaths.push(url)
          })
          uploadArr.push(uploadItem)
        }
        Promise.all(uploadArr).then(()=>{
          self.setData({
            imagePathsFinal:imageTempPaths,
          })
          service.request('/growthplan/plan/publish-post', {
            topic_id: self.data.topic_id,
            image: self.data.imagePathsFinal.toString(),
            content: self.data.content,
          }, 'POST').then((res)=>{
            wx.hideLoading()
            if(res.data.code == 0){
              self.setData({
                send:true,
              })
              wx.showToast({
                title: '发布成功',
                icon: 'success',
              })
              // 清除缓存值
              wx.setStorage({
                key:"planSign",
                data:{
                  content:'',
                  date:app.getCurrentDateStr()
                },
                fail(){
                  console.log('缓存失败')
                },
              })
              self.setData({
                content:'',
                imagePaths:[],
                imagePathsFinal:[],
              })
              let pages = getCurrentPages();
              console.log(pages)
              let prePage = pages[pages.length -2];
              prePage.getNewList()
              prePage.getHotList()
              prePage.getRankList()
              wx.navigateBack()
            }else if(res.data.code == '10110002'){
              wx.showToast({
                title: '发布内容不符合相关法律法规或政策，请修改后重新发布',
                icon: 'none',
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          }).catch(()=>{
            wx.hideLoading()
            wx.showToast({
              title: '发布失败，请稍后重试',
              icon: 'none',
            })
          })
        }).catch(()=>{
          wx.hideLoading()
          wx.showToast({
            title: '图片上传失败，请稍后重试',
            icon: 'none',
          })
        })
      }
    }else{
      wx.showToast({
        title: '请至少输出2个有效字符',
        icon: 'none',
      })
    }
  },
  uploadFile(fileUrl) {
    return new Promise(((resolve, reject) => {
      service.request('/oss/upload/token', {}, 'GET').then((res)=>{
        try {
          let tokenObj = res.data.data || {}
          let fileName = 'plancommon' + new Date().getTime()
          const const_para = tokenObj.dir + "/" + fileName;
          wx.uploadFile({
            url: tokenObj.imageHost,
            method: 'POST',
            name:'file',
            formData:{
              "key":const_para,
              "policy":tokenObj.policy,
              "OSSAccessKeyId":tokenObj.accessid,
              "success_action_status":"200",
              "signature":tokenObj.signature,
              "callback":tokenObj.callback,
            },
            filePath:fileUrl,
            success(res){
              // 图片绝对路径
              let tempRes = JSON.parse(res.data)
              resolve(tempRes.data.url)
            },
            fail(err){
              reject(err)
            }
          })
        }catch (e) {
          wx.showToast({
            title: e,
            icon: 'none',
          })
        }
      }).catch((err)=>{
        reject(err)
      })
    }))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  checkUserInfo(){
    var self=this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权,获取用户头像和昵称
          self.setData({
            userscope: 1
          })
          // 缓存信息
          wx.getUserInfo({
            success(res){
              app.saveUserInfo(res)
            }
          })
        } else {
          self.setData({
            userscope: 0,
          })
        }
      },
      fail(){
        wx.showToast({
          title: '获取授权失败，请稍后重试',
          icon: 'none',
        })
      }
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self=this
    self.checkUserInfo()
  },
  onUnload: function () {
    // 判断已经输入数据 并且没有提交 要离开当前页面
    let self = this
    if(self.data.content){
      wx.setStorage({
        key:"planSign",
        data:{
          content:self.data.content,
          date:app.getCurrentDateStr()
        },
        fail(){
          console.log('缓存失败')
        },
      })
    }
  },
})