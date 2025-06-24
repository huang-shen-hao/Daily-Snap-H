<template>
  <view class="my-con">
    <view class="header" @click="changeInfo">
      <image class="avatar" mode="aspectFit" :src="avatar || userInfo.avatar"></image>
      <view class="username">{{ username || userInfo.username }}</view>
      <view class="email">{{ email || userInfo.email }}</view>
    </view>

    <view class="center">
      <view class="center-main">
        <view class="title">备忘录</view>
        <view class="t1">欢迎来到Daily Snap！</view>
        <view class="line1"></view>
        <view class="t2">开始记事吧～</view>

        <view class="address">{{ district }}</view>
        <view class="weather">{{ realWeather?.temperature || '30' }}</view>
        <view class="line2"></view>
        <view class="date">{{ dayjs().format('YYYY年MM月DD日') }}</view>
        <image class="weather-icon" src="https://iili.io/3SdWvh7.png" mode="scaleToFill" />
      </view>
    </view>

    <view class="notice">
      <image class="icon" src="https://iili.io/3SdDRG1.png" mode="scaleToFill" />
      <text class="title">更新通告</text>
      <text class="content">Daily Snap 记录日常小碎片 v1.0上线啦！</text>
    </view>

    <view class="tool">
      <view class="tool-item" v-for="item in toolList" :key="item.name" @click="goPage(item.path)">
        <image class="icon" :src="item.icon" mode="scaleToFill" />
        <view class="name">{{ item.name }}</view>
      </view>
    </view>

    <view class="foot">
      <view class="foot-item" v-for="item in footList" :key="item.name" @click="goPage(item.path, item.type)">
        <button v-if="item.type === 'service'" class="name" open-type="contact">{{ item.name }}</button>
        <view v-else class="name">{{ item.name }}</view>
      </view>
    </view>
  </view>

  <my-tab-bar :selected="3" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import myTabBar from '@/components/my-tab-bar/index.vue'
import globalStore from '@/stores/global'
import { getAddress, removeArea } from '@/utils/tool'
import { getWeather } from '@/utils/api'
import { type realWeatherType } from '@/utils/interface'
const global = globalStore()

const { username, email, avatar } = toRefs(global.userInfo) // 响应式

const userInfo = uni.getStorageSync('user')

onShow(() => {
  uni.hideTabBar()
  global.$patch({
    previewTabIndex: 2
  })
  // console.log('userInfo', userInfo)
})

const province = ref<string>('***')
const city = ref<string>('***')
const district = ref<string>('***')

const realWeather = ref<realWeatherType>({
  aqi: '',
  direct: '',
  humidity: '',
  info: '',
  power: '',
  temperature: '30',
  wid: ''
})

const getLocation = async () => {
  const res = await getAddress()
  city.value = res.regeocode.addressComponent.city
  district.value = res.regeocode.addressComponent.district
  province.value = res.regeocode.addressComponent.province
  const area = removeArea(district.value)
  const param = {
    city: area,
    key: '089bd910f53a6b4f1405144db27dfbc2'
  }
  const weather = await getWeather(param)
  console.log('sssssssss', weather)
  realWeather.value = weather?.realtime
}

const toolList = [
  {
    icon: 'https://iili.io/3S2Aal1.png',
    path: '/pages/square/square',
    name: '留言板'
  },
  {
    icon: 'https://iili.io/3S2A0Hg.png',
    path: '/pages/square/square',
    name: '记账本'
  },
  {
    icon: 'https://iili.io/3S2AcUF.png',
    path: '/pages/square/square',
    name: '数据概览'
  }
]

const footList = [
  {
    type: 'service',
    name: '联系我们',
    path: ''
  },
  {
    type: 'page',
    name: '设置',
    path: '/pages/setting/setting'
  }
]

onMounted(() => {
  getLocation()
})

const goPage = (path: string, type?: string) => {
  if (type === 'service') return
  const bar = ['home', 'square', 'my']
  const isBar = bar.some(item => path.includes(item))
  if (isBar) {
    uni.switchTab({
      url: path
    })
  } else {
    uni.navigateTo({
      url: path
    })
  }
}

const changeInfo = () => {
  uni.navigateTo({
    url: '/pages/my/change-info'
  })
}
</script>

