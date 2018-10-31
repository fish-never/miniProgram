const appContext = {
    vvId: '',
    scene: '',
    device: {},
    _verbose: false, //是否开启日志模式
}

const pageContext = {
    pvId: '',
    url: '',
    route: '',
    title: '🍍菠萝英语',
    query: {},
    prevPvId: '',
    prevUrl: '',
    prevRoute: '',
}


export function registerApp(context = {}){
    Object.keys(context).forEach(field => {
        if (appContext[field] !== undefined){
            appContext[field] = context[field];
        }else{
            console.warn(`无效的字段值：${field}`);
        }
    })
}

export function registerPage(context ={}){
    Object.keys(context).forEach(field => {
        if (pageContext[field] !== undefined){
            pageContext[field] = context[field];
        }else{
            console.warn(`无效的字段值：${field}`);
        }
    })
}

export function getAppContext(){
    return { ...appContext };
}

export function getPageContext(){
    return { ...pageContext };
}


// 获取pvid、vvid
export function rid(){
    const now = new Date()
    const year = now.getFullYear()
    const month = _datefix(now.getMonth() + 1)
    const date = _datefix(now.getDate())
    const hour = _datefix(now.getHours())
    const minute = _datefix(now.getMinutes())
    const second = _datefix(now.getSeconds())
    let random4 = Math.floor((Math.random() * 1000)).toString()
    const length = 4 - random4.length;
    for (let i = 0; i < length ; i++){
        random4 = '0' + random4
    }
    return `${year}${month}${date}${hour}${minute}${second}${random4}`
}

// 获取当前时间 格式化
export function timestamp(date = new Date()){
    const year = date.getFullYear()
    const month = _datefix(date.getMonth() + 1)
    const dateStr = _datefix(date.getDate())
    const hour = _datefix(date.getHours())
    const minute = _datefix(date.getMinutes())
    const second = _datefix(date.getSeconds())
    return `${year}-${month}-${dateStr} ${hour}:${minute}:${second}`
}
function _datefix(n) {
    return n<10 ? ('0'+n) : n
}

export function encodeUrlParams(options){
  var url = '?';
  for(var k in options){
    url += k + '='+options[k]+'&';
  }
  url = url.substring(0, url.length-1);
  return url;
}
