let questionNum = 1, item = {sum: 0, addNum: 0, successionNum: 0}, list=[];//当前题数，总得分and此题加分值and连续答对数，答题列表
export default function integral(isSuccess, isSightWord = 0, next = false) {
  item.addNum = 0;//每次归零加分值
  if(next){
    //下一组
    item = {sum: 0, addNum: 0, successionNum: 0};
    questionNum = 0;
    list = [];
    return
  }
  list.push(isSuccess)
  // console.warn(list)
  if(questionNum > 1){
    if(isSuccess){
      if(list[list.length - 2]){
        item.successionNum += 1
        item.addNum = 1 + item.successionNum
        if(isSightWord > 0){
          item.sum += (item.addNum * 2)
        }else{
          item.sum += item.addNum
        }
      }else{
        item.successionNum = 0
        item.addNum = 1
        if(isSightWord > 0){
          item.sum += (item.addNum * 2)
        }else{
          item.sum += item.addNum
        }
      }
    }else{
      item.successionNum = 0
    }
  }else{
    if(isSuccess){
      item.successionNum = 0
      item.addNum = 1
      if(isSightWord > 0) {
        item.sum += (item.addNum * 2)
      }else{
        item.sum += item.addNum
      }
    }
  }
  questionNum += 1
  return item;
}