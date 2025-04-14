<template>
  <view class="container"> </view>
  <my-tab-bar :selected="2" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'
onShow(() => {
  uni.hideTabBar()
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh; /* 背景铺满屏幕 */
  padding: 20px;
}
</style>
