import { wxGetAddress } from '@/utils/api'
import globalStore from '../stores/global'
const global = globalStore()
export const getAddress = () => {
  return new Promise<AnyObject>((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84',
      geocode: true, //设置该参数为true可直接获取经纬度及城市信息
      success: async res => {
        const { latitude, longitude } = res
        console.log('latitude', latitude, longitude)
        const address = await wxGetAddress(longitude, latitude)

        resolve(address as AnyObject)
      },
      fail: err => {
        uni.showToast({
          title: '获取地址失败，将导致部分功能不可用',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 去除 区 县 市 名称
export const removeArea = (address: string) => {
  return address.replace(/(区|县|市)/g, '')
}

// 时间格式转换 createdAt: "2025-04-25T09:18:17.204Z" 例如2025-04-25 09:18:17
export const formatTime = (utcStr: string) => {
  const date = new Date(utcStr)

  // 加 8 小时（转东八区）
  const chinaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)

  // 格式化为 YYYY-MM-DD HH:mm:ss
  const pad = (num: any) => num.toString().padStart(2, '0')
  const year = chinaTime.getUTCFullYear()
  const month = pad(chinaTime.getUTCMonth() + 1) // 月份从 0 开始
  const day = pad(chinaTime.getUTCDate())
  const hours = pad(chinaTime.getUTCHours())
  const minutes = pad(chinaTime.getUTCMinutes())
  const seconds = pad(chinaTime.getUTCSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 清空信息
export const clearInfo = () => {
  global.$reset()
  // 清空本地存储的jwt
  uni.removeStorageSync('jwt')
  uni.removeStorageSync('user')
}

export const formatYYMMDD = (date = new Date()) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 5min后时间信息
export const getThresholdTime = (): string => {
  const d = new Date(Date.now() + 5 * 60 * 1000)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
