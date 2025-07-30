<template>
  <view class="add-container" :style="{ paddingTop: `${safePadding}px` }">
    <view class="task-name" :style="{ background: bkColor }">
      <textarea
        v-model="taskName"
        placeholder="请输入任务内容"
        :adjust-position="false"
        confirm-type="send"
        :auto-height="true"
        :auto-focus="true"
        :cursor-spacing="12"
      />
      <view class="palette">
        <view
          v-for="(item, index) in PALETTE"
          :key="item"
          class="palette-item"
          :class="{ active: currentColorIndex === index }"
          :style="{ background: item }"
          @click="changeCurrentColorIndex(index)"
        >
        </view>
      </view>
    </view>

    <view class="task-main">
      <view class="task-line" @click="openDate">
        <view class="label">
          <image
            class="icon"
            src="https://trial-cdn.esign.cn/upload/a208376d-190f-5322-8293-81d7e7cba089!!7-28.png"
            mode="widthFix"
          />
          <span>日期</span>
        </view>
        <view class="content">
          <span> {{ date }}</span>

          <image
            class="icon"
            src="https://trial-cdn.esign.cn/upload/4b0cbfc6-ed87-5f1f-b7e6-ee3b0e079989!!7-28.png"
            mode="widthFix"
          />
        </view>
      </view>

      <view class="task-line">
        <picker mode="time" :value="remindTime" start="00:00" end="24:00" @change="onRemindTimeChange">
          <view class="uni-input">{{ remindTime }}11</view>
        </picker>

        <view class="label">
          <image
            class="icon"
            src="https://trial-cdn.esign.cn/upload/05fb7fd8-c80d-5a00-87f8-b5f6e654a4fa!!7-28.svg"
            mode="widthFix"
          />
          <span>提醒</span>
        </view>
        <view class="content">
          <span> {{ remindTime ?? '无提醒' }}</span>

          <image
            class="icon"
            src="https://trial-cdn.esign.cn/upload/4b0cbfc6-ed87-5f1f-b7e6-ee3b0e079989!!7-28.png"
            mode="widthFix"
          />
        </view>
      </view>
    </view>

    <view class="complement-main">
      <view class="task-line">
        <view class="label">
          <image
            class="icon"
            src="https://trial-cdn.esign.cn/upload/12561c5b-50fe-51b7-86a7-3095eadddcb6!!7-28.svg"
            mode="widthFix"
          />
          <span>补充</span>
        </view>
      </view>

      <view class="complement-line" v-for="item in complement" :key="item.id">
        <image
          class="icon"
          src="https://trial-cdn.esign.cn/upload/3fde0759-a88e-55a6-9384-5e32ac41c2e0!!7-28.svg"
          mode="widthFix"
        />
        <textarea
          v-model="item.name"
          :adjust-position="false"
          confirm-type="send"
          :auto-height="true"
          :auto-focus="true"
          :cursor-spacing="12"
        />
      </view>

      <view class="add-line" @click="addComplement">
        <image
          class="icon"
          src="https://trial-cdn.esign.cn/upload/af1019ac-5c0a-5a1a-a695-f1965fb49e3a!!7-28.svg"
          mode="widthFix"
        />
        添加
      </view>

      <view class="clear-line" @click="clear">清空</view>
    </view>

    <button class="add-btn" @click="createTask">创建任务</button>

    <!-- 日期 -->
    <view class="task-date">
      <uni-datetime-picker ref="dateRef" type="date" v-model="date" @change="changeDate" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { formatYYMMDD, getThresholdTime } from '@/utils/tool'
import { addTask } from '@/utils/api'
import { UseStatusHeight } from '@/hooks'
import { PALETTE } from '@/constant'
const { safe, height } = UseStatusHeight()

const safePadding = computed(() => {
  return safe + height
})
const taskName = ref<string>('')
const date = ref<string>(formatYYMMDD())

const changeDate = (e: any) => {
  date.value = e
}

const dateRef = ref()
const openDate = () => {
  console.log('ppp', dateRef.value)
  dateRef.value.show()
}

const currentColorIndex = ref<number>(0)
const bkColor = ref<string>(PALETTE[0])

const changeCurrentColorIndex = (index: number) => {
  currentColorIndex.value = index
  bkColor.value = PALETTE[index]
}

const remindTime = ref<string | null>(null)

