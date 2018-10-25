// components/xing/x-scroll-view/x-scroll-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollTop:{
      type:Number,
      value:0
    },
    pullText: {
      type: String,
      value: '下拉获取推荐',
    },
    releaseText: {
      type: String,
      value: '松开立即推荐',
    },
    loadingText: {
      type: String,
      value: '正在为您推荐',
    }, 
    finishText: {
      type: String,
      value: '刷新完成',
    },
    loadmoreText: {
      type: String,
      value: '正在加载更多数据',
    },
    nomoreText: {
      type: String,
      value: '已经全部加载完毕',
    },
    failText:{
      type: String,
      value: '加载失败，稍后再试',
    },
    pullDownHeight: {
      type: Number,
      value: 60,
    },
    refreshing: {
      type: Boolean,
      value: false,
      observer: '_onRefreshFinished',
    },
    nomore: {
      type:   Number,
      value: 0,//0指hasmore;1指nomore;2指请求失败
    },
    loading: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullDownStatus: 0,
    lastScrollEnd: 0,
  },
  ready: function () {
    this.setData({
      pullDownStatus: 0,
      topview: 'topview'
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // _onScroll: function (e) {
    //   this.triggerEvent('scroll', e.detail);
    //   const status = this.data.pullDownStatus;
    //   if (status === 3 || status == 5) return;
    //   const height = this.properties.pullDownHeight;
    //   const scrollTop = e.detail.scrollTop;
    //   let targetStatus;
    //   if (scrollTop < -1 * height) {
    //     targetStatus = 2;
    //   } else if (scrollTop < 0) {
    //     targetStatus = 1;
    //   } else {
    //     targetStatus = 0;
    //   }
    //   if (status != targetStatus) {
    //     this.setData({
    //       pullDownStatus: targetStatus,
    //     })
    //   }
    // },
    _onScroll: function (e) {
      this.triggerEvent('scroll', e.detail);
      const status = this.data.pullDownStatus;
      if (status === 3 || status == 4) return;
      const height = this.properties.pullDownHeight;
      const scrollTop = e.detail.scrollTop;
      let targetStatus;
      if (scrollTop < -60) {
        targetStatus = 2;
      } else {
        targetStatus = 0;
      }
      // if (scrollTop < -1 * height) {
      //   targetStatus = 2;
      // } else if (scrollTop < 0) {
      //   targetStatus = 1;
      // } else {
      //   targetStatus = 0;
      // }
      if (status != targetStatus) {
        this.setData({
          pullDownStatus: targetStatus,
        })
      }
    },

    _onTouchEnd: function (e) {
      const status = this.data.pullDownStatus;
      if (status === 2) {
        this.setData({
          pullDownStatus: 3,
        })
        this.properties.refreshing = true;
        setTimeout(() => {
          this.triggerEvent('pulldownrefresh');
        }, 100);
      }
    },

    _onRefreshFinished(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.properties.nomore = 0;
        this.setData({
          nomore: 0,
        })
        this.setData({
          pullDownStatus: 4,
          lastScrollEnd: 0,
        })
        setTimeout(() => {
          this.setData({
            pullDownStatus: 0,
          })
        }, 500);
      }
    },

    _onLoadmore() {
      if (this.properties.nomore === 0 || this.properties.nomore === 2) {
        let query = wx.createSelectorQuery().in(this);
        query.select('.scroll-view').fields({
          size: true,
          scrollOffset: true,
        }, res => {
          // if (Math.abs(res.scrollTop - this.data.lastScrollEnd) > res.height) {
          //   this.setData({
          //     lastScrollEnd: res.scrollTop,
          //   })
          //   this.triggerEvent('loadmore');
          // } 
          if (Math.abs(res.scrollTop) > 0) {
            this.setData({
              lastScrollEnd: res.scrollTop,
            })
            this.triggerEvent('loadmore');
          } 
        }).exec();
      }
    },
  },
})
