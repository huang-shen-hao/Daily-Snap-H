<template>
  <view class="calendar-container">
    <!-- 月份导航 -->
    <view class="month-nav">
      <text @click="prevMonth" class="nav-btn">上个月</text>
      <text>{{ currentYear }} - {{ currentMonth }}</text>
      <text @click="nextMonth" class="nav-btn">下个月</text>
    </view>

    <view class="calendar-table">
      <!-- 表头 周一到周日 -->
      <view class="calendar-header">
        <text>一</text>
        <text>二</text>
        <text>三</text>
        <text>四</text>
        <text>五</text>
        <text>六</text>
        <text>日</text>
      </view>

      <!-- 日期网格 -->
      <view class="calendar-grid">
        <view
          v-for="(cell, idx) in cells"
          :key="idx"
          class="calendar-cell"
          :class="{
            finished: cell.status === 'finished',
            partial: cell.status === 'partial',
            unfinished: !cell.status || cell.status === 'unfinished',
            void: !cell.day
          }"
        >
          <text>{{ cell.day }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getDailyTaskProcess } from '@/utils/api'

interface DailyResponse {
  date: string
  id: number
  documentId: string
  status_detail: string
  ds_task: {
    id: number
    documentId: string
    title: string
    type: string
  }
}

// 当前年月
const currentYear = ref<number>(new Date().getFullYear())
// const currentMonth = ref<number>(new Date().getMonth() + 1)
const currentMonth = ref<number>(6)

// 后端返回的当月任务状态列表
const detailList = ref<DailyResponse[]>([])

// 把 detailList 转成 date->status 快速查找表
const statusMap = computed<Record<string, string>>(() => {
  const m: Record<string, string> = {}

  detailList.value.forEach(item => {
    m[item.date] = item.status_detail
  })
  return m
})

// 每个格子的数据：{ day, status }
const cells = ref<{ day: number | string; status: string }[]>([])

// 获取后端数据
const fetchDetail = async () => {
  // 假设 taskId = 6，year/month 从状态里拿
  const res = await getDailyTaskProcess(6, String(currentYear.value), String(currentMonth.value))
  if (res.code === 0) {
    // backend 返回 { data: { shotsThisMonth: [...] } }
    detailList.value = res.data || []
    console.log('------------------------', detailList.value)
  } else {
    detailList.value = []
  }
}

// 生成日历格子
const generateCalendar = () => {
  const y = currentYear.value
  const m = currentMonth.value
  // 计算本月1号是周几 (0=周日, 1=周一)
  const first = new Date(y, m - 1, 1).getDay()
  // 周一为第一列 => 把 Sunday(0) 变成 6，其余 day-1
  const offset = first === 0 ? 6 : first - 1
  // 本月天数
  const daysInMonth = new Date(y, m, 0).getDate()
  const total = 42 // 6行×7列
  const arr: { day: number | string; status: string }[] = []

  for (let i = 0; i < total; i++) {
    const dayNum = i - offset + 1
    if (dayNum >= 1 && dayNum <= daysInMonth) {
      const mm = m < 10 ? '0' + m : String(m)
      const dd = dayNum < 10 ? '0' + dayNum : String(dayNum)
      const dateKey = `${y}-${mm}-${dd}`
      const status = statusMap.value[dateKey] || ''
      arr.push({ day: dayNum, status })
    } else {
      arr.push({ day: '', status: '' })
    }
  }

  cells.value = arr
  console.log('------', cells.value)
}

// 切换上一个月
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
}

// 切换下一个月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
}

// 当年月或列表变化时，重新拉数据和生成格子
watch([currentYear, currentMonth], async () => {
  await fetchDetail()
})
watch(detailList, generateCalendar)

// 首次加载
onLoad(async () => {
  await fetchDetail()
})
</script>

<style scoped lang="scss">
.calendar-container {
  padding-top: 200rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #fffbeb 0%, #f6f6f6 37%);
}
.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.nav-btn {
  font-size: 18px;
  padding: 0 10px;
}
.calendar-table {
  background: #fff;
  width: calc(100% - 96rpx);
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  margin: 0 auto;
  .calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 5px;
    gap: 18rpx;
  }
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 18rpx;
  }
  .calendar-cell {
    height: 40px;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .finished {
    background-color: #90ee90;
  }
  .partial {
    background-color: #ffff99;
  }
  .unfinished {
    background-color: rgba(238, 238, 238, 0.3);
  }
  .void {
    background-color: transparent;
  }
}
</style>
