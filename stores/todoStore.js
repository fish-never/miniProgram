const extendObservable=require('../libs/mobx').extendObservable;
let timer
let TodoStore = function(){
  extendObservable(this,{
    me:undefined,
    answerQuestionPlan:undefined,
    learningState:undefined,
    formId:false,
    isCheck:undefined,
    get count(){
      return this.me;
    },
    btn:{
      indexLearn: true,
      indexRevise: true,
      indexSet: true,
      login: true,
      qrSave: true,
      qrClose: true,
      remindNext: true,
      studyPlan: true,
      clockInSave: true,
      clockInClose: true,
      soundTip: true,
      signUp: true, //活动页报名按钮
      unlock: true // 解锁
    }
  })
  this.changePlan=(value)=>{
    this.answerQuestionPlan=value
  },
  this.changeStudyData=(value)=>{
    this.studyData=value
  },
  this.changeIsCheck=(value)=>{
    this.isCheck=value
  },
  this.changeMe=(value)=>{
    this.me=value
  },
  this.getUser =(callback)=>{
    if(typeof this.me==='undefined'){
      timer=setTimeout(()=>{
        return this.getUser(callback)
      })
    }else{
      clearTimeout(timer)
      return callback.call(this)
    }
  },
  this.changeBtn=(name,value,time)=>{
    let that = this
    //
    if(value){
      if(time==null||time==undefined){
        time=500
      }
      setTimeout(()=>{
        that.btn[name]=value
      },time)
    }else{
      that.btn[name]=value
    }
  },
  this.formIdCallback=(back)=>{
    new Promise((resove)=>{
      if(!this.formId){
        setTimeout(_=>{
          return this.formIdCallback(back)
        },100)
      }else{
        this.formId=false
        resolve()
      }
    }).then(_=>{
      back.call(this)
    })
  }
}
export default new TodoStore()