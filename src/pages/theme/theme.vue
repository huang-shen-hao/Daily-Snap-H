<template>
  <view class="theme-con">
    <view class="tip">点击图片即可替换首页壁纸哦~</view>
    <!-- 使用 scroll-view 来承载可滚动区域 -->
    <scroll-view class="scroll" :scroll-y="true" @scrolltolower="loadMore" lower-threshold="100">
      <!-- 瀑布流容器，动态列数和间距 -->
      <view class="waterfall" :style="`column-count: ${columns}; column-gap: ${gap}px;`">
        <view v-for="(item, idx) in list" :key="idx" class="item" @click="changeHomeBk(item.url)">
          <!-- UniApp 支持 lazy-load 属性 -->
          <image :src="item.url" mode="widthFix" :lazy-load="true" class="pic" />
        </view>
      </view>

      <!-- 底部 loading 提示 -->
      <view v-if="loading" class="loading">加载中…</view>
      <view v-if="!hasMore" class="loading">— 没有更多了 —</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { getWallPages } from '@/utils/api'

// 列数、间距可按需求调整
const columns = 2
const gap = 10

// 列表数据、分页控制
const list = ref<any[]>([])
const page = ref(1)
const pageSize = 5
const loading = ref(false)
const hasMore = ref(true)

// 初始加载
const loadInitial = async () => {
  loading.value = true
  const data = await getWallPages(page.value)
  console.log('----------', data)
  list.value = data.list
  loading.value = false
}

// 触底加载更多
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  page.value++
  const data = await getWallPages(page.value)
  if (data.list.length < pageSize) {
    hasMore.value = false
  }
  list.value = list.value.concat(data.list)
  loading.value = false
}

onLoad(() => {
  loadInitial()
})

const changeHomeBk = (url: string) => {
  uni.showLoading({
    title: '保存中'
  })
  uni.setStorageSync('HOME_BK', url)
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '提示',
      content: '保存成功是否立即返回首页查看',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          uni.switchTab({ url: '/pages/home/home' })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }, 2000)
}
</script>

<style lang="scss" scoped>
.theme-con {
  width: 100%;
  height: 100vh;
  padding-top: 20rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  box-sizing: border-box;
  .tip {
    width: 100%;
    height: 60rpx;
    border-radius: 20rpx;
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    margin-bottom: 20rpx;
    color: #fff;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20rpx;
    box-sizing: border-box;
  }
  .scroll {
    height: calc(100vh - 80rpx);
  }
}

.item {
  /* 瀑布流项在多列布局中需要设置内联块显示 */
  display: inline-block;
  width: 100%;
  margin-bottom: 10px;
}
.pic {
  width: 100%;
  border-radius: 8px;
}
.loading {
  text-align: center;
  padding: 12px 0;
  color: #888;
}
</style>
