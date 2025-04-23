import { GD_KEY } from '@/constant/index' //这个就是你在第一步申请的key值
import AMapWX from '@/static/amap-wx.130.js'

const myAmapFun = new AMapWX({
  key: GD_KEY
})

// 高德地图逆向经纬度
export const wxGetAddress = (longitude: number, latitude: number) => {
  //创建一个实例化对象

  //根据传递进来经纬度进行反解析，调用的是高德给的方法
  return new Promise(resolve => {
    myAmapFun.getRegeo({
      location: `${longitude},${latitude}`,
      success: (res: unknown[]) => {
        resolve(res[0])
      },
      fail: () => {
        resolve(null)
      }
    })
  })
}

export const getAddress = () => {
  return new Promise<AnyObject>((resolve, reject) => {
    uni.getLocation({
      type: 'wgs84',
      geocode: true, //设置该参数为true可直接获取经纬度及城市信息
      success: async res => {
        const { latitude, longitude } = res
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
