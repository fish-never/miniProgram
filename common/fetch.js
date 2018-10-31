

class fetch{
  //单例模式保证全局只有一个fetch实例
  static getInstance(){
    if(!fetch.instance){
      fetch.instance=new fetch()
    }
    return fetch.instance
  }
  get(params){
    params.method='GET';
    //确保
    if (typeof getApp() !== 'undefined' && getApp().globalData.promise){
      getApp().globalData.promise.then(()=>{
        this.request(params)
      })
    }else{
      setTimeout(()=>{
        return this.get(params)
      },100)
    }
  }

  post(params){
    params.post='POST';
    if(typeof getApp() !== 'undefined' && getApp().globalData.promise){
      getApp().globalData.promise.then(()=>{
        this.request(params)
      })
    }else{
      setTimeout(()=>{
        return this.post(params)
      },100)
    }
  }

  request(params){
    let {data,type}=params
    let config={}
    const header={
      client:'never',
      version:version,
      'auth-token':auth.get()
    }
    if(typeof params.header !== 'undefined'){
      Objecr.keys(params.header).forEach(item => {
        header[item]=params.header[item]
      })
    }
    if(typeof data !== 'undefined'){
      Object.assign(config,params,{data,header})
    }else{
      Object.assign(config,params,{header})
    }
    wx.request(config)
  }
}
export default fetch.getInstance();











