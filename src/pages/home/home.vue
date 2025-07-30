<template>
  <view class="con">
    <!-- -->
    <view class="calendar-con" :style="{ paddingTop: `${safe}px` }" :class="[flodStatus ? 'flod' : 'unflod']">
      <!-- 头部 -->
      <view class="calendar-header" :style="{ height: `${height + 30}px` }">
        <view class="date" :style="{ height: `${height}px` }"> {{ current.format('YYYY-MM-DD') }}</view>
        <!-- 星期标题 -->
        <view class="calendar-week">
          <view class="calendar-cell" v-for="w in ['日', '一', '二', '三', '四', '五', '六']" :key="w">
            {{ w }}
          </view>
        </view>
      </view>
      <!-- 日历滑动区域 -->
      <swiper class="calendar-swiper" :current="swiperIndex" @change="onSwiperChange" :circular="true" :duration="200">
        <swiper-item v-for="(item, idx) in calendarList" :key="idx" class="swiper-item">
          <!-- 日历表格 -->
          <view class="calendar-table">
            <!-- 日期内容 -->
            <view class="calendar-date">
              <view
                class="calendar-cell"
                @click="changeChooseDate(date.date)"
                v-for="date in item"
                :key="date.date"
                :class="{
                  'current-month': date.isCurrentMonth,
                  'other-month': !date.isCurrentMonth,
                  today: date.isToday,
                  selected:
                    dayjs(date.date).date() === chooseDate.date() && dayjs(date.date).month() === chooseDate.month()
                }"
              >
                {{ date?.date.split('-')[2] }}
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <view class="back" @click="backToday">回到今日</view>

      <view class="arrow" @click="flod">
        <image
          class="img"
          src="https://trial-cdn.esign.cn/upload/6ac29c9b-acbe-564d-a360-56dc68cec843!!7-11.png"
          alt=""
        />
      </view>
    </view>
    <view class="add" @click="goAdd">
      <image
        class="icon"
        src="https://trial-cdn.esign.cn/upload/adc62c22-14ad-593c-ab2b-e43e87a576c6!!7-28.svg"
        mode="widthFix"
      />
    </view>
    <scroll-view
      class="task-list"
      scroll-y
      :style="{ background: `url(${bk}) no-repeat center` }"
      :class="[flodStatus ? 'flod' : 'unflod']"
    >
      <view v-for="item in taskList" :key="item.id" class="task-item">
        <view class="task-name">{{ item.name }}</view>
      </view>
    </scroll-view>
  </view>
  <my-tab-bar :selected="0" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'
import { formatYYMMDD } from '@/utils/tool'
import { UseStatusHeight } from '@/hooks'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { getUserAllTask } from '@/utils/api'

const bk = ref<string>('https://daily-snap.oss-cn-hangzhou.aliyuncs.com/ce3bc.jpg')

onShow(() => {
  uni.hideTabBar()
  bk.value = uni.getStorageSync('HOME_BK')
})

// 折叠状态 默认展开 展示月  折叠展开周
const flodStatus = ref<boolean>(false)
const flod = () => {
  flodStatus.value = !flodStatus.value
}

/**
 * 生成指定年月的日历数据，包含前后补齐空白
 * @param year 年份
 * @param month 月份（1-12）
 * @returns {Array} 日历数据数组，每个元素包含日期、是否当前月、是否今天
 */

const getMonthDays = (year: number, month: number) => {
  // 1. 准备基础变量
  // —— 当月第一天的 Day.js 对象
  const firstOfMonth = dayjs(new Date(year, month - 1, 1))
  // —— 本月第一天是周几（0-6，0=周日）
  const weekOfFirst = firstOfMonth.day()
  // —— 本月总天数
  const daysInMonth = firstOfMonth.daysInMonth()
  // —— “今天”的字符串，用于快速比对
  const todayStr = dayjs().format('YYYY-MM-DD')

  // 2. 前面补齐（当月第一天之前的上月尾部）
  const prevDays = []
  for (let i = weekOfFirst - 1; i >= 0; i--) {
    const d = firstOfMonth.subtract(i + 1, 'day')
    prevDays.push({
      date: d.format('YYYY-MM-DD'),
      isCurrentMonth: false,
      isToday: d.format('YYYY-MM-DD') === todayStr
    })
  }

  // 3. 本月天数
  const currentDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    const d = firstOfMonth.date(i)
    const dateStr = d.format('YYYY-MM-DD')
    currentDays.push({
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    })
  }

  // 4. 后面补齐（凑满 6 行 × 7 列 = 42 天）
  const totalSlots = 42
  const nextDays = []
  const slotsUsed = prevDays.length + currentDays.length
  const slotsToAdd = totalSlots - slotsUsed
  const lastOfMonth = firstOfMonth.date(daysInMonth) // 当月最后一天
  for (let i = 1; i <= slotsToAdd; i++) {
    const d = lastOfMonth.add(i, 'day')
    nextDays.push({
      date: d.format('YYYY-MM-DD'),
      isCurrentMonth: false,
      isToday: d.format('YYYY-MM-DD') === todayStr
    })
  }

  // 5. 合并返回
  return [...prevDays, ...currentDays, ...nextDays]
}

