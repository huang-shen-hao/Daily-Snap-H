import { request } from './request'
import { registerForm } from './interface'
// 邮箱验证码发送
export const sendEmailCode = (email: string) => {
  return request({
    url: 'api/ds-user/send-email-code',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      email
    }
  })
}

// 用户注册
export const register = (param: registerForm) => {
  return request({
    url: 'api/ds-user/register',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      ...param
    }
  })
}

// 注册 -> 首页 -> 存用户信息
export const registerAndsaveUserInfo = async (param: registerForm) => {
  const res = await register(param)
  const { code, message } = res.data
  if (code === 0) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/home/home' })
    }, 3000)
  }
  if (code === 400) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  }
}
