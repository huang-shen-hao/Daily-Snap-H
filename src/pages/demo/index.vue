<template>
  <view class="con">
    <!-- -->
    <view class="calendar-con" :style="{ paddingTop: `${safe}px` }" :class="[flodStatus ? 'flod' : 'unflod']">
      <!-- 头部 -->
      <view class="calendar-header" :style="{ height: `${height + 30}px` }">
        <view class="date" :style="{ height: `${height}px` }"> {{ current.format('YY-MM-DD') }}</view>
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

      <view class="arrow" @click="flod">
        <image
          class="img"
          src="https://trial-cdn.esign.cn/upload/6ac29c9b-acbe-564d-a360-56dc68cec843!!7-11.png"
          alt=""
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { UseStatusHeight } from '@/hooks'
import dayjs from 'dayjs'
import { ref } from 'vue'

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
  // 获取本月第一天是周几（0-6，0是周日）
  const firstDay = dayjs(`${year}-${month}-01`)
  const weekOfFirst = firstDay.day()
  // 获取本月天数
  const daysInMonth = firstDay.daysInMonth()
  // 前面补齐
  const prevDays = []
  for (let i = weekOfFirst - 1; i >= 0; i--) {
    prevDays.push({
      date: dayjs(`${year}-${month}-01`)
        .subtract(i + 1, 'day')
        .format('YYYY-MM-DD'),
      isCurrentMonth: false,
      isToday: false
    })
  }
  // 本月天数
  const currentDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = dayjs(`${year}-${month}-${i}`).format('YYYY-MM-DD')
    currentDays.push({
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === dayjs().format('YYYY-MM-DD')
    })
  }
  // 后面补齐
  // 计算总格子数（6行*7列=42），减去已用的
  const total = 42
  const nextDays = []
  const remain = total - prevDays.length - currentDays.length
  for (let i = 1; i <= remain; i++) {
    nextDays.push({
      date: dayjs(`${year}-${month}-${daysInMonth}`).add(i, 'day').format('YYYY-MM-DD'),
      isCurrentMonth: false,
      isToday: false
    })
  }
  // 合并
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
  const current = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D')
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
  rebuildWeekList()
  weekList.value[currentIndex.value] = getWeekDays(
    chooseDate.value.year(),
    chooseDate.value.month() + 1,
    chooseDate.value.date()
  )
  console.log('changeChooseDate', weekList.value)
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

onLoad(() => {
  rebuildmonthList()
  rebuildWeekList()
  // console.log('=========M===========', monthList.value)
  // console.log('=========W==========', weekList.value)
})

const lastIndex = ref<number>(1) // 初始为1
const currentIndex = ref<number>(1) // 一共是 0 1 2 默认展示 1 下标数据
// 滑动切换事件
const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current
  // 判断滑动方向
  if ((lastIndex.value === 2 && currentIndex.value === 0) || currentIndex.value > lastIndex.value) {
    if (lastIndex.value === 0 && currentIndex.value === 2) {
      console.log('右滑')
      if (flodStatus.value) {
        chooseDate.value = chooseDate.value.subtract(7, 'day')
        weekList.value[currentIndex.value] = getWeekDays(
          chooseDate.value.year(),
          chooseDate.value.month() + 1,
          chooseDate.value.date()
        )
      } else {
        current.value = current.value.subtract(1, 'month')
        monthList.value[currentIndex.value] = getMonthDays(current.value.year(), current.value.month() + 1)
        chooseDate.value = current.value.startOf('month') // 月变化默认选中第一天
        rebuildWeekList()
        weekList.value[currentIndex.value] = getWeekDays(
          chooseDate.value.year(),
          chooseDate.value.month() + 1,
          chooseDate.value.date()
        )
      }
    } else {
      console.log('左滑')
      if (flodStatus.value) {
        chooseDate.value = chooseDate.value.add(7, 'day')
        weekList.value[currentIndex.value] = getWeekDays(
          chooseDate.value.year(),
          chooseDate.value.month() + 1,
          chooseDate.value.date()
        )
      } else {
        current.value = current.value.add(1, 'month')
        monthList.value[currentIndex.value] = getMonthDays(current.value.year(), current.value.month() + 1)
        chooseDate.value = current.value.startOf('month') // 月变化默认选中第一天

        rebuildWeekList()
        weekList.value[currentIndex.value] = getWeekDays(
          chooseDate.value.year(),
          chooseDate.value.month() + 1,
          chooseDate.value.date()
        )
        console.log('0000000000000000', currentIndex.value, weekList.value)
      }
    }
  } else if (currentIndex.value < lastIndex.value) {
    console.log('右滑')
    if (flodStatus.value) {
      chooseDate.value = chooseDate.value.subtract(7, 'day')
      weekList.value[currentIndex.value] = getWeekDays(
        chooseDate.value.year(),
        chooseDate.value.month() + 1,
        chooseDate.value.date()
      )
    } else {
      current.value = current.value.subtract(1, 'month')
      monthList.value[currentIndex.value] = getMonthDays(current.value.year(), current.value.month() + 1)
      chooseDate.value = current.value.startOf('month') // 月变化默认选中第一天
      rebuildWeekList()
      weekList.value[currentIndex.value] = getWeekDays(
        chooseDate.value.year(),
        chooseDate.value.month() + 1,
        chooseDate.value.date()
      )
    }
  }
  console.log('data', flodStatus.value ? weekList.value[currentIndex.value] : monthList.value[currentIndex.value])
  lastIndex.value = currentIndex.value // 重置为中间
}
</script>

<style lang="scss" scoped>
.con {
  box-sizing: border-box;
}
.calendar-con {
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  height: 660rpx;
  position: relative;
  transition: all 0.2s ease-in;
  overflow: hidden;

  &.flod {
    height: 240rpx;
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
    justify-content: center;
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
            background-color: #2c97c9;
          }

          &.today {
            border: 2rpx solid rgb(255, 255, 255);
          }
        }
      }
    }
  }
}
</style>
