<template>
  <view class="my-con">
    <div class="custom-header">
      <view class="title">我的</view>
    </div>

    <view class="info">
      <view class="image-content">
        <image class="avatar" mode="aspectFit" :src="avatar || userInfo.avatar"></image>
      </view>
      <view class="user-info">
        <view class="username">{{ username || userInfo.username }}</view>
        <view class="email">{{ email || userInfo.email }}</view>
        <view class="address">{{ province }}{{ city }}{{ district }}</view>
      </view>
      <view class="weather">
        <view class="tem">{{ realWeather.temperature }}</view>
      </view>
    </view>

    <view class="notice" @click="getLocation"> 更新通告</view>

    <view class="fun">
      <view class="fun-main">
        <view class="fun-item" v-for="(item, index) in funList" :key="index">
          <image :src="item.icon" mode="aspectFit" />
          <view class="title">{{ item.title }}</view>
        </view>
      </view>
    </view>
  </view>
  <my-tab-bar :selected="3" />
</template>

<script setup lang="ts">
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
})

const funList = [
  {
    title: '留言板',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db756f79.png'
  },
  {
    title: '记账本',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db753adb.png'
  },
  {
    title: '备忘录',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db750668.png'
  },
  {
    title: '联系我们',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db74b5e0.png'
  },
  {
    title: '数据概览',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db6e89ec.png'
  },
  {
    title: '主题切换',
    icon: 'https://img.picui.cn/free/2025/04/22/68070db90e5d5.png'
  }
]

const province = ref<string>('***')
const city = ref<string>('***')
const district = ref<string>('***')

const realWeather = ref<realWeatherType>({
  aqi: '',
  direct: '',
  humidity: '',
  info: '',
  power: '',
  temperature: '',
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
  realWeather.value = weather.realtime
}

onMounted(() => {
  getLocation()
})
</script>

<style lang="scss" scoped>
.custom-header {
  width: 100%;
  padding: 30rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.my-con {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 24rpx 0;
  box-sizing: border-box;
  background: url('https://trial-cdn.esign.cn/upload/fe974d00-9025-5a3d-87a0-feacf470df55!!4-22.png') no-repeat center;
  background-size: cover;

  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .image-content {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;

      .avatar {
        width: 100%;
        height: 100%;
      }
    }

    .user-info {
      margin-left: 20rpx;

      .username {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;

        // padding-left: 36rpx;
        //   position: relative;
        //   &::before {
        //     content: '';
        //     width: 30rpx;
        //     height: 30rpx;
        //     position: absolute;
        //     left: 0;
        //     top: 50%;
        //     transform: translateY(-50%);
        //     background: url('https://trial-cdn.esign.cn/upload/d43b9ee4-e86a-5704-b7fb-aab85aa1037d!!4-22.svg') no-repeat
        //       center;
        //     background-size: cover;
        //   }
      }

      .email {
        margin-bottom: 8rpx;
        font-size: 24rpx;
        color: #666;
        position: relative;
        padding-left: 36rpx;

        &::before {
          content: '';
          width: 32rpx;
          height: 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background: url('https://trial-cdn.esign.cn/upload/52e79d52-ec82-507a-bc3a-9981b928e285!!4-22.svg') no-repeat
            center;
          background-size: cover;
        }
      }

      .address {
        font-size: 24rpx;
        color: #666;
        position: relative;
        padding-left: 36rpx;

        &::before {
          content: '';
          width: 32rpx;
          height: 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background: url('https://trial-cdn.esign.cn/upload/6e6ad9f1-4265-5c84-80ba-3731787bf9c8!!4-22.svg') no-repeat
            center;
          background-size: cover;
        }
      }
    }

    .weather {
      // background-color: red;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 130rpx;

      .tem {
        font-weight: 600;
        font-size: 80rpx;
        color: #da2121;
        position: relative;

        &::before {
          content: '℃';
          font-size: 20rpx;
          position: absolute;
          right: -30rpx;
          top: 70%;
          transform: translateY(-50%);
        }
      }
    }
  }

  .notice {
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    border-radius: 20rpx;
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 28rpx;
    color: #666;
    font-weight: 400;
    box-sizing: border-box;
    padding-left: 60rpx;
    position: relative;

    &::before {
      content: '';
      width: 36rpx;
      height: 24rpx;
      position: absolute;
      left: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      background: url('https://trial-cdn.esign.cn/upload/2056dfbb-ed3b-53f0-aa14-b2bfc68fec1c!!4-22.svg') no-repeat
        center;
      background-size: cover;
    }
  }

  .fun {
    width: 100%;
    margin-top: 30rpx;

    .fun-main {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 200rpx);
      grid-gap: 24rpx;
      width: 100%;

      .fun-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(-20deg, #3c46da 0%, #2e2699 100%);
        border-radius: 10rpx;

        image {
          width: 80rpx;
          height: 80rpx;
        }

        .title {
          font-size: 28rpx;
          color: #fff;
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>