<style lang="scss" scoped>
.my-con {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #fffbeb 0%, #f6f6f6 37%);

  .header {
    width: 100%;
    height: 634rpx;
    background: url('https://iili.io/3SHjkp2.png') no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    padding-top: 200rpx;
    flex-direction: column;
    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
    }
    .username {
      margin-top: 16rpx;
      font-family:
        Alibaba PuHuiTi,
        Alibaba PuHuiTi;
      font-weight: bold;
      font-size: 32rpx;
      color: #333333;
      line-height: 48rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
    .email {
      margin-top: 8rpx;
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }

  .center {
    width: 100%;
    box-sizing: border-box;
    padding: 0 40rpx;
    margin-top: -152rpx;

    .center-main {
      width: 100%;
      height: 229rpx;
      background: url('https://daily-snap.oss-cn-hangzhou.aliyuncs.com/uploads/%E8%AE%B0%E4%BA%8B%E6%9C%AC%E8%83%8C%E6%99%AF%402x%20%282%29.png')
        no-repeat center;
      background-size: cover;
      position: relative;
      .title {
        position: absolute;
        left: 30rpx;
        top: 24rpx;
        height: 40rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 32rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
      .t1,
      .t2,
      .date {
        height: 40rpx;
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .t1 {
        position: absolute;
        left: 30rpx;
        top: 98rpx;
      }
      .t2 {
        position: absolute;
        left: 30rpx;
        top: 162rpx;
      }
      .address {
        position: absolute;
        left: 406rpx;
        top: 40rpx;
        height: 40rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 32rpx;
        color: #000000;
        line-height: 40rpx;
        letter-spacing: 1px;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
      .weather {
        position: absolute;
        left: 406rpx;
        top: 96rpx;
        height: 40rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 48rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
        &::after {
          content: '℃';
          position: absolute;
          right: -36rpx;
          bottom: -6rpx;
          font-family:
            Alibaba PuHuiTi,
            Alibaba PuHuiTi;
          font-weight: bold;
          font-size: 32rpx;
          color: #000000;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
      .weather-icon {
        top: 40rpx;
        position: absolute;
        left: 536rpx;
        width: 78rpx;
        height: 90rpx;
      }
      .date {
        position: absolute;
        left: 406rpx;
        top: 166rpx;
      }

      .line1,
      .line2 {
        position: absolute;
        width: 230rpx;
        height: 4rpx;
        background: url('https://iili.io/3SdOR1t.png') no-repeat center;
        background-size: cover;
      }
      .line1 {
        left: 30rpx;
        top: 150rpx;
      }
      .line2 {
        left: 406rpx;
        top: 154rpx;
      }
    }
  }

  .notice {
    width: calc(100% - 80rpx);
    margin: 0 auto;
    margin-top: 24rpx;
    box-sizing: border-box;
    height: 72rpx;
    background: #ffffff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 24rpx;
    .icon {
      width: 54rpx;
      height: 56rpx;
    }
    .title {
      width: 95rpx;
      font-family:
        Alibaba PuHuiTi,
        Alibaba PuHuiTi;
      font-weight: 500;
      font-size: 24rpx;
      color: #c9c011;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
      padding: 0 16rpx;
    }
    .content {
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }

  .tool {
    width: calc(100% - 80rpx);
    margin: 0 auto;
    margin-top: 24rpx;
    box-sizing: border-box;
    padding: 40rpx 74rpx;
    background: #ffffff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tool-item {
      .icon {
        width: 88rpx;
        height: 88rpx;
      }
      .name {
        width: 100%;
        height: 100%;
        margin-top: 8rpx;
        height: 40rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
  }

  .foot {
    width: calc(100% - 80rpx);
    margin: 0 auto;
    margin-top: 24rpx;
    box-sizing: border-box;
    padding: 20rpx 40rpx;
    background: #fff;
    border-radius: 40rpx;
    .foot-item {
      width: 100%;
      box-sizing: border-box;
      padding: 20rpx 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      &::after {
        content: '';
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: url('https://iili.io/3SFqxCF.png') no-repeat center;
        background-size: cover;
      }
      button {
        padding: 0;
        background: transparent;
        &::after {
          border: none;
        }
      }
      .name {
        width: 100%;
        height: 100%;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 500;
        font-size: 28rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>
