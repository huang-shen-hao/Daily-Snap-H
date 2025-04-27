<script setup lang="ts">
import { addPost } from '@/utils/api'
import userStore from '@/stores/user'
const user = userStore()

const title = ref('')
const content = ref('')

const submit = () => {
  uni.showModal({
    title: '提示',
    content: '是否发布',
    success: async ({ confirm }) => {
      if (confirm) {
        const res = await addPost(title.value, content.value, user.userInfo.id)
        console.log(res)
        uni.navigateBack()
      }
    }
  })
}
</script>
<template>
  <view class="container">
    <view class="row">
      <uni-easyinput v-model="title" placeholder="请输入标题"></uni-easyinput>
    </view>
    <view class="row content">
      <uni-easyinput type="textarea" v-model="content" placeholder="请输入内容"></uni-easyinput>
    </view>

    <view @click="submit">发布</view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh; /* 背景铺满屏幕 */
  padding: 20px;
  .row {
    width: 100%;
  }
}
</style>
