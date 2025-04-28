import { request } from './request'
import { LoginForm, registerForm, weatherForm } from './interface'
import globalStore from '../stores/global'

const global = globalStore()
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
  console.log('登录结果：', result)
  if (result.code === 0) {
    const { data, jwt } = result.data
    const { documentId, email, username, avatar } = data
    global.$patch({
      userInfo: {
        id: documentId,
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
  } else {
    const { message } = result
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
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
      }
    },
    'http://apis.juhe.cn/'
  )
}

// 获取帖子列表
export const getPostList = () => {
  return request({
    url: 'api/ds-post/posts?page=1&pageSize=10',
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 回复贴
export const replyPost = (content: string, pid: string, author: string) => {
  return request({
    url: 'api/ds-post/add',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      content,
      pid,
      author,
      type: 'reply'
    }
  })
}

// 删除贴
export const deletePostByPuid = (puid: string) => {
  return request({
    url: `api/ds-post/delete?puid=${puid}`,
    method: 'DELETE',
    fullRes: true,
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 发贴
export const addPost = (title: string, content: string, author: string) => {
  return request({
    url: `api/ds-post/add`,
    method: 'POST',
    fullRes: true,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      title,
      content,
      author
    }
  })
}
