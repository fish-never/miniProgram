1.小程序头部tab栏支持左右滑动切换和点击切换，向上和向下滑动可实现数据的加载更多和实时更新(pages/index1/index1)
2.小程序模拟打卡业务（pages/planIndex/planIndex）
3.小程序引用MobX实现个人信息数据状态管理，stores/todoStore.js中用observable观察state，pages/index1/index1.js中用observer修饰的组件内会根据被observable观察的state的变化而自动重新渲染（用autorun包裹了render函数，state的变化触发autorun）
4.使用单例模式和promise将wx.request封装异步函数（common/fetch.js），并统一管理接口(config/api.js)
