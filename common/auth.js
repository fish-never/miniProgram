const auth={
  set:function(authToken){
    try{
      wx.setStorageSync('autn-token', authToken)
    }catch(e){
      console.log('set auth fail')
    }
  },
  get:function(){
    try{
      wx.getStorageSync('auth-token')
    } catch (e){
      console.log('get auth fail')
    }
  },
  remove:function(){
    try{
      wx.removeStorageSync('auth-token')
    } catch (e){
      console.log('remove auth fail')
    }
  }
}
export default auth