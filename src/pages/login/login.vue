<script setup lang="ts">
import { type LoginForm } from '../../utils/interface'
import { loginAndsaveUserInfo } from '../../utils/api'
const form = reactive<LoginForm>({
  email: '1467788588@qq.com',
  password: '123456789'
})

const rules = reactive({
  email: {
    rules: [
      { required: true, errorMessage: '请输入邮箱', trigger: 'blur' },
      { type: 'email', errorMessage: '邮箱格式不正确', trigger: ['blur', 'change'] }
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
</script>
<template>
  <view class="login-con">
    <view class="login-form">
      <uni-forms ref="formRef" :modelValue="form" label-position="top" :rules="rules">
        <uni-forms-item label="邮箱" name="email">
          <uni-easyinput prefixIcon="search" v-model="form.email"> </uni-easyinput>
        </uni-forms-item>

        <uni-forms-item label="密码" name="password">
          <uni-easyinput prefixIcon="search" v-model="form.password"> </uni-easyinput>
        </uni-forms-item>

        <view class="opt">
          <button @click="submitForm">登录</button>
          <button @click="goRegister">注册</button>
        </view>
      </uni-forms>
    </view>
  </view>
</template>
<style scoped lang="scss">
.login-con {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 48rpx;
  .login-form {
    width: 100%;
    .opt {
      display: flex;
      justify-content: space-between;
      margin-top: 20rpx;
      button {
        width: 48%;
        height: 80rpx;
        background-color: #007aff;
        color: #fff;
        border-radius: 10rpx;
        text-align: center;
        line-height: 80rpx;
      }
    }
  }
}
</style>