/**
 * 生成指定日期所在周的日历数据（周日-周六）
 * @param year 年份
 * @param month 月份（1-12）
 * @param day 当月的具体日期（1-31）
 * @returns {Array} 周日历数据数组，每个元素包含日期、是否当前月、是否今天
 */
const getWeekDays = (year: number, month: number, day: number) => {
  // 构造当前日期
  const current = dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD')
  // 获取该日是周几（0-6，0 是周日）
  const weekDay = current.day()
  // 计算本周的起始日期（周日）
  const startOfWeek = current.subtract(weekDay, 'day')

  const days = []
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, 'day')
    days.push({
      date: date.format('YYYY-MM-DD'),
      isCurrentMonth: date.month() + 1 === month,
      isToday: date.isSame(dayjs(), 'day')
    })
  }

  return days
}

const { safe, height } = UseStatusHeight()

// 当前显示的中间月份（默认本月）
const current = ref(dayjs())
// 点击事件 默认当天
const chooseDate = ref(dayjs())
// swiper当前index，始终保持在1（中间）
const swiperIndex = ref(1)

// 真正存三个月数据的数组
const monthList = ref<any>([])
const weekList = ref<any>([])

const calendarList = computed(() => {
  return flodStatus.value ? weekList.value : monthList.value
})

const changeChooseDate = (date: string) => {
  chooseDate.value = dayjs(date, 'YYYY-MM-DD')
  current.value = chooseDate.value
  rebuildWeekList()
  weekList.value[currentIndex.value] = getWeekDays(
    chooseDate.value.year(),
    chooseDate.value.month() + 1,
    chooseDate.value.date()
  )
  getTasks(chooseDate.value.format('YYYY-MM-DD'))
}

const lastIndex = ref<number>(1) // 初始为1
const currentIndex = ref<number>(1) // 一共是 0 1 2 默认展示 1 下标数据

const loadWeek = (idx: number) => {
  weekList.value[idx] = getWeekDays(chooseDate.value.year(), chooseDate.value.month() + 1, chooseDate.value.date())
}
const loadMonth = (idx: number) => {
  monthList.value[idx] = getMonthDays(current.value.year(), current.value.month() + 1)
}

// 根据模式和方向刷新数据
const updateView = (isNext: boolean) => {
  if (flodStatus.value) {
    // 周视图：每次 +- 7 天
    chooseDate.value = isNext ? chooseDate.value.add(7, 'day') : chooseDate.value.subtract(7, 'day')
    current.value = chooseDate.value
    loadWeek(currentIndex.value)
  } else {
    // 月视图：每次 +- 1 月
    current.value = isNext ? current.value.add(1, 'month') : current.value.subtract(1, 'month')
    // 月变更后，默认选中该月第一天
    chooseDate.value = current.value.startOf('month')
    rebuildWeekList() // 如果你在月视图下，还要重建周列表
    loadMonth(currentIndex.value)
    loadWeek(currentIndex.value) // 月视图下，也可能需要展示周条
  }
}

// swipe 事件
const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current

  // 计算环形滑动差值：0=未动/中间→中间，1=向右前进，2=向左后退
  const diff = (currentIndex.value - lastIndex.value + 3) % 3
  let isNext
  if (diff === 1) {
    // 正常向「右」或从末尾→头部
    isNext = true
  } else if (diff === 2) {
    // 正常向「左」或从头部→末尾，等同于向后退 1 步
    isNext = false
  } else {
    // 无移动或从中间来回
    isNext = null
  }

  if (isNext !== null) {
    updateView(isNext)
  }

  // 重置索引为中间，以便下次继续用环形差值判断
  lastIndex.value = currentIndex.value

  console.log('当前数据：', flodStatus.value ? weekList.value[currentIndex.value] : monthList.value[currentIndex.value])

  // 拉取任务或其他操作
  getTasks(chooseDate.value.format('YYYY-MM-DD'))
}

// 根据 current 值，重建三个月的数据
const rebuildmonthList = () => {
  const prev = current.value.subtract(1, 'month')
  const next = current.value.add(1, 'month')
  monthList.value = [
    getMonthDays(prev.year(), prev.month() + 1),
    getMonthDays(current.value.year(), current.value.month() + 1),
    getMonthDays(next.year(), next.month() + 1)
  ]
}

