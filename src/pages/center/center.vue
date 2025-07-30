<template>
  <view class="container">
    <!--  -->
    <view
      class="section"
      v-for="item in chooseList"
      :key="item.path"
      @click="goPage(item.path)"
      :style="{ background: `url(${item.bk}) no-repeat center` }"
    >
      <view class="name">{{ item.name }}</view>
      <view class="btn">{{ item.btn }}</view>
    </view>
  </view>
  <my-tab-bar :selected="1" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'
onShow(() => {
  uni.hideTabBar()
})

const chooseList = [
  {
    path: '/pages/my/guide',
    name: '新手指引',
    btn: '点击查看',
    bk: 'https://daily-snap.oss-cn-hangzhou.aliyuncs.com/ff5721.jpg'
  },
  {
    path: '/pages/theme/theme',
    name: '壁纸切换',
    btn: '立即更换',
    bk: 'https://daily-snap.oss-cn-hangzhou.aliyuncs.com/064bbf9.jpg'
  }
]

const goPage = (url: string) => {
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh; /* 背景铺满屏幕 */
  padding: 20px;
  gap: 20rpx;
  .section {
    width: 100%;
    height: 360rpx;
    background-size: cover !important;
    margin: 0 auto;
    border-radius: 30rpx;
    position: relative;
    box-sizing: border-box;
    .name {
      font-size: 52rpx;
      font-weight: 500;
      color: #5209db;
      position: absolute;
      top: 30rpx;
      left: 30rpx;
    }
    .btn {
      padding: 16rpx 36rpx;
      background-color: #fff;
      color: #000;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      border-radius: 30rpx;
    }
  }
}
</style>
