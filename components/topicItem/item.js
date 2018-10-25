// components/item
var WxParse = require('../../wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topicInfo:{
      type:Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content:'',
    images:[],
  },
  ready(){
    return
    // let self = this
    // try {
    //   let str = this.data.topicInfo.content.content
    //   str = str.substr(0, 62);
    //   let newtext = str.replace(/(#.*?#)/g, function (a) {
    //     return '<a style="color:#FD782D">' + a + "</a>"
    //   })
    //   let moreHtml = ''
    //   if(this.data.topicInfo.content.content.length > 62){
    //     moreHtml = '<span style="color:#8EA6B0">......显示全部</span>'
    //   }
    //   let item = 'topicInfo.content.content';
    //   let Imgs = 'topicInfo.content.images';
    //   self.setData({
    //     [item]: newtext + moreHtml,
    //     [Imgs]: this.data.topicInfo.content.images || []
    //   })
    //   self.setData({
    //    content:newtext + moreHtml,
    //     images:this.data.topicInfo.content.images || []
    //   })
    //   console.log(self.data.content,676868)

    // }catch (e) {
    //   console.log(e)
    // }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotoArticle:function(e){
      var that = this
      //that.formSubmit(e)
      wx.navigateTo({
        url: '../articleNode/articleNode?topic_id=' + e.currentTarget.id,
      })
    },
    xxx:function(a){
      return 3333
    }
  },

})
