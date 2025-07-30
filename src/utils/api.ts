import { request } from './request'
import { LoginForm, registerForm } from './interface'
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

// 人机校验生成
export const generateCaptcha = () => {
  return request({
    url: 'api/captcha/generate',
    method: 'GET'
  })
}
// 人机校验验证
export const verifyCaptcha = (key: string, answer: string) => {
  return request({
    url: 'api/captcha/verify',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      key,
      answer
    }
  })
}

// 用户注册
export const register = (param: registerForm) => {
  return request({
    url: 'api/ds-user/register',
    method: 'POST',
    fullRes: true,
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

  const { data, message } = res
  if (!data) {
    uni.showToast({
      title: message,
      icon: 'none'
    })
    return
  }
  const { minimalUser, jwt } = data
  global.$patch({
    userInfo: {
      uuid: minimalUser.id,
      id: minimalUser.documentId,
      email: minimalUser.email,
      username: minimalUser.username,
      avatar: minimalUser.avatar
    }
  })
  uni.setStorageSync('jwt', jwt)
  uni.showToast({
    title: '登录成功',
    icon: 'none'
  })
  uni.switchTab({ url: '/pages/my/my' })
}

// 用户登录
export const login = (param: LoginForm) => {
  const { email, password } = param
  return request({
    url: 'api/ds-user/login',
    method: 'POST',
    fullRes: true,
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
  const { data, message } = result
  if (!data) {
    uni.showToast({
      title: message,
      icon: 'none'
    })
    return
  }
  const { user, jwt } = data
  global.$patch({
    userInfo: {
      uuid: user.id,
      id: user.documentId,
      email: user.email,
      username: user.username,
      avatar: user.avatar
    }
  })
  uni.setStorageSync('jwt', jwt)
  uni.showToast({
    title: '登录成功',
    icon: 'none'
  })
  uni.switchTab({ url: '/pages/my/my' })
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
    fullRes: true,
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
    url: 'api/upload',
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

// 获取地理位置
export const wxGetAddress = (longitude: number, latitude: number) => {
  return request({
    url: 'api/ds-user/getAddress',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      longitude,
      latitude
    }
  })
}

export const getWeather = (city: string) => {
  return request({
    url: 'api/ds-user/getWeather',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      city
    }
  })
}

// 获取天气
// export const getWeather = (param: weatherForm) => {
//   return request(
//     {
//       url: 'simpleWeather/query',
//       method: 'GET',
//       isNormal: false,
//       header: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       data: {
//         ...param
//       }
//     },
//     'http://apis.juhe.cn/'
//   )
// }

// 获取IP地址
export const getUserIp = () => {
  return uni.request({
    url: `https://www.mxnzp.com/api/ip/self?app_secret=${VITE_APP_SECRET}&app_id=${VITE_APP_ID}`,
    method: 'GET'
  })
}

// 高德地图逆向经纬度
// export const wxGetAddress = (longitude: number, latitude: number) => {
//   //根据传递进来经纬度进行反解析，调用的是高德给的方法
//   return request(
//     {
//       isNormal: false,
//       url: 'v3/geocode/regeo',
//       method: 'GET',
//       data: {
//         key: GD_KEY,
//         location: `${longitude},${latitude}`
//       }
//     },

//     'https://restapi.amap.com/'
//   )
// }

// 获取帖子列表
export const getPostList = () => {
  return request({
    url: 'api/ds-post/posts?page=1&pageSize=10',
    method: 'GET',
    fullRes: true,
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
    fullRes: true,
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
export const deletePostByPuid = (id: number) => {
  return request({
    url: `api/ds-post/delete?id=${id}`,
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
export const likePost = (id: number, userId: string) => {
  return request({
    url: 'api/ds-post-thumb/add',
    method: 'POST',
    fullRes: true,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      id,
      userId
    }
  })
}

// 取消赞
export const unLikePost = (id: number) => {
  return request({
    url: `api/ds-post-thumb/delete?id=${id}`,
    method: 'DELETE',
    fullRes: true,
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 获取用户所有任务
export const getUserAllTask = (date: string) => {
  return request({
    url: `api/ds-task/all?date=${date}`,
    method: 'GET',
    fullRes: true,
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

// 修改子任务
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
export const changeSubTaskStatus = (subTid: string, status: boolean, tid: number) => {
  return request({
    url: 'api/ds-sub-task/change',
    method: 'POST',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      subTid,
      status,
      tid
    }
  })
}

/**
 *
 * @param name 任务名
 * @param date 创建时间 YY-MM-DD
 * @param color 背景色
 * @param remind 是否提醒
 * @param haveRemind 是否已经提醒
 * @param complement 额外补充
 * @returns
 */
export const addTask = (
  name: string,
  date: string,
  color: string,
  remind: boolean,
  remind_time: string,
  haveRemind = false,
  complement: any[] = []
) => {
  return request({
    url: 'api/ds-task/add',
    method: 'POST',
    fullRes: true,
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    },
    data: {
      name,
      date,
      color,
      remind,
      remind_time,
      haveRemind,
      complement
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

export const getDailyTaskProcess = (taskId: number, year: string, month: string) => {
  return request({
    url: `api/ds-task-shot/getTaskShot?id=${taskId}&year=${year}&month=${month}`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 菜品接口
export const getCookCategory = () => {
  return request({
    url: 'api/ds-user/getCookCategory',
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 根据菜谱分类id获取菜谱列表
export const getCookListById = (cid: number, page = 1) => {
  return request({
    url: `api/ds-user/getCookListById?category_id=${cid}&page=${page}`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 根据菜谱id获取菜谱详情
export const getCookDetailById = (id: number) => {
  return request({
    url: `api/ds-user/getCookDetailById?id=${id}`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 模糊查询
export const getSearchData = (keyword: string, page = 1) => {
  return request({
    url: `api/ds-user/getSearchData?keyword=${keyword}&page=${page}`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}

// 分页获取壁纸
export const getWallPages = (page = 1) => {
  return request({
    url: `api/ds-wallpaper/getWallPages?pageSize=10&page=${page}`,
    method: 'GET',
    header: {
      Authorization: `Bearer ${uni.getStorageSync('jwt')}`
    }
  })
}
