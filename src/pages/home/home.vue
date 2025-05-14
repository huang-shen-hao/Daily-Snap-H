<template>
  <view class="container">
    <view v-for="item in funList" :key="item.name" class="fun-item" @click="goFunPage(item.path)">{{ item.name }}</view>
  </view>
  <my-tab-bar :selected="0" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'

const funList = [
  {
    name: '记事本',
    path: '/pages/note/list'
  }
]

const goFunPage = (path: string) => {
  uni.navigateTo({
    url: path
  })
}

onLoad(() => {
  // 页面加载时的逻辑
  console.log('Home page loaded')
})
onShow(() => {
  uni.hideTabBar()
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;
  /* 背景铺满屏幕 */
  padding: 20px;
  // background-color: rgb(102, 161, 230);
}
</style>
