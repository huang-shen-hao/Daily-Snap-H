<script setup lang="ts">
defineProps({
  // 这里可以定义 props
  selected: {
    type: Number,
    required: true
  }
})

const tabbarList = [
  {
    id: 0,
    pagePath: '/pages/home/home',
    text: '首页',
    iconPath: '../../static/image/home_before.svg',
    selectedIconPath: '../../static/image/home_after.svg'
  },
  {
    id: 1,
    pagePath: '/pages/center/center',
    text: '中心',
    iconPath: '../../static/image/center_before.svg',
    selectedIconPath: '../../static/image/center_after.svg'
  },
  {
    id: 2,
    pagePath: '/pages/center/center',
    text: '广场',
    iconPath: '../../static/image/center_before.svg',
    selectedIconPath: '../../static/image/center_after.svg'
  },
  {
    id: 3,
    pagePath: '/pages/my/my',
    iconPath: '../../static/image/my_before.svg',
    selectedIconPath: '../../static/image/my_after.svg',
    text: '我的'
  }
]

const changeTabbar = (path: string) => {
  uni.switchTab({ url: path })
}
</script>
<template>
  <view class="custom-tab-bar">
    <view class="main">
      <view v-for="(item, index) in tabbarList" :key="index" class="tab-bar-item" @click="changeTabbar(item.pagePath)">
        <image class="icon" :src="selected === item.id ? item.selectedIconPath : item.iconPath" />
        <view class="text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.custom-tab-bar {
  position: fixed;
  bottom: 0;
  // bottom: calc(30rpx + constant(safe-area-inset-bottom));
  // bottom: calc(30rpx + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  .main {
    // width: calc(100% - 48rpx);
    width: 100%;
    height: 120rpx;
    background-color: #fff;
    // background: rgba(255, 255, 255, 0.65);
    // box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    // backdrop-filter: blur(5px);
    // -webkit-backdrop-filter: blur(5px);
    // border-radius: 10px;
    border-top: 1px solid rgb(202, 202, 202);
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 auto;
    // border-radius: 60rpx;
    padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
    .tab-bar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-bottom: 6rpx;
      }
      .text {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
}
</style>
