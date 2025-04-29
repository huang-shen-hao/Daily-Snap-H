import { wxGetAddress } from '@/utils/api'

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
