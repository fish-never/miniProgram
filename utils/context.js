const appContext = {
    serverUrl: '',
    unionId: '',
    openId: '',
    appId: '',
    siteId: '',
    vvId: '',
    product: '1',
    scene: '',
    fromTicket: '',
    _verbose: false, //是否开启日志模式
}

const pageContext = {
    pvId: '',
    path: '',
    url: '',        
    prevPath: '',
    prevUrl: '',
    prevPvId: '',
}


function registerApp(context = {}){
    Object.keys(context).forEach(field => {
        if (appContext[field] !== undefined){
            appContext[field] = context[field];
        }else{
            console.warn(`无效的字段值：${field}`);
        }
    })
    
}

function registerPage(context ={}){
    Object.keys(context).forEach(field => {
        if (pageContext[field] !== undefined){
            pageContext[field] = context[field];
        }else{
            console.warn(`无效的字段值：${field}`);
        }
    })
}

function getAppContext(){
    return { ...appContext };
}

function getPageContext(){
    return { ...pageContext };
}

export default {
    registerApp,
    registerPage,
    getAppContext,
    getPageContext
}

