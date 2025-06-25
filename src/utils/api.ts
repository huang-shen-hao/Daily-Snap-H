import { request } from './request'
import { GD_KEY } from '@/constant/index' //这个就是你在第一步申请的key值
import { LoginForm, registerForm, weatherForm } from './interface'
import globalStore from '../stores/global'

const { VITE_APP_ID, VITE_APP_SECRET } = import.meta.env

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
  const { code, message } = res
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
    const { documentId, email, username, avatar, uuid } = data
    global.$patch({
      userInfo: {
        uuid: uuid,
        id: documentId,
        email,
        username,
        avatar
      }
    })
    uni.setStorageSync('jwt', jwt)
    uni.showToast({
      title: '登录成功',
      icon: 'none'
    })

    uni.switchTab({ url: '/pages/my/my' })
  } else {
    const { message } = result
    uni.showToast({
      title: message || '登录失败',
      icon: 'none',
      duration: 2000
    })
  }
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: `api/ds-user/getUserInfo`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 修改用户信息
export const updateUserInfo = (id: string, username: string, avatar: string) => {
  return request({
    url: `api/ds-user/updateUserInfo`,
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      id,
      username,
      avatar
    }
  })
}

// 上传OSS图片
export const uploadOss = (files: File) => {
  return request({
    url: 'api/upload/',
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      files
    }
  })
}

// 获取天气
export const getWeather = (param: weatherForm) => {
  return request(
    {
      url: 'simpleWeather/query',
      method: 'GET',
      isNormal: false,
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

// 高德地图逆向经纬度
export const wxGetAddress = (longitude: number, latitude: number) => {
  //根据传递进来经纬度进行反解析，调用的是高德给的方法
  return request(
    {
      isNormal: false,
      url: 'v3/geocode/regeo',
      method: 'GET',
      data: {
        key: GD_KEY,
        location: `${longitude},${latitude}`
      }
    },

    'https://restapi.amap.com/'
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

// 点赞
export const likePost = (postId: string, userId: string) => {
  return request({
    url: 'api/ds-post-thumb/add',
    method: 'POST',
    fullRes: true,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      postId,
      userId
    }
  })
}

// 取消赞
export const unLikePost = (postId: string, userId: string) => {
  return request({
    url: `api/ds-post-thumb/delete?postId=${postId}&userId=${userId}`,
    method: 'DELETE',
    fullRes: true,
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 获取用户所有任务
export const getUserAllTask = () => {
  return request({
    url: 'api/ds-task/all',
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 添加子任务
export const AddSubTask = (taskId: string, title: string) => {
  return request({
    url: 'api/ds-sub-task/add',
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      taskId,
      title
    }
  })
}

// 删除子任务
export const RemoveSubTask = (id: string) => {
  return request({
    url: `api/ds-sub-task/removeById?subTid=${id}`,
    method: 'DELETE',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 删除子任务
export const UpdateSubTask = (id: string, title: string) => {
  return request({
    url: `api/ds-sub-task/changeTitle`,
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      id,
      title
    }
  })
}

// 子任务完成状态
export const changeSubTaskStatus = (subTid: string, status: boolean) => {
  return request({
    url: 'api/ds-sub-task/change',
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      subTid,
      status
    }
  })
}

// 创建任务
export const AddTask = (title: string, type: string) => {
  return request({
    url: 'api/ds-task/add',
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      title,
      type
    }
  })
}

// 删除任务
export const RemoveTaskById = (id: string) => {
  return request({
    url: `api/ds-task/removeById?id=${id}`,
    method: 'DELETE',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 批量创建子任务
export const AddSubTasks = (taskId: number, titles: string[]) => {
  return request({
    url: 'api/ds-sub-task/add-batch',
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      taskId,
      titles
    }
  })
}

// 菜品接口
export const getCookCategory = () => {
  return uni.request({
    url: `https://www.mxnzp.com/api/cookbook/category?app_secret=${VITE_APP_SECRET}&app_id=${VITE_APP_ID}&category_id=2`,
    method: 'GET'
  })
}

// 根据菜谱分类id获取菜谱列表
export const getCookListById = (cid: number, page = 1) => {
  return uni.request({
    url: `https://www.mxnzp.com/api/cookbook/list/category?app_secret=${VITE_APP_SECRET}&app_id=${VITE_APP_ID}&category_id=${cid}&page=${page}`,
    method: 'GET'
  })
}

// 根据菜谱id获取菜谱详情
export const getCookDetailById = (fid: number) => {
  return uni.request({
    url: `https://www.mxnzp.com/api/cookbook/details?app_secret=${VITE_APP_SECRET}&app_id=${VITE_APP_ID}&id=${fid}`,
    method: 'GET'
  })
}

// 模糊查询
export const getSearchData = (key: string, page = 1) => {
  return uni.request({
    url: `https://www.mxnzp.com/api/cookbook/search?app_secret=${VITE_APP_SECRET}&app_id=${VITE_APP_ID}&keyword=${key}&page=${page}`,
    method: 'GET'
  })
}
