interface RequestConfig extends UniApp.RequestOptions {
  isNormal?: boolean //是否是普通请求
  ignoreCode?: boolean //忽略code
  exceptHandle?: boolean //异常处理
  fullRes?: boolean //返回完整的响应
  hideToast?: boolean //隐藏提示
  closeRedirectToLogin?: boolean //关闭重定向登录
}

const CODE_200 = 200 // 成功状态码
const CODE_0 = 0 // 成功状态码

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: '*/*'
}
const { VITE_BASE_URL: baseUrl } = import.meta.env

import globalStore from '../stores/global'
const global = globalStore()

export const request = <T = AnyObject>(requestConfig: RequestConfig, customBaseUrl: string = baseUrl) => {
  const { method = 'POST', data = {} } = requestConfig
  return new Promise<T>((resolve, reject) => {
    uni.request({
      header: {
        ...defaultHeaders
      },
      ...requestConfig,
      url: `${customBaseUrl}${requestConfig.url}`,
      method,
      data,

      success: res => {
        console.log(res)
        const { statusCode, data } = res
        if (typeof data === 'string' || data instanceof ArrayBuffer) {
          throw new Error('非法的接口返回！')
        }
        if (statusCode === 401) {
          // 清空登录状态
          global.$reset()
          // 清空本地存储的jwt
          uni.removeStorageSync('jwt')
          uni.removeStorageSync('user')
          uni.showToast({
            title: '登录信息已过期，请重新登录',
            icon: 'none',
            duration: 1500
          })

          setTimeout(() => {
            uni.redirectTo({ url: '/pages/login/login' })
          }, 2000)
          return
        }
        if (statusCode === CODE_200 || statusCode === CODE_0) {
          console.log('封装的', data)
          if (data.status === '1') return resolve(<T>data)
          if (data.result) return resolve(<T>data.result)
          return resolve(<T>(requestConfig.fullRes ? data : data.data))
        } else {
          reject(res)
        }
      }
    })
  })
}
