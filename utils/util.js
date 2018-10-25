const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
let list = ['topic001.png', 'topic002.png', 'topic003.png', 'topic004.png','topic005.png']
function bgImgIdx(idx){
  return list[idx]
}
module.exports = {
  formatTime: formatTime,
  bgImgIdx: bgImgIdx

}
