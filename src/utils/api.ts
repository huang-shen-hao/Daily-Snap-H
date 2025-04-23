import { request } from './request'
import { LoginForm, registerForm, weatherForm } from './interface'
import userStore from '../stores/user'

const user = userStore()
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

// 用户登录
export const login = (param: LoginForm) => {
  const { email, password } = param
  return request({
    url: 'api/ds-user/login',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      email,
      password
    }
  })
}

// 用户登录 -> 首页 -> 存用户信息
export const loginAndsaveUserInfo = async (param: LoginForm) => {
  const result = await login(param)
  if (result.code === 0) {
    const { data, jwt } = result.data
    console.log('表单数据信息：', data, jwt)
    const { id, email, username, avatar } = data
    user.$patch({
      userInfo: {
        id,
        email,
        username,
        avatar
      }
    })
    uni.setStorageSync('jwt', jwt)
    uni.showToast({
      title: '登录成功，3s后跳转到个人中心',
      icon: 'none',
      duration: 3000
    })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/my/my' })
    }, 3000)

    console.log('用户信息：', user.userInfo)
  }
}

// 获取天气
export const getWeather = (param: weatherForm) => {
  return request(
    {
      url: 'simpleWeather/query',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        ...param
      },
      isNormal: false
    },
    'http://apis.juhe.cn/'
  )
}
