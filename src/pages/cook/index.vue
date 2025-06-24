<template>
  <view class="cook-home">
    <view class="head">
      <view class="search">
        <uni-easyinput v-model="cookName" placeholder="今天想吃啥"></uni-easyinput>
        <button class="btn" @click="search">搜索</button>
      </view>
      <view class="cook-menu">
        <view
          class="cook-item"
          :class="categoryId === item.id ? 'active' : ''"
          v-for="item in cookCategory"
          :key="item.id"
          @click="changeCookCategory(item.id)"
          >{{ item.name }}</view
        >
      </view>
    </view>

    <scroll-view class="food-main" :scroll-y="true" @scrolltolower="getMoreFood">
      <view v-for="item in cookList" class="food-item" :key="item.id" @click="goDeatilPage(item.id, item.cover)">
        <image class="poster" :src="item.cover" />
        <view class="info">
          <view class="name">{{ item.name }}</view>
          <view class="desc">{{ item.desc || '好吃到爆炸' }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
  <my-tab-bar :selected="2" />
</template>

<script setup lang="ts">
import { getCookCategory, getCookListById } from '@/utils/api'
import myTabBar from '@/components/my-tab-bar/index.vue'

const cookName = ref<string>('')

interface ICookCategory {
  id: number
  name: string
  floor: string
}
interface IIngredientItem {
  name: string
}
interface ICookList {
  id: number
  name: string
  desc: string
  cover: string
  ingredient: IIngredientItem[]
}

const categoryId = ref<number>(3)
const cookCategory = ref<ICookCategory[]>([])
const cookList = ref<ICookList[]>([])
const currentPage = ref<number>(1)

const changeCookCategory = (id: number) => {
  categoryId.value = id
  currentPage.value = 1
  getCookList(categoryId.value, 1)
}

const getCookList = async (cid: number, page: number) => {
  const resC = await getCookListById(cid, page)
  cookList.value = resC.data.data.list
}

onLoad(() => {
  getCookCategory().then(async (res: any) => {
    cookCategory.value = res.data.data
    getCookList(categoryId.value, 1)
  })
})

const loading = ref(false)
const finished = ref(false)

const getMoreFood = async () => {
  // 如果正在加载或已经加载完毕，直接返回
  if (loading.value || finished.value) return

  loading.value = true
  try {
    const resC = await getCookListById(categoryId.value, currentPage.value)
    // 兼容后端返回格式
    const list = Array.isArray(resC?.data?.data?.list) ? resC.data.data.list : []
    // 如果本次返回没有数据，说明到底了
    if (list.length === 0) {
      finished.value = true
      uni.showToast({
        title: '没有更多啦~',
        icon: 'none'
      })
    } else {
      cookList.value = cookList.value.concat(list)
      currentPage.value++ // 只有有数据时才自增页码
    }
    console.log('加载更多', cookList.value)
  } catch (e) {
    // 错误处理
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

const goDeatilPage = (id: number, cover: string) => {
  uni.navigateTo({
    url: `/pages/cook/detail?id=${id}&cover=${encodeURIComponent(cover)}`
  })
}

const search = () => {
  if (!cookName.value) {
    uni.showToast({
      title: '查询内容不能为空',
      icon: 'none'
    })
  }
  uni.navigateTo({
    url: `/pages/cook/search?key=${cookName.value}`
  })
}

onShow(() => {
  uni.hideTabBar()
})

const share = () => {
  return {
    title: '美味菜肴', //标题
    path: '/pages/cook/index' //路径
  }
}

onShareAppMessage(share)
</script>

<style lang="scss" scoped>
.cook-home {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .head {
    width: 100%;
    height: 310rpx;
    background: #ffffff;
    padding-top: 170rpx;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    .search {
      box-sizing: border-box;
      padding: 0 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      button::after {
        border: none;
      }
      .btn {
        position: absolute;
        z-index: 99;
        top: 50%;
        transform: translateY(-50%);
        right: 40rpx;

        width: 160rpx;
        height: 80rpx;
        background: #f9f26d;
        border-radius: 60rpx 60rpx 60rpx 60rpx;
        font-family:
          Alibaba PuHuiTi,
          Alibaba PuHuiTi;
        font-weight: 800;
        font-size: 32rpx;
        color: #333333;
        font-style: normal;
        text-transform: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :deep(.uni-easyinput),
      :deep(.uni-easyinput__content) {
        width: 100%;
        height: 96rpx;
        padding: 0 !important;
        border-radius: 60rpx;
        .uni-easyinput__placeholder-class {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #999999;
          line-height: 56rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
        input {
          width: 455rpx;
          height: 92rpx;
          border-radius: 60rpx;
          background: #f6f6f6;
          font-size: 28rpx !important;
          padding-left: 40rpx !important;
          &::placeholder {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 400;

            color: #999999;
            line-height: 56rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }
      }
    }
    .cook-menu {
      box-sizing: border-box;
      margin-top: 24rpx;
      padding: 0 24rpx;
      width: 100%;
      display: grid;
      gap: 16rpx;
      grid-template-rows: repeat(2, 72rpx);
      grid-template-columns: repeat(4, 1fr);
      .cook-item {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 72rpx;
        &.active {
          background: #9da3f1;
          color: #fff;
        }
      }
    }
  }

  .food-main {
    width: 100%;
    height: calc(100vh - 480rpx);
    box-sizing: border-box;
    padding: 0 24px;
    overflow: hidden;
    .food-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 24rpx;
      .poster {
        flex-shrink: 0;
        width: 120rpx;
        height: 120rpx;
        border-radius: 10rpx;
      }
      .info {
        display: flex;
        height: 120rpx;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-left: 14rpx;
        .name {
          font-size: 28rpx;
          font-weight: 600;
        }
        .desc {
          font-size: 24rpx;
          margin-top: 6rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1; /* 控制显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .desc {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 控制显示的行数 */
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
