<script lang="ts" setup>
import { replyPost } from '@/utils/api'
import globalStore from '@/stores/global'
const global = globalStore()

const text = ref('')

const emit = defineEmits(['comfirm'])

const comfirm = async () => {
  if (text.value === '') {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }
  const auth = global.userInfo.id
  const res = await replyPost(text.value, global.puid, auth)
  if (res.code === 0) {
    uni.showToast({
      title: '回复成功',
      icon: 'none'
    })

    emit('comfirm', { status: true })
  }
  text.value = ''
  global.resetCommentInfo()
  global.closeCommentDialog()
}

const cancel = () => {
  text.value = ''
  global.resetCommentInfo()
  global.closeCommentDialog()
}
</script>
<template>
  <!-- 评论框 -->
  <view class="comment-pop">
    <view class="main">
      <view class="title">回复{{ global.commentReplyName }}</view>
      <uni-easyinput type="textarea" v-model="text" placeholder="请输入内容"></uni-easyinput>
      <view class="btns">
        <view class="btn cancel" @click="cancel">取消</view>
        <view class="btn confirm" @click="comfirm">确认</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.comment-pop {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
  background-color: rgb(0 0 0 / 50%);
  inset: 0;

  .main {
    width: 80%;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 30rpx;

    .title {
      width: 100%;
      font-size: 30rpx;
      padding: 20rpx 0;
      font-weight: 600;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30rpx;

      .btn {
        width: 45%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10rpx;
        font-size: 30rpx;
        color: #000;
      }

      .cancel {
        background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
      }

      .confirm {
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      }
    }
  }
}
</style>
