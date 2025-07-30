// 获取胶囊位置信息
export const UseStatusHeight = () => {
  // 获取胶囊按钮位置信息
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  console.log('----------', menuButtonInfo)
  // 获取导航栏高度
  const safe = menuButtonInfo.bottom - menuButtonInfo.height

  return {
    safe,
    height: menuButtonInfo.height
  }
}
