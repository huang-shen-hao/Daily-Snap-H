<template>
  <view class="contain">
    <view class="setting">
      <view class="setting-item" v-for="item in footList" :key="item.name" @click="goPage(item.path)">
        <view class="name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { clearInfo } from '@/utils/tool'
const footList = [
  {
    type: 'page',
    name: '主题切换',
    path: '/pages/theme/theme'
  },
  {
    type: 'page',
    name: '隐私政策',
    path: '/pages/private/private'
  },
  {
    type: 'page',
    name: '关于我们',
    path: '/pages/contract/contract'
  },
  {
    type: 'page',
    name: '退出登录',
    path: '/pages/login/login'
  }
]

const goPage = (path: string) => {
  const bar = ['home', 'square', 'my']
  const isBar = bar.some(item => path.includes(item))
  if (isBar) {
    uni.switchTab({
      url: path
    })
  } else {
    if (path === '/pages/login/login') {
      clearInfo()
    }
    uni.navigateTo({
      url: path
    })
  }
}
</script>

<style lang="scss" scoped>
.contain {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #fffbeb 0%, #f6f6f6 37%);
  padding-top: 24rpx;
}
.setting {
  width: calc(100% - 80rpx);
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20rpx 40rpx;
  background: #fff;
  border-radius: 40rpx;
  .setting-item {
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    &::after {
      content: '';
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: url('https://iili.io/3SFqxCF.png') no-repeat center;
      background-size: cover;
    }
    .name {
      font-family:
        Alibaba PuHuiTi,
        Alibaba PuHuiTi;
      font-weight: 500;
      font-size: 28rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>
