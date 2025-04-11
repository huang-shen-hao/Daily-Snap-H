// // 异常提示文案
// const EXCEPTION_MSG = {
//   default: '服务异常，请稍后重试',
//   noData: '数据异常，请稍后重试',
//   504: '服务繁忙(504)，请稍后重试',
//   429: '服务繁忙，请稍后重试',
//   400: '服务异常，可尝试清除缓存后重试'
// }

// // 生成异常提示文案
// const genExceptionMsg = (code: number) => {
//   switch (code) {
//     case 400:
//       return EXCEPTION_MSG[400]
//     case 429:
//       return EXCEPTION_MSG[429]
//     case 504:
//       return EXCEPTION_MSG[504]
//     default:
//       return code ? `服务异常(${code})，请稍后重试` : EXCEPTION_MSG.default
//   }
// }

// interface RequestConfig extends UniApp.RequestOptions {
//   exceptHandle?: boolean
//   fullResponse?: boolean
//   ignoreCode?: boolean
//   fullRes?: boolean
//   hideToast?: boolean
//   closeRedirectToAuth?: boolean
//   tenantId?: ''
// }

// const SPECIAL_CODE = 70000100
// const DELAY_DURATION = 3000
// const CODE_200 = 200
// const CODE_401 = 401
// const CODE_0 = 0
// const CENTER_CODE = 10000023

// const { VITE_BASE_ENV: env, VITE_BASE_URL: baseUrl, VITE_APPID: appId } = import.meta.env

// const defaultHeaders = {
//   'Content-Type': 'application/json',
//   Accept: '*/*'
// }

// // 同一时间只弹出一个错误提示
// // 错误信息锁定标识
// let errLock = false
// let errTimer: ReturnType<typeof setTimeout> | null = null
// const handleLockErr = (errMsg: string) => {
//   // 如果没有锁定 就弹错误信息
//   if (errLock) return
//   errLock = true
//   void uni.showToast({
//     title: errMsg,
//     icon: 'none',
//     duration: DELAY_DURATION
//   })
//   if (errTimer) clearTimeout(errTimer)
//   errTimer = setTimeout(() => {
//     errLock = false
//   }, DELAY_DURATION)
// }

// export const request = <T = AnyObject>(requestConfig: RequestConfig, customBaseUrl: string = baseUrl) => {
//   const { method = 'POST', data = {}, header } = requestConfig
//   return new Promise<T>((resolve, reject) => {
//     uni.request({
//       ...requestConfig,
//       url: `${customBaseUrl}${requestConfig.url}`,
//       method,
//       data,
//       header: {
//         ...defaultHeaders,
//         Cookie: uni.getStorageSync('cookie'),
//         refer: '',
//         ...header
//       },
//       success: res => {
//         const { statusCode, data } = res
//         const header: AnyObj = res?.header
//         if (typeof data === 'string' || data instanceof ArrayBuffer) {
//           handleLockErr('非法的接口返回！')
//           return
//         }
//         const dataCode: number = data?.code ?? NaN
//         const message: string = data?.message ?? ''

//         // 保存 cookie
//         // 兼容部分windows电脑 微信小程序 返回header为小写的问题https://forward.esign.cn/mainBugManagement/edit?id=98&type=check
//         const setCookie: string = header['Set-Cookie'] || header['set-cookie']
//         if (setCookie) {
//           const cookie = setCookie
//             .split(';')
//             .map((x: string) => x.trim())
//             .filter(
//               (x: string) => !/^(Path)|(HttpOnly)|(Domain)|(Encode)|(Expires)|(MaxAge)|(SameSite)|(Secure)/.test(x)
//             )
//             .join('; ')
//           const key = requestConfig.url.includes('webserve') ? 'account-cookie' : 'cookie'
//           uni.setStorageSync(key, cookie)
//         }

//         if (statusCode === CODE_200) {
//           // 未登录拦截
//           if (dataCode === CODE_401) {
//             // 重置pinia store
//             // resetGlobalStore()
//             if (!requestConfig.closeRedirectToAuth) {
//               void uni.showToast({ title: '登录已过期,请重新登录', icon: 'none' }).then(() => {
//                 // 跳回登录页
//                 // setTimeout(() => {
//                 //   const url = useAuthUrl()
//                 //   void uni.redirectTo({
//                 //     url
//                 //   })
//                 //   uni.hideLoading()
//                 // }, 1500)
//               })
//             }
//             return reject(data)
//           }

//           if (requestConfig.ignoreCode) {
//             return resolve(<T>data)
//           } else if (dataCode === CODE_0 || dataCode === CENTER_CODE) {
//             return resolve(<T>(requestConfig.fullRes ? data : data.data))
//           } else {
//             const condition1 = dataCode === SPECIAL_CODE && requestConfig.exceptHandle // 特殊处理
//             const condition2 = dataCode === 1560005 // 隐藏loading并reject
//             const condition3 = [429, 10000021].includes(dataCode) // 请求过多
//             const condition4 = requestConfig.fullResponse // catch完整请求
//             const condition5 = !requestConfig.hideToast // 跳转错误捕获页
//             switch (true) {
//               case condition1: {
//                 const specialData = {
//                   code: SPECIAL_CODE,
//                   data: []
//                 }
//                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 // @ts-expect-error
//                 return resolve(specialData)
//               }
//               case condition2: {
//                 uni.hideLoading()
//                 return reject(message)
//               }
//               case condition3: {
//                 handleLockErr(EXCEPTION_MSG[429])
//                 return reject(EXCEPTION_MSG[429])
//               }
//               case condition4:
//                 return reject(data)
//               case condition5:
//                 handleLockErr(message)
//                 break
//             }
//             return reject(message)
//           }
//         } else {
//           const errMsg = genExceptionMsg(statusCode)
//           handleLockErr(errMsg)
//           return reject(errMsg)
//         }
//       },
//       fail: err => {
//         handleLockErr(EXCEPTION_MSG.default)
//         return reject(err)
//       }
//     })
//   })
// }

// export const formRequest = <T = AnyObject>(requestConfig: RequestConfig) => {
//   requestConfig.header = {
//     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//     ...requestConfig.header
//   }
//   return request<T>(requestConfig)
// }
