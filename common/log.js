import config from '../config/config'
import fetch from './fetch'
import * as logContext from  './context'
import TodoStore from '../stores/todoStore'

// 日志分类
const category = {
  ENTER: 'enter', // 进入页面 actions = ['pageEnter', 'routeChange']
  LEAVE: 'leave', // 离开  actions = ['position', 'mediaStatus', ...]
  OPERATION: 'userOperation', //用户主动操作   actions = ['click', 'share', 'play', ...]
  ERROR: 'error', // 页面错误 actions = ['pageError', 'routeError', ...]
  RESOURCES: 'resources',// 资源状态
}

let log = {
  /* 小程序启动 */
  launchApp: function (obj) {
    var init = {
      loadTime: 0
    }
    var appContext = logContext.getAppContext();
    var {scene, fromTicket, referrerInfo} = appContext;
    Object.assign(init, obj, {scene, fromTicket, referrerInfo});

    sendLog('capability', 'launchApp', '', {
      launchApp: init
    });
  },
  /* page页面加载 */
  pageLoad: function (obj) {
    sendLog('capability', 'pageLoad', '', {
      pageLoad: obj
    })
  },
  /* 进入页面 */
  enter: function () {
    sendLog('enter', 'enter', '', null);
  },

  /* 离开页面 */
  leave: function (obj) {
    var init = {
      duration: 0
    };
    Object.assign(init, obj);
    sendLog('leave', 'leave', '', {
      leave: init
    });
  },

  /* 用户click操作 */
  click: function (describe) {
    sendLog('userOperation', 'click', '', {
      click: describe
    })
  },

  /* 资源状态 */
  resources: function (obj) {
    sendLog('resources', 'resources', obj)
  },

  /* share分享 */
  share: function (obj) {
    let init = {
      sharePath: '',
      source: 0, // 分享是通过按钮分享1 还是右上角转发0
      shareTicket: ''
    };
    Object.assign(init, obj);
    sendLog('share', 'share', '', {
      share: init
    })
  },

  playVideo: function (obj) {
    sendLog('userOperation', 'playVideo', obj)
  }
}

function sendLog(category, action, content, otherPostParams) {
  TodoStore.getUser(_ => {
    var paramData = buildBehaviorParams();
    paramData.event = {
      category,
      action,
      content
    }
    paramData.openid = TodoStore.me.openid
    if (otherPostParams && typeof otherPostParams === 'object') {
      if(action == 'launchApp'){
        var appContext = logContext.getAppContext();
        Object.assign(otherPostParams, paramData, {device: appContext.device});
      }else{
        Object.assign(otherPostParams, paramData);
      }
      logRequest(otherPostParams);
    } else {
      logRequest(paramData);
    }
  })
}

/* 组装post对象 必带属性 */
function buildBehaviorParams() {
  const appContext = logContext.getAppContext();
  const pageContext = logContext.getPageContext();

  const prev = {
    route: pageContext.prevRoute,
    url: pageContext.prevUrl,
    pvId: pageContext.prevPvId,
  }
  return {
    version: config.version,
    openid: TodoStore.me.openid,
    vvId: appContext.vvId,
    pvId: pageContext.pvId,
    url: pageContext.url,
    route: pageContext.route,
    title: pageContext.title,
    query: pageContext.query,
    prev: prev,
    devTime: logContext.timestamp(),
    // device: appContext.device,
    networkType: getApp().globalData.networkType,
    referrerInfo: getApp().globalData.referrerInfo,
    appId: '',
    event: {
      category: '',
      action: '',
      content: ''
    }
  }
}

/* 发送请求 */
function logRequest(params) {
  // console.log('########日志#########',params,'----------');
  fetch.post({
    url: config.api.log,
    data: params,
    header: {
      'log-from': 'ananas'
    },
    success: res => {
      // console.log(res)
    },
    fail: res => {

    }
  });
}
export default log