/**
 * 根据 reactive current 值，重建三周的数据
 * weekList.value = [上一周, 当前周, 下一周]
 */
const rebuildWeekList = () => {
  // 假设 current 是一个包含 dayjs 实例的 ref
  const prev = chooseDate.value.subtract(7, 'day')
  const next = chooseDate.value.add(7, 'day')

  weekList.value = [
    getWeekDays(prev.year(), prev.month() + 1, prev.date()),
    getWeekDays(chooseDate.value.year(), chooseDate.value.month() + 1, chooseDate.value.date()),
    getWeekDays(next.year(), next.month() + 1, next.date())
  ]
}

const taskList = ref<any[]>([])

// 获取任务列表
const getTasks = async (date: string) => {
  // 页面加载时的逻辑
  const res = await getUserAllTask(date)
  if (res.code === 0) {
    // 统计每个任务已完成的子任务数量
    taskList.value = res.data.map((task: any) => {
      const finish_count =
        Array.isArray(task.sub_tasks) && task.sub_tasks.length > 0
          ? task.sub_tasks.filter((sub: any) => sub.isComplete).length
          : 0
      return {
        ...task,
        finish_count
      }
    })
  }
}

// 新建任务完成时会有日期变化  优化
const refreshData = (date: string) => {
  current.value = dayjs(date)
  chooseDate.value = dayjs(date)
  getTasks(date)
  rebuildmonthList()
  rebuildWeekList()
  // 动态修改数据
  weekList.value[currentIndex.value] = weekList.value[1]
  monthList.value[currentIndex.value] = monthList.value[1]
}

// 主动暴露出去
defineExpose({ refreshData })

const backToday = () => {
  refreshData(dayjs().format('YYYY-MM-DD'))
}

onLoad(() => {
  rebuildmonthList()
  rebuildWeekList()
  // 获取任务列表
  getTasks(formatYYMMDD())
})

const goAdd = () => {
  uni.navigateTo({
    url: '/pages/home/add'
  })
}
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .add {
    width: 80rpx;
    height: 80rpx;
    background: #508ce7;
    border-radius: 10rpx;
    position: fixed;
    right: 24rpx;
    top: 80%;
    box-sizing: border-box;
    padding: 20rpx;
    z-index: 999;
    .icon {
      width: 100%;
      height: 100%;
    }
  }
}
.calendar-con {
  background-image: linear-gradient(120deg, rgba(59, 115, 211, 0.1) 0%, rgba(147, 221, 255, 0.2) 100%);
  height: 760rpx;
  position: relative;
  transition: all 0.2s ease-in;
  overflow: hidden;
  box-sizing: border-box;

  &.flod {
    height: 360rpx;
  }
  .back {
    position: absolute;
    bottom: 10rpx;
    right: 30rpx;
    padding: 10rpx 16rpx;
    background: #242424;
    color: #fff;
    font-size: 24rpx;
    border-radius: 20rpx;
  }
  .arrow {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    .img {
      width: 60rpx;
      height: 48rpx;
    }
  }
}
.calendar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 32rpx;
  font-weight: 600;
  box-sizing: border-box;
  padding: 0 24rpx;
  //   background: #a1c4fd;
  .date {
    width: 100%;
    // background: #c2e9fb;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .calendar-week {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 60rpx;
    gap: 10rpx;
    .calendar-cell {
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.calendar-swiper {
  height: 480rpx;
  .swiper-item {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 24rpx;
    .calendar-table {
      width: 100%;
      height: 100%;
      z-index: 9;
      .calendar-date {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 1fr);
        gap: 10rpx;
        .calendar-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8rpx;
          box-sizing: border-box;
          &.current-month {
            font-weight: 600;
            color: #000000;
          }
          &.other-month {
            color: #5c5b5b;
          }
          &.selected {
            background-color: rgba(74, 166, 209, 0.2);
          }

          &.today {
            border: 2rpx solid rgb(161, 175, 255);
          }
        }
      }
    }
  }
}

.task-list {
  height: calc(100vh - 760rpx);

  width: 100%;
  background-size: cover !important;
  padding: 30rpx;
  box-sizing: border-box;
  padding-bottom: 200rpx;
  // display: grid;
  // grid-template-columns: 1;
  // grid-auto-rows: 200rpx;

  &.flod {
    height: calc(100vh - 360rpx);
  }
  .task-item {
    background: #fff;
    height: 120rpx;
    width: 100%;
    border-radius: 24rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    .task-name {
      font-weight: 600;
      font-size: 32rpx;
    }
  }
}
</style>
