interface RequestConfig extends UniApp.RequestOptions {
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
        // if (typeof data === 'string' || data instanceof ArrayBuffer) {
        //   throw new Error('非法的接口返回！')
        // }
        if (statusCode === CODE_200 || statusCode === CODE_0) {
          console.log('result', data)
          resolve(data as T)
        } else {
          reject(res)
        }
      }
    })
  })
}
