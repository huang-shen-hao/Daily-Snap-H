<script lang="ts" setup>
import { sendEmailCode, registerAndsaveUserInfo } from '@/utils/api'
const registerForm = reactive({
  email: '',
  username: '',
  password: '',
  code: ''
})

// 是否发二维码的tag
const codeTag = ref<boolean>(true)

const showpassword = ref(true)
const eyeL = 'https://trial-cdn.esign.cn/upload/2a13ebbb-ee95-54eb-8f9a-b0886b800cf5!!4-17.png'
const eyeG = 'https://trial-cdn.esign.cn/upload/bc31081d-8e84-5c13-924c-48216557b8e5!!4-17.png'

const getCode = async () => {
  const regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!registerForm.email) {
    return uni.showToast({
      title: '请先输入邮箱',
      icon: 'none',
      duration: 2000
    })
  }
  if (regx.test(registerForm.email) === false) {
    return uni.showToast({
      title: '邮箱格式不正确',
      icon: 'none',
      duration: 2000
    })
  }

  const res = await sendEmailCode(registerForm.email)
  const { code, message } = res.data
  if (code === 0) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
    codeTag.value = true
  }
}

const submit = () => {
  if (!registerForm.username) {
    return uni.showToast({
      title: '请先输入昵称',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.email) {
    return uni.showToast({
      title: '请先输入邮箱',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.password) {
    return uni.showToast({
      title: '请先输入密码',
      icon: 'none',
      duration: 2000
    })
  }
  if (!registerForm.code) {
    return uni.showToast({
      title: '请先输入验证码',
      icon: 'none',
      duration: 2000
    })
  }

  if (!codeTag.value) {
    return uni.showToast({
      title: '请先获取验证码',
      icon: 'none',
      duration: 2000
    })
  }

  if (registerForm.code.length !== 5) {
    return uni.showToast({
      title: '验证码格式不正确',
      icon: 'none',
      duration: 2000
    })
  }
  registerAndsaveUserInfo(registerForm)
}

const changeEye = () => {
  showpassword.value = !showpassword.value
}
</script>
<template>
  <view class="register-con">
    <view class="register-dialog">
      <view class="input-row">
        <view class="input-label">昵称</view>
        <input class="uni-input" v-model="registerForm.username" />
      </view>

      <view class="input-row">
        <view class="input-label">邮箱</view>
        <input class="uni-input" v-model="registerForm.email" />
      </view>

      <view class="input-row">
        <view class="input-label">密码</view>
        <input class="uni-input password" :password="showpassword" v-model="registerForm.password" />
        <image :src="!showpassword ? eyeL : eyeG" @touchend="changeEye" class="eye" />
      </view>

      <view class="code-row">
        <input class="code-input" placeholder="验证码" v-model="registerForm.code" />
        <button @click="getCode" class="code-btn">获取验证码</button>
      </view>

      <button class="register-btn" @click="submit">立即注册</button>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.register-con {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .register-dialog {
    width: calc(100% - 80rpx);
    box-sizing: border-box;
    padding: 40rpx;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 3px 10px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .input-row {
      width: 100%;

      .input-label {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
      }

      position: relative;

      .eye {
        width: 60rpx;
        height: 50rpx;
        position: absolute;
        right: 16rpx;
        top: 59%;
        transform: translateY(-50%);
      }
    }

    .uni-input {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      border: 1px solid #ccc;
      border-radius: 12rpx;
      box-sizing: border-box;
      padding: 0 16rpx;
      margin-bottom: 20rpx;
    }

    .code-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .code-input {
        flex-basis: 70%;
        height: 100rpx;
        line-height: 100rpx;
        box-sizing: border-box;
        border: 1px solid #ccc;
        padding: 0 16rpx;
        border-top-left-radius: 12rpx;
        border-bottom-left-radius: 12rpx;
      }

      .code-btn {
        font-size: 24rpx;
        flex-basis: 30%;
        height: 100rpx;
        line-height: 100rpx;
        border: none;
        border-radius: 0 12rpx 12rpx 0 !important;
        color: #fff;
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);

        &::after {
          content: '';
          border: none;
        }
      }
    }

    .register-btn {
      width: 100%;
      height: 100rpx;
      margin-top: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);

      &::after {
        content: '';
        border: none;
      }
    }
  }
}
</style>
