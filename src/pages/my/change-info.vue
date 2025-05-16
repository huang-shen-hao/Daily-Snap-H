<template>
  <view class="update-con">
    <image class="avatar" mode="aspectFit" :src="avatar" @click="chooseAvatar"></image>
    <view class="username">
      <uni-easyinput v-model="username" :clearable="false"> </uni-easyinput>
    </view>
    <view class="submit" @click="submit">保存</view>
  </view>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserInfo, uploadOss } from '@/utils/api'
import globalStore from '@/stores/global'

const global = globalStore()
const documentId = ref<string>('')
const avatar = ref<string>('')
const username = ref<string>('')
onLoad(async () => {
  const res = await getUserInfo()
  documentId.value = res.data.documentId
  avatar.value = res.data.avatar
  username.value = res.data.username
})

const submit = async () => {
  if (!avatar.value || !username.value) {
    return uni.showToast({
      title: '请输入完整信息',
      icon: 'none'
    })
  }
  const res = await updateUserInfo(documentId.value, username.value, avatar.value)
  if (res.code === 0 && res.data) {
    uni.showToast({
      title: '修改成功',
      icon: 'none'
    })
    global.$patch({
      userInfo: {
        uuid: res.data.uuid,
        id: res.data.documentId,
        email: res.data.email,
        username: res.data.username,
        avatar: res.data.avatar
      }
    })
    uni.navigateBack()
  }
}

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: res => {
      console.log('222222222222', res)
    }
  })
}
</script>

<style lang="scss" scoped>
.update-con {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .avatar {
    width: 460rpx;
    height: 460rpx;
    border-radius: 40rpx;
    margin-bottom: 40rpx;
  }
  .username {
    width: calc(100% - 80rpx);
    margin-bottom: 40rpx;
  }
  .submit {
    width: calc(100% - 80rpx);
    height: 100rpx;
    background: #f9f26d;
    border-radius: 60rpx 60rpx 60rpx 60rpx;
    font-family:
      Alibaba PuHuiTi,
      Alibaba PuHuiTi;
    font-weight: 800;
    font-size: 32rpx;
    color: #333333;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

:deep(.is-input-border) {
  border: none;
}
:deep(.uni-easyinput),
:deep(.uni-easyinput__content) {
  width: 100%;
  height: 96rpx;
  padding: 0 !important;
  border-radius: 60rpx;
  .uni-easyinput__placeholder-class {
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 56rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  input {
    width: 100%;
    height: 92rpx;
    border-radius: 60rpx;
    background: #f6f6f6;
    text-align: center;
    padding-left: 32rpx;
    &::placeholder {
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      line-height: 56rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>
