<script lang="ts" setup>
import { replyPost } from '@/utils/api'
import globalStore from '@/stores/global'
import { ref } from 'vue'
const global = globalStore()

const text = ref('')
const keyboardHeight = ref(0) // 键盘高度

const emit = defineEmits(['comfirm', 'keyboardchange'])

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
  emit('keyboardchange', 0)
}

const onfocus = () => {
  emit('keyboardchange', keyboardHeight.value)
}
const onblur = () => {
  emit('keyboardchange', keyboardHeight.value)

  global.closeCommentDialog()
}
// 监听键盘高度变化（uni-app支持）

uni.onKeyboardHeightChange(res => {
  keyboardHeight.value = res.height
})
</script>

<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared'
  }
}
</script>
<template>
  <view
    class="comment-pop"
    :style="{
      bottom: keyboardHeight > 0 ? keyboardHeight + 'px' : '0px'
    }"
  >
    <view class="comment-main">
      <view class="comment-input">
        <textarea
          v-model="text"
          :placeholder="`回复${global.commentReplyName}`"
          :adjust-position="false"
          confirm-type="send"
          :auto-height="true"
          @confirm="comfirm"
          @focus="onfocus"
          @blur="onblur"
          :auto-focus="true"
          :cursor-spacing="12"
        />
      </view>
      <!-- <view class="cancel" @click="cancel">取消</view> -->
    </view>
  </view>
</template>
<style lang="scss" scoped>
.comment-pop {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  z-index: 999;
  padding: 0 32rpx;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all ease-in 0.6s;
  .comment-main {
    width: 100%;

    box-sizing: border-box;
    padding-top: 24rpx;

    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    padding-bottom: 24rpx;
    .comment-input {
      width: 100%;
      ::v-deep textarea {
        min-width: 100%;
        background-color: #e0e0e0;
        min-height: 60rpx;
        border-radius: 10rpx;
        padding: 20rpx;
        box-sizing: border-box;
      }
    }
    // .cancel {
    //   flex-basis: 20%;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   height: 80rpx;
    //   border-radius: 30rpx;
    //   background: rgb(228, 217, 117);
    //   color: #fff;
    //   margin-left: 20rpx;
    // }
  }
}
</style>
