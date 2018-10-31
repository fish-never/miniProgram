Component({
  properties: {
    isHidden: {
      type: Boolean,
      value: true
    },
    top: {
      type: Number,
      value: Number(getApp().globalData.statusbarHeight)+4
    },
    isWhite: {
      type: Boolean,
      value: false
    },
    // 是否加大
    size: {
      type: String,
      value: 'normal'
    }
  },
  attached() {
    if(getCurrentPages().length-1 <= 0){
      this.setData({
        isHidden: false
      })
    }else{
      this.setData({
        isHidden: true
      })
    }
  }
})
