<template>
  <view class="container">
    <view class="header">
      <view class="left">
        <view class="title">我的待办事项</view>
        <view class="desc">轻松管理您的日常任务</view>
      </view>
      <view class="add-btn" @click="showCreateDialog">+ 任务</view>
    </view>
    <view class="main">
      <image
        v-if="taskList.length === 0"
        class="empty-image"
        src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/uploads/null.webp"
      />

      <swiper
        v-else
        class="task-con"
        :current="currentIndex"
        @change="swiperChange"
        display-multiple-items="1"
        previous-margin="60rpx"
        next-margin="60rpx"
        indicator-dots
      >
        <swiper-item
          v-for="(card, index) in taskList"
          :key="card.id"
          class="task-card"
          :class="{ active: currentIndex === index }"
        >
          <view class="swiper-slider">
            <view class="title">{{ card.title }}</view>
            <view vlass="tag"></view>
            <view class="delete-btn" @click="removeTask(card.id)">删除</view>

            <view class="progress-con">
              <view
                v-for="p in card.sub_tasks"
                :key="p.id"
                class="progress-item"
                :class="p.isComplete ? 'active' : ''"
              ></view>
            </view>

            <view class="info-row">
              <view class="finish_info">完成进度：{{ card.finish_count || 0 }}/{{ card.sub_tasks.length }}</view>
            </view>
            <view class="add-row">
              <uni-easyinput v-model="subTaskName" placeholder="添加新的待办事项"></uni-easyinput>
              <view class="add-btn" @click="addSub(card.id)">添加</view>
            </view>
            <scroll-view class="scroll-task" scroll-y="true">
              <view v-for="sub in card.sub_tasks" :key="sub.id" class="sub-task">
                <checkbox-group @change="onSubChange(sub.documentId, sub.isComplete)">
                  <checkbox :value="sub.isComplete" :checked="sub.isComplete" />
                </checkbox-group>

                <view class="sub-name">{{ sub.title }}</view>

                <picker
                  class="opt"
                  mode="selector"
                  @change="chooseOpt($event, sub.documentId, sub.title)"
                  :range="optTypeList"
                >
                  <view class="picker-view"> ··· </view>
                </picker>
              </view>
            </scroll-view>
          </view>
        </swiper-item>
      </swiper>

      <view class="update-input" v-if="showUpdateDialog">
        <view class="update-main">
          <view class="header">编辑待办事项</view>
          <uni-easyinput v-model="updateTitle" placeholder="请输入要修改的新任务名称"></uni-easyinput>
          <view class="opt">
            <view class="cancel" @click="showUpdateDialog = false">取消</view>
            <view class="confirm" @click="updateSub">保存</view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <TaskTypePicker v-model:modelValue="visible" @openTemplate="openTemplate" @createTask="createTask" />
  <TaskTemplatePop ref="templatePopRef" @click="getTemplateInfo" />
  <my-tab-bar :selected="0" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'
import TaskTemplatePop from '@/components/task-template-pop/index.vue'
import TaskTypePicker from '@/components/task-type-picker/index.vue'
import {
  getUserAllTask,
  changeSubTaskStatus,
  AddSubTask,
  RemoveSubTask,
  UpdateSubTask,
  RemoveTaskById,
  AddTask,
  AddSubTasks
} from '@/utils/api'
const taskList = ref<any[]>([])

let visible = ref<boolean>(false)
let subTaskName = ref<string>('')
let currentIndex = ref<number>(0)

const swiperChange = (e: any) => {
  console.log('swiperChange', e)
  currentIndex.value = e.detail.current
}

const showCreateDialog = () => {
  visible.value = true
  console.log('showCreateDialog', visible.value)
}

// 获取任务列表
const getTasks = async () => {
  // 页面加载时的逻辑
  const res = await getUserAllTask()
  if (res.code === 0) {
    // 统计每个任务已完成的子任务数量
    taskList.value = res.data.map((task: any) => {
      const finish_count = Array.isArray(task.sub_tasks)
        ? task.sub_tasks.filter((sub: any) => sub.isComplete).length
        : 0
      return {
        ...task,
        finish_count
      }
    })
  }
  console.log('res', taskList.value)
}

const onSubChange = async (id: string, status: boolean) => {
  console.log(status, !status)
  const res = await changeSubTaskStatus(id, !status)
  if (res.code === 0) {
    await getTasks()
    // uni.showToast({
    //   title: res.message,
    //   icon: 'none',
    //   duration: 2000
    // })
  }
}

const addSub = async (id: string) => {
  console.log('sss', subTaskName.value)
  if (!subTaskName.value) {
    uni.showToast({
      title: '任务名不能为空',
      icon: 'none',
      duration: 2000
    })
    return
  }
  const res = await AddSubTask(id, subTaskName.value)
  if (res.code === 0) {
    await getTasks()

    subTaskName.value = ''
  }
}

// const completionRate = () => {
//   const totalTasks = this.card.sub_tasks.length
// }

