<template>
  <view class="cook-detail">
    <view class="head">
      <view class="food-name">{{ detailData?.name }}</view>
      <image class="poster" :src="cover" mode="aspectFill" />

      <view class="food-tip"><span class="label">注意事项：</span>{{ detailData?.tips || '美食需要用心去做哦~' }}</view>
      <view class="food-time"><span class="label">烹饪时间：</span>{{ detailData?.duration }}</view>
      <view class="food-difficulty"><span class="label">难易程度：</span>{{ detailData?.difficulty }}</view>
      <view class="food-ingredient">
        <view class="label">原料：</view>
        <view v-for="item in detailData?.ingredient" :key="item.name" class="ingredient-item">
          <span class="name">{{ item.name }}</span>
          <span class="amount">{{ item.amount }}</span>
        </view>
      </view>
      <view class="food-step">
        <view class="label">步骤：</view>
        <view v-for="(item, index) in detailData?.instruction" :key="item.text" class="food-step-item">
          <view class="step-info">{{ index + 1 }}. {{ item.text }}</view>
          <image class="step-img" :src="item.url" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getCookDetailById } from '@/utils/api'

interface RecipeIngredient {
  name: string
  amount: string
}

interface RecipeInstruction {
  text: string
  url: string
}

interface RecipeData {
  commentCount: number
  difficulty: string
  duration: string
  id: number
  ingredient: RecipeIngredient[]
  instruction: RecipeInstruction[]
  name: string
  tips: string
}

const detailData = ref<RecipeData>()

const getFoodDetail = async (fid: number) => {
  const res = await getCookDetailById(fid)
  detailData.value = res.data?.data
  console.log('---------------', detailData.value)
}

const cover = ref<string>('')
const id = ref<number>()
onLoad(query => {
  console.log('0000', query)
  cover.value =
    decodeURIComponent(query?.cover) || 'https://daily-snap.oss-cn-hangzhou.aliyuncs.com/20220104083906_7e9d0.jpg'
  id.value = query?.id
  getFoodDetail(query?.id)
})

const share = () => {
  return {
    title: detailData.value?.name || '美食', //标题
    url: `/pages/cook/detail?id=${id.value}&cover=${encodeURIComponent(cover.value)}`
  }
}

onShareAppMessage(share)
</script>

<style lang="scss" scoped>
.cook-detail {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.head {
  width: 100%;

  padding: 180rpx 24rpx 0 24rpx;
  box-sizing: border-box;
  .poster {
    width: 100%;
    height: 500rpx;
    border-radius: 20rpx;
  }
  .food-name {
    font-size: 42rpx;
    font-weight: 600;
    margin-bottom: 20rpx;
  }
  .food-tip,
  .food-time,
  .food-difficulty {
    font-size: 36rpx;
    margin-top: 20rpx;
    .label {
      font-weight: 600;
    }
  }
  .food-ingredient {
    margin-top: 20rpx;
    font-size: 36rpx;
    .label {
      font-weight: 600;
    }
    .ingredient-item {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 20rpx;
      margin-top: 16rpx;
      &::before {
        content: '·';
        font-weight: 600;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .name {
        display: flex;
        height: 100%;
        align-items: center;
        font-size: 32rpx;
      }
      .amount {
        display: flex;

        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }
  }
  .food-step {
    margin-top: 20rpx;
    font-size: 36rpx;
    .label {
      font-weight: 600;
    }
  }
  .food-step-item {
    .step-info {
      font-size: 32rpx;
      line-height: 42rpx;
      padding: 10rpx 0;
    }
    .step-img {
      width: 100%;
      height: 500rpx;
      border-radius: 20rpx;
    }
  }
}
</style>