const onRemindTimeChange = (e: any) => {
  const selected = e.detail.value as string // e.g. "08:00"
  const [selH, selM] = selected.split(':').map(Number)
  console.log('ssss', selH, selM)
  // 构造一个今天 selH:selM 的 Date
  const now = new Date()
  const selDate = new Date(now)
  selDate.setHours(selH, selM, 0, 0)

  // 阈值
  const thresholdStr = getThresholdTime()
  const [thrH, thrM] = thresholdStr.split(':').map(Number)
  const thresholdDate = new Date(now)
  thresholdDate.setHours(thrH, thrM, 0, 0)

  if (selDate < thresholdDate) {
    // 选了太早的时间
    uni.showToast({
      title: `提醒时间需 ≥ 当前时间 + 5 分钟 (${thresholdStr})`,
      icon: 'none',
      duration: 3000
    })
  } else {
    // 合法，直接赋值
    remindTime.value = selected
  }

  console.log('最终提醒时间 =', remindTime.value)
}

// 任务的补充
const complement = ref<any[]>([])
const addComplement = () => {
  const id = new Date().getTime()
  console.log('888', id)
  complement.value.push({
    id,
    name: ''
  })
}
const clear = () => {
  complement.value = []
}

const createTask = async () => {
  const remind = remindTime.value ? true : false
  const res = await addTask(
    taskName.value,
    date.value,
    bkColor.value,
    remind,
    remindTime.value ?? '',
    false,
    complement.value
  )
  if (res.code === 0 && res.data) {
    uni.showToast({
      title: res.message,
      icon: 'none'
    })

    const pages = getCurrentPages()
    const pre = pages[pages.length - 2]
    console.log('0000', pre)

    uni.navigateBack({
      delta: 1,
      success: () => {
        pre.$vm.refreshData(date.value)
        // 清空
        taskName.value = ''
        date.value = formatYYMMDD()
        remindTime.value = ''
        complement.value = []
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.add-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding-left: 24rpx;
  padding-right: 24rpx;
  background: linear-gradient(180deg, #fffbeb 0%, #f6f6f6 37%);
  .task-name {
    margin-top: 20rpx;
    width: 100%;
    border-radius: 20rpx;
    border: 2rpx solid #808080;
    padding-bottom: 20rpx;
    box-sizing: border-box;

    textarea {
      width: 100%;
      min-height: 130rpx;
      border-radius: 20rpx;
      padding: 20rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      font-weight: 600;
    }
    .palette {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding-left: 20rpx;
      .palette-item {
        width: 38rpx;
        height: 38rpx;
        border-radius: 38rpx;
        margin-right: 18rpx;
        &.active {
          border: 6rpx solid #fff;
        }
      }
    }
  }
  .task-main,
  .complement-main {
    margin-top: 20rpx;
    width: 100%;
    border-radius: 20rpx;
    border: 2rpx solid #808080;

    background: #fff;
    box-sizing: border-box;
    padding: 20rpx;
    .task-line {
      width: 100%;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      position: relative;
      picker {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
      }
      .label {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .icon {
          width: 32rpx;
          margin-right: 12rpx;
        }
      }
      .content {
        font-weight: 500;
        color: #5f5f5f;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .icon {
          width: 24rpx;
          margin-left: 12rpx;
        }
      }
    }
  }
  .complement-main {
    padding: 20rpx 0;
    .task-line {
      padding: 0 20rpx 8rpx 20rpx;
      box-sizing: border-box;
      border-bottom: 2rpx solid #afafaf;
    }
    .complement-line {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 8rpx 20rpx;
      .icon {
        width: 32rpx;
        height: 32rpx;
        padding-right: 12rpx;
        transform: translateY(-4rpx);
      }
      textarea {
        width: 100%;
        padding: 6rpx 0;
        margin-bottom: 6rpx;
        color: #807a7f;
        font-weight: 500;
        font-size: 24rpx;
        border-bottom: 2rpx solid rgba(233, 233, 233, 0.65);
      }
    }
    .add-line {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 20rpx;
      .icon {
        width: 32rpx;
        height: 32rpx;
        padding-right: 12rpx;
      }
      color: #1a97eb;
      font-size: 24rpx;
    }
    .clear-line {
      width: calc(100% - 40rpx);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 60rpx;
      color: #131313;
      font-size: 24rpx;
      border-radius: 60rpx;
      border: 2rpx solid #da57d5;
    }
  }
  .add-btn {
    width: calc(100% - 48rpx);
    height: 80rpx;
    border-radius: 80rpx;
    background: #da57d5;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
  }
  .task-date {
    :deep(.uni-date-editor) {
      display: none;
    }
  }
}
</style>
