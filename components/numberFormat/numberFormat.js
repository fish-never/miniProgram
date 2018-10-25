// components/item
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    realNum:{
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    number:0,
  },
  ready(){
    let self = this
    self.setData({
      number:self.formatNum(self.data.realNum)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    formatNum(num){
      num = num * 1
      if (num >= 10000) {
        num = Math.floor(num / 10000) + "w"
      }
      return num
    },
  }
})
