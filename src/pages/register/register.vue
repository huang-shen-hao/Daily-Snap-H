<script lang="ts" setup>
import { sendEmailCode, registerAndsaveUserInfo } from '@/utils/api'
const registerForm = reactive({
  email: '',
  username: '',
  password: '',
  code: ''
})

const rules = reactive({
  username: [{ required: true, errorMessage: '请输入昵称', trigger: 'blur' }],
  email: {
    rules: [
      { required: true, errorMessage: '请输入邮箱', trigger: 'blur' },
      {
        validateFunction: function (rule: any, value: any, data: any, callback: any) {
          // eslint-disable-next-line no-useless-escape
          let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          if (!emailReg.test(value)) {
            callback('邮箱格式不正确，请重新填写')
          }
        }
      }
    ]
  },
  code: [{ required: true, errorMessage: '请输入', trigger: 'blur' }],
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, errorMessage: '密码长度在6-16位之间', trigger: ['blur', 'change'] }
    ]
  }
})

// 是否发二维码的tag
const codeTag = ref<boolean>(true)

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

const register = () => {
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
</script>
<template>
  <view class="login-con" @touchmove.stop.prevent="() => {}">
    <view class="header-img">
      <image
        class="img"
        src="https://trial-cdn.esign.cn/upload/304e1190-5d8a-57a2-8537-cd4871ef77ad!!4-24.png"
        mode="scaleToFill"
      />
    </view>
    <view class="login-form">
      <view class="main">
        <view class="welcome">欢迎来到</view>

        <uni-forms ref="formRef" :modelValue="registerForm" :rules="rules">
          <view class="form-item">
            <view class="label">昵称</view>
            <uni-forms-item name="username">
              <uni-easyinput v-model="registerForm.username" placeholder="请输入昵称" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item">
            <view class="label">邮箱</view>
            <uni-forms-item name="email">
              <uni-easyinput v-model="registerForm.email" placeholder="请输入邮箱" :clearable="false"> </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item">
            <view class="label">密码</view>

            <uni-forms-item name="password">
              <uni-easyinput v-model="registerForm.password" placeholder="请输入密码" :clearable="false">
              </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item code">
            <uni-forms-item name="code">
              <uni-easyinput v-model="registerForm.code" placeholder="请输入验证码" :clearable="false"> </uni-easyinput>
            </uni-forms-item>

            <view class="label" @click="getCode">获取验证码</view>
          </view>

          <view class="opt">
            <button @click="register">注册</button>
          </view>
        </uni-forms>
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.login-con {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #fffa9e 13%, #e5f0ff 100%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-top: 114rpx;
  padding-left: 24rpx;
  position: relative;

  .header-img {
    position: relative;
    z-index: 9;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .img {
      width: 670rpx;
      height: 484rpx;
    }
  }
  .login-form {
    width: 100%;
    position: relative;
    margin-top: 24rpx;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 51%;
      transform: translate(-50%, -50%);
      rotate: 2deg;
      transform-origin: center;
      width: 756rpx;
      height: 931rpx;
      background: #f4ed62;
      border-radius: 56rpx 0rpx 0rpx 56rpx;
    }
    .main {
      width: 100%;
      height: 920rpx;
      border-radius: 56rpx 0rpx 0rpx 56rpx;
      background: #fff;
      position: relative;
      z-index: 9;
      box-sizing: border-box;
      padding-top: 63rpx;
      padding-left: 48rpx;
      z-index: 9;
    }

    .welcome {
      position: relative;
      font-family:
        Alibaba PuHuiTi,
        Alibaba PuHuiTi;
      font-weight: 800;
      font-size: 64rpx;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      &::after {
        content: '';
        width: 318rpx;
        height: 65rpx;
        background-image: url('https://iili.io/3McNYIR.png');
        background-size: cover;
        position: absolute;
        left: 270rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
      padding-right: 48rpx;
      .label {
        width: 135rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx 20rpx 20rpx 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 32rpx;
        color: #333333;
        line-height: 56rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        box-sizing: border-box;
        padding-left: 8rpx;
      }

      :deep(.uni-forms-item) {
        margin-bottom: 0;
      }
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 455rpx;
        height: 96rpx;
        padding: 0 !important;
        border-radius: 20rpx 60rpx 60rpx 20rpx;
        input {
          width: 455rpx;
          height: 92rpx;
          border-radius: 20rpx 60rpx 60rpx 20rpx;
          background: #f6f6f6;

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
    }
    .form-item.code {
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 388rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        input {
          width: 388rpx;
          height: 96rpx;
          background: #f6f6f6;
          border-radius: 60rpx 60rpx 60rpx 60rpx;

          padding-left: 40rpx;
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
      .label {
        width: 202rpx;
        height: 96rpx;
        background: #f6f6f6;
        border-radius: 60rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 400;
        font-size: 28rpx;
        color: #da9000;
        line-height: 56rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
    .opt {
      margin-top: 40rpx;
      button {
        width: 615rpx;
        height: 120rpx;
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
  }
}
</style>