const optTypeList = ['删除', '修改']
const updateTitle = ref<string>('')
const updateSubId = ref<string>('')
const showUpdateDialog = ref<boolean>(false)
const chooseOpt = async (e: any, id: string, title: string) => {
  if (e.detail.value === '0') {
    console.log('delete')
    const res = await RemoveSubTask(id)
    if (res.code === 0) {
      await getTasks()
      // uni.showToast({
      //   title: res.message,
      //   icon: 'none',
      //   duration: 2000
      // })
    }
  }
  if (e.detail.value === '1') {
    updateSubId.value = id
    updateTitle.value = title
    showUpdateDialog.value = true
  }
}

const updateSub = async () => {
  if (!updateTitle.value) {
    uni.showToast({
      title: '修改内容不能为空',
      icon: 'none',
      duration: 2000
    })
    return
  }

  const res = await UpdateSubTask(updateSubId.value, updateTitle.value)
  if (res.code === 0) {
    await getTasks()

    showUpdateDialog.value = false
  }
}

const createTask = async (message: string) => {
  await getTasks()
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

const removeTask = async (id: string) => {
  const res = await RemoveTaskById(id)
  if (res.code === 0) {
    await getTasks()
    uni.showToast({
      title: res.message,
      icon: 'none',
      duration: 2000
    })
  }
}

onLoad(() => {
  getTasks()
})
onShow(() => {
  uni.hideTabBar()
})

const templatePopRef = ref()
const openTemplate = () => {
  templatePopRef.value.show()
}
const getTemplateInfo = async (info: any) => {
  visible.value = false
  templatePopRef.value.close()

  const res = await AddTask(info.title, info.TaskTypePicker)

  if (res.code === 0) {
    const res2 = await AddSubTasks(res.data.id, info.detailList)
    if (res2.code === 0) {
      await getTasks()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../static//css/common.css';
.container {
  background: linear-gradient(180deg, #fffbeb 0%, #f6f6f6 37%);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;

  /* 背景铺满屏幕 */
  // background-color: rgb(102, 161, 230);
  .header {
    width: 100%;
    padding-top: calc(var(--status-bar-height) + 160rpx);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20rpx;
    padding-right: 20rpx;
    box-sizing: border-box;
    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
    .desc {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
    }
    .add-btn {
      width: 120rpx;
      height: 60rpx;
      background-color: #007aff;
      color: white;
      border-radius: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
    }
  }
  .main {
    width: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 100rpx;
    box-sizing: border-box;
    .empty-image {
      width: 520rpx;
      height: 420rpx;
    }
    .task-con {
      width: 100%;
      height: 800rpx;
      display: flex;
      align-items: center;
      // background: #007aff;

      .task-card {
        width: 600rpx !important;
        height: 100%;
        padding: 10rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        .swiper-slider {
          width: 100%;
          // height: calc(100% - 40rpx);
          border-radius: 20rpx;
          background: #ffffff;
          padding: 40rpx;
          box-sizing: border-box;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          .title {
            width: fit-content;
            padding: 12rpx 28rpx;
            background: #68a8ec;
            border-radius: 24rpx;
            color: #fff;
            font-weight: 600;
          }
          .delete-btn {
            position: absolute;
            width: fit-content;
            padding: 12rpx 28rpx;
            background: #e03030;
            border-radius: 24rpx;
            color: #fff;
            font-weight: 600;
            top: 40rpx;
            right: 20rpx;
          }
          .progress-con {
            width: 100%;
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .progress-item {
              height: 10rpx;
              border-radius: 10rpx;
              background: rgb(58, 58, 58);
              flex-grow: 1;
            }
            .progress-item.active {
              background: #68a8ec;
            }
          }
          .info-row {
            // background: #007aff;
            margin-bottom: 30rpx;
            .finish_info {
              font-size: 24rpx;
              color: #3b3b3b66;
            }
          }
          .add-row {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 50rpx;
            .add-btn {
              flex-basis: 120rpx;
              height: 60rpx;
              border-radius: 10rpx;
              background: #007aff;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              margin-left: 36rpx;
            }
          }

          .scroll-task {
            width: 100%;
            height: 400rpx;
            .sub-task {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              position: relative;
              margin-bottom: 30rpx;
              .sub-name {
                font-size: 24rpx;
                margin-left: 36rpx;
              }

              .opt {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 30rpx;
              }
            }
          }
        }
      }
      .task-card.active .swiper-slider {
        border: 2px solid red;
      }
    }
    .update-input {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2025;
      display: flex;
      align-items: center;
      justify-content: center;
      .update-main {
        width: calc(100% - 48rpx);
        padding: 24rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        background: #fff;
        .header {
          width: 100%;
          padding: 30rpx 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .opt {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 30rpx;
          .cancel,
          .confirm {
            width: 50%;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .confirm {
            background: var(--theme-color);
            color: #ffffff;
            border-radius: 20rpx;
          }
        }
      }
    }
  }
}

// 圆形checkbox样式
::v-deep checkbox {
  border-radius: 50% !important;
  width: 32rpx !important;
  height: 32rpx !important;
}
::v-deep checkbox .wx-checkbox-input {
  border-radius: 50% !important;
}

::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  background: #4818ce;
}

::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
  color: #fff;
}
</style>
