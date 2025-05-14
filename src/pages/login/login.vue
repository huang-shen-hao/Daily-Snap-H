<script setup lang="ts">
import { type LoginForm } from '../../utils/interface'
import { loginAndsaveUserInfo } from '../../utils/api'
import { clearInfo } from '../../utils/tool'

const form = reactive<LoginForm>({
  email: '1467788588@qq.com',
  password: '123456789'
})

const rules = reactive({
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
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码', trigger: 'blur' }
      // { min: 6, max: 16, errorMessage: '密码长度在6-16位之间', trigger: ['blur', 'change'] }
    ]
  }
})

const formRef = ref()

const submitForm = () => {
  formRef.value
    .validate()
    .then(async () => {
      await loginAndsaveUserInfo(form)
    })
    .catch((err: any) => {
      console.log('表单错误信息：', err)
    })
}

const goRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}

onShareAppMessage(() => {
  return {
    title: '登录',
    path: 'pages/login/login'
    // imageUrl: '/static/logo.png'
  }
})

// 判断如果本地有token，则跳转到首页，否则跳转到登录页
onLoad(() => {
  const token = uni.getStorageSync('jwt')
  if (token) {
    uni.switchTab({
      url: '/pages/my/my'
    })
  }
})
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
        <view class="welcome">
          <image src="https://iili.io/3S9B0FV.png" mode="scaleToFill" />
        </view>

        <uni-forms ref="formRef" :modelValue="form" :rules="rules">
          <view class="form-item">
            <view class="label">邮箱</view>
            <uni-forms-item name="email">
              <uni-easyinput v-model="form.email" :clearable="false"> </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="form-item">
            <view class="label">密码</view>

            <uni-forms-item name="password">
              <uni-easyinput v-model="form.password" :clearable="false"> </uni-easyinput>
            </uni-forms-item>
          </view>

          <view class="opt">
            <button class="login" @click="submitForm">登录</button>
            <button class="register" @click="goRegister">注册</button>
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
  padding-left: 40rpx;
  position: relative;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-image: url('https://trial-cdn.esign.cn/upload/34b83f80-d745-50bf-89c5-cf2b27e90f8f!!4-24.svg');
    left: 0;
    top: 0;
    position: absolute;
  }
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
    z-index: 9;
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
      padding-right: 48rpx;
      z-index: 9;
      &::after {
        content: '';
        background: url('https://iili.io/3MgSuhN.png') no-repeat center;
        background-size: cover;
        width: 595rpx;
        height: 150rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        z-index: 2;
      }
    }

    .welcome {
      width: 609rpx;
      image {
        height: 65rpx;
      }
    }
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
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
      :deep(.is-input-border) {
        border: none;
      }
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 455rpx;
        height: 96rpx;
        padding: 0 !important;
        border-radius: 20rpx 60rpx 60rpx 20rpx;
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
      button::after {
        border: none;
      }
      .register {
        background: transparent;
        border: 2rpx solid #d3ca12;
        margin-top: 40rpx;
      }
    }
  }
}
</style>
