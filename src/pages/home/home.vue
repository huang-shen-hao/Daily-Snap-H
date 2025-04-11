<template>
  <view class="container">
    <view class="header">
      <text class="header-title">日常打卡</text>
    </view>
    <view class="card card1">
      <text class="card-title">打卡记录</text>
      <text class="card-content">今天的打卡内容...</text>
    </view>
    <view class="card card2">
      <text class="card-title">目标设定</text>
      <text class="card-content">设定你的每日目标...</text>
    </view>
    <view class="card card3">
      <text class="card-title">统计分析</text>
      <text class="card-content">查看你的打卡统计...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 这里可以添加逻辑代码
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom right, #87cefa, #ffeb3b); /* 渐变背景颜色 */
  height: 100vh; /* 背景铺满屏幕 */
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.header-title {
  font-size: 48rpx;
  color: #ff6347; /* 标题颜色 */
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 卡通字体 */
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  padding: 20px;
  margin: 10px;
  width: 90%;
}

.card1 {
  background-color: #ffcccb; /* 卡片1颜色 */
}

.card2 {
  background-color: #add8e6; /* 卡片2颜色 */
}

.card3 {
  background-color: #90ee90; /* 卡片3颜色 */
}

.card-title {
  font-size: 24rpx;
  color: #4682b4; /* 卡片标题颜色 */
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 卡通字体 */
}

.card-content {
  font-size: 18rpx;
  color: #696969; /* 卡片内容颜色 */
}
</style>
