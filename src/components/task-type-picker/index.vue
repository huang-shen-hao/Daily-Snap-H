<template>
  <view v-if="modelValue" class="createDialog" ref="createDialogRef">
    <view class="dialog-main">
      <view class="dialog-header">
        创建新任务

        <image
          @click="close"
          class="dialog-close"
          src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E5%85%B3%E9%97%AD%20%282%29.png"
        />
      </view>
      <view class="template" @click="openTemplate">从模版中创建</view>
      <view class="label">任务名称</view>
      <view class="task-name">
        <uni-easyinput v-model="taskName"></uni-easyinput>
      </view>

      <view class="label"> 循环周期 </view>
      <view class="picker-con">
        <picker mode="selector" @change="chooseTaskType" :range="taskTypeList">
          <view class="picker-view">
            {{ taskTypeList[chooseTypeIndex] }}
          </view>
        </picker>
      </view>

      <view class="opt">
        <view class="cancel" @click="close">取消</view>
        <view class="create" @click="create">创建</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { AddTask } from '@/utils/api'
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const createDialogRef = ref()

const taskName = ref<string>('')
const chooseType = ref<string>('once')
const chooseTypeIndex = ref<number>(0)
const taskTypeList = ['不重复', '按天', '按周', '按月']

const chooseTaskType = (e: any) => {
  chooseTypeIndex.value = e.detail.value
  if (e.detail.value === 0) chooseType.value = 'once'
  if (e.detail.value === 1) chooseType.value = 'daily'
  if (e.detail.value === 2) chooseType.value = 'weekly'
  if (e.detail.value === 3) chooseType.value = 'monthly'
}

const emit = defineEmits(['update:modelValue', 'openTemplate', 'createTask'])

const close = () => {
  taskName.value = ''
  chooseType.value = 'none'
  chooseTypeIndex.value = 0
  emit('update:modelValue', false)
}
const openTemplate = () => {
  emit('openTemplate')
}

const create = async () => {
  const res = await AddTask(taskName.value, chooseType.value)
  if (res.code === 0) {
    emit('createTask', res.message)
    emit('update:modelValue', false)
  }
}
</script>

<style lang="scss" scoped>
.createDialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  .dialog-main {
    width: calc(100% - 160rpx);
    padding-bottom: 30rpx;
    background: #fff;
    border-radius: 20rpx;

    .dialog-header {
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: 28rpx;
      font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
      font-weight: 600;
      border-bottom: 2rpx solid #d6d6d6;
      .dialog-close {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        top: 24rpx;
        right: 24rpx;
      }
    }
    .template {
      background-color: #354fc2;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(100% - 48rpx);
      margin: 0 auto;
      margin-top: 28rpx;
      color: #fff;
      font-size: 28rpx;
      height: 80rpx;
    }
    .label {
      width: calc(100% - 48rpx);
      margin: 28rpx auto 8rpx;
      font-size: 22rpx;
      color: #666;
    }
    .task-name,
    .picker-con,
    .opt {
      width: calc(100% - 48rpx);
      margin: 0 auto;
      box-sizing: border-box;
      height: 80rpx;
    }
    .picker-con {
      background: #d4d4d4;
      border-radius: 10rpx;
      picker {
        width: 100%;
      }
      .picker-view {
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        padding-left: 24rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }
    .opt {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 52rpx;
      .cancel {
        width: 45%;
        height: 80rpx;
        color: #007aff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .create {
        width: 45%;
        height: 80rpx;
        background: #007aff;
        color: #fff;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
