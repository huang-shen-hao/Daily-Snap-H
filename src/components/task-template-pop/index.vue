<template>
  <uni-popup ref="templetePop" type="bottom" border-radius="10px 10px 0 0" :safe-area="false">
    <scroll-view class="scroll-main" scroll-y="true">
      <view v-for="(item, index) in templateList" :key="index" class="kind-item">
        <view class="kind">{{ item.kind }}</view>
        <view class="kind-main">
          <view class="card-item" v-for="card in item.sonList" :key="card.title" @click="onCardChoose(card)">
            <view class="tag">{{
              card.type === 'daily'
                ? '每日'
                : card.type === 'weekly'
                  ? '每周'
                  : card.type === 'monthly'
                    ? '每月'
                    : '不重复'
            }}</view>
            <view class="title">{{ card.title }}</view>
            <view v-for="(i, indexD) in card.detailList" :key="indexD" class="detail-item">{{ i }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </uni-popup>
</template>

<script setup lang="ts">
const templetePop = ref()

const show = () => {
  templetePop.value.open()
}
const close = () => {
  templetePop.value.close()
}

const templateList = [
  {
    kind: '生活',
    sonList: [
      {
        title: '房间整理',
        type: 'weekly',
        detailList: ['整理衣服', '清洁地面', '2书桌整理', '被单清洗']
      },
      {
        title: '个人护理',
        type: 'weekly',
        detailList: ['早晚刷牙', '脚底按摩', '修建指甲', '防晒涂抹']
      },
      {
        title: '理财计划',
        type: 'weekly',
        detailList: ['收支记录', '生活缴费', '存款3k']
      }
    ]
  },
  {
    kind: '学习',
    sonList: [
      {
        title: '英语学习',
        type: 'daily',
        detailList: ['背诵30个单词', '听力练习20分钟', '英语阅读1小时']
      },
      {
        title: '技能提升',
        type: 'daily',
        detailList: ['教学视频3小时', '力扣刷题1小时', '编程练习2小时']
      }
    ]
  },
  {
    kind: '健康',
    sonList: [
      {
        title: '每日运动',
        type: 'daily',
        detailList: ['30分钟慢跑/快走', '100个俯卧撑（分4组）', '3组深蹲（每组15次）', '2分钟平板支撑']
      },
      {
        title: '健康饮食',
        type: 'daily',
        detailList: ['不喝奶茶', '不吃甜品', '坚果/水果（2次）', '2000ml纯净水']
      },
      {
        title: '作息调整',
        type: 'daily',
        detailList: ['8:00起床', '午休1小时', '22:00睡觉']
      }
    ]
  }
]

const emit = defineEmits(['click'])

const onCardChoose = (card: any) => {
  emit('click', card)
}

defineExpose({
  show,
  close
})
</script>
<style lang="scss" scoped>
.scroll-main {
  width: 100%;
  height: 800rpx;
  background-color: #ffffff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;

  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  padding-right: 32rpx;
  padding-left: 32rpx;
  overflow: hidden;
  .kind-item {
    .kind {
      width: 80rpx;
      font-weight: 600;
      background-color: #2762a1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 30rpx;
      padding: 12rpx 24rpx;
      margin: 20rpx 0;
      font-size: 24rpx;
    }
    .kind-main {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20rpx;

      .card-item {
        height: 300rpx;
        background-color: #ecf9ff;
        border-radius: 20rpx;
        box-sizing: border-box;
        padding: 26rpx;
        position: relative;
        .tag {
          position: absolute;
          top: 20rpx;
          right: 20rpx;
          font-size: 18rpx;
          color: #fff;
          background-color: #007aff;
          padding: 6rpx 12rpx;
          border-radius: 30rpx;
        }
        .title {
          font-size: 28rpx;
          font-weight: 600;
          margin-bottom: 20rpx;
        }
        .detail-item {
          font-size: 24rpx;
          color: #666;
        }
        .title {
          font-size: 28rpx;
          font-weight: 600;
          margin-bottom: 20rpx;
        }
        .detail-item {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 14rpx;
        }
        // box-shadow: 4rpx 4rpx #007aff;
      }
    }
  }
}
</style>
