<script setup lang="ts">
defineProps({
  // 这里可以定义 props
  selected: {
    type: Number,
    required: true
  }
})

const tabbarList = [
  {
    id: 0,
    pagePath: '/pages/home/home',
    text: '首页',
    iconPath: '../../static/image/home_before.svg',
    selectedIconPath: '../../static/image/home_after.svg'
  },
  {
    id: 1,
    pagePath: '/pages/square/square',
    text: '留言板',
    iconPath: '../../static/image/message_board_before.svg',
    selectedIconPath: '../../static/image/message_board_after.svg'
  },
  {
    id: 2,
    pagePath: '/pages/my/my',
    iconPath: '../../static/image/me_before.svg',
    selectedIconPath: '../../static/image/me_after.svg',
    text: '我的'
  }
]

const changeTabbar = (path: string) => {
  uni.switchTab({ url: path })
}
</script>
<template>
  <view class="custom-tab-bar">
    <view class="main">
      <view
        v-for="(item, index) in tabbarList"
        :key="index"
        class="tab-bar-item"
        :class="{ active: selected === index }"
        @click="changeTabbar(item.pagePath)"
      >
        <image class="icon" :src="selected === item.id ? item.selectedIconPath : item.iconPath" />
        <view class="text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.custom-tab-bar {
  width: calc(100% - 80rpx);
  height: 118rpx;
  border-radius: 40rpx;
  position: fixed;
  bottom: 68rpx;
  // bottom: calc(68rpx + constant(safe-area-inset-bottom));
  // bottom: calc(68rpx + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tab-bar-item {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(100% / 3);
      height: 100%;
      &.active {
        background: #333333;
        border-radius: 45rpx;
        .text {
          color: #fff;
        }
      }

      .icon {
        width: 67rpx;
        height: 67rpx;
        margin-bottom: 6rpx;
      }

      .text {
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 20rpx;
        color: #999999;
        line-height: 24rpx;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
    .tab-bar-item.active {
      .icon {
        width: 90rpx;
        height: 67rpx;
      }
    }
    .tab-bar-item:first-child.active {
      .icon {
        transform: translateX(6rpx);
      }
    }
    .tab-bar-item:nth-child(2).active {
      .icon {
        transform: translateX(8rpx);
      }
    }
    .tab-bar-item:nth-child(3).active {
      .icon {
        transform: translateX(4rpx);
      }
    }
  }
}
</style>
