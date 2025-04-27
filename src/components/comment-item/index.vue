<!-- eslint-disable @typescript-eslint/no-unused-expressions -->
<script setup lang="ts">
import CommentItem from '@/components/comment-item/index.vue'
import { ICommentItem } from '@/utils/interface'
import userStore from '@/stores/user'
import { replyPost, deletePostByPuid } from '@/utils/api'

const user = userStore()
defineProps({
  isTab: {
    type: Boolean,
    default: false
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showTime: {
    type: Boolean,
    default: true
  },
  childList: {
    type: Array as PropType<ICommentItem[]>,
    default: () => [] as ICommentItem[]
  }
})

// 回复的id
const puid = ref<string>('')
const text = ref<string>('')
// 回复谁
const replyName = ref<string>('')
const popRef = ref()

const openBox = (id: string, username: string) => {
  puid.value = id
  replyName.value = username
  console.log('sssss', puid.value, replyName.value)
  popRef.value && popRef.value.open('center')
}

const emit = defineEmits(['reply', 'delete'])

// 用户在弹窗里点“确定”时提交
const submitReply = async () => {
  const auth = user.userInfo.id
  const res = await replyPost(text.value, puid.value, auth)
  if (res.code === 0) {
    handleChildReply()
  }
}
const handleChildReply = () => {
  emit('reply', { status: true })
}

const handleChildDelete = () => {
  emit('delete', { status: true })
}

const deletePost = async (puid: string) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该评论吗？',
    success: async res => {
      if (res.confirm) {
        console.log('删除')
        const res = await deletePostByPuid(puid)
        if (res.code === 0) handleChildDelete()
      }
    }
  })
}
</script>
<template>
  <view class="comment-area">
    <template v-if="Array.isArray(childList) && childList.length > 0">
      <view v-for="item in childList" :key="item.documentId" class="comment-item">
        <view class="line" :class="{ tab: isTab }">
          <view class="avatar" v-show="showAvatar">
            <image :src="item.users_permissions_user.avatar" mode="scaleToFill" />
          </view>

          <view class="info-detail" @click="openBox(item.puid, item.users_permissions_user.username)">
            <view class="name">{{ item.users_permissions_user.username }}</view>
            <view class="content"> {{ item.content }}</view>
            <view class="time" v-show="showTime">2025-04-27</view>
          </view>

          <image
            class="delete"
            @click="deletePost(item.puid)"
            v-if="item.users_permissions_user.username === user.userInfo.username"
            src="https://iili.io/3WJstv1.png"
            mode="scaleToFill"
          />
        </view>

        <!-- 二级回复 缩进-->
        <CommentItem :child-list="item.child" :isTab="true" @reply="handleChildReply" @delete="handleChildDelete" />
      </view>
    </template>

    <!-- 评论框 -->
    <uni-popup ref="popRef" type="dialog">
      <uni-popup-dialog value="" ref="inputClose" :title="`回复${replyName}`" @confirm="submitReply">
        <uni-easyinput type="textarea" v-model="text" placeholder="请输入内容"></uni-easyinput>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<style lang="scss" scoped>
.comment-area {
  width: 100%;
  box-sizing: border-box;
  .comment-item {
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx;
  }
  .line {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    position: relative;
    .delete {
      width: 30rpx;
      height: 30rpx;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background-color: red;
      overflow: hidden;
      margin-right: 20rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .info-detail {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 30px;
      .name {
        font-size: 24rpx;
        color: #000000;
        font-size: 500;
        margin-bottom: 8rpx;
      }
      .content {
        font-size: 18rpx;
        color: #333;

        margin-bottom: 8rpx;
      }
      .time {
        font-size: 18rpx;
        color: #333;
      }
    }
  }
  .line.tab {
    padding-left: 40rpx;
  }
  .pop-main {
    width: 600rpx;
    height: 500rpx;
    border-radius: 20rpx;
    padding: 20rpx;
    box-sizing: border-box;
    background-color: '#fff';
  }
}
</style>
