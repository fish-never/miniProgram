export default function animationOpen(animationName, dialog) {
  const animation = wx.createAnimation({
    duration: 100,
    timingFunction: 'linear',
  })
  animation.scale3d(0.5, 0.5).step()
  this.setData({
    [animationName]: animation.export(),
    [dialog]: true
  })
  setTimeout(() => {
    animation.scale3d(1.1, 1.1).step()
    this.setData({
      [animationName]: animation.export()
    })
    setTimeout(() => {
      animation.scale3d(1, 1).step()
      this.setData({
        [animationName]: animation.export()
      })
    }, 90)
  }, 90)
};
// // 弹窗关闭动画
// export function animationClose(animationName, dialog) {
//   const animation = wx.createAnimation({
//     duration: 100,
//     timingFunction: 'linear',
//   })
//   animation.scale3d(1.1, 1.1).step()
//   this.setData({
//     [animationName]: animation.export(),
//   })
//   setTimeout(() => {
//     animation.scale3d(0.5, 0.5).step()
//     this.setData({
//       [animationName]: animation.export(),
//     })
//     setTimeout(() => {
//       this.setData({
//         [dialog]: false
//       })
//     }, 90)
//   }, 90)
// }