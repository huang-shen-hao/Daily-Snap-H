<script setup lang="ts">
import CommentBox from '@/components/comment-box/index.vue'
// import CommentPop from '@/components/comment-pop/index.vue'
import { ICommentItem } from '@/utils/interface'
import globalStore from '@/stores/global'
import { deletePostByPuid } from '@/utils/api'
import { formatTime } from '@/utils/tool'

const global = globalStore()

const handleChildDelete = () => {
  emit('delete', { status: true })
}

defineProps({
  replyUserName: {
    type: String,
    default: ''
  },
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

const openBox = (id: string, username: string) => {
  const param = {
    puid: id,
    commentReplyName: username
  }
  global.setCommentInfo(param)
  global.openCommentDialog(username)
}

const emit = defineEmits(['delete'])

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
      <view v-for="item in childList" :key="item.documentId" class="comment-item" :class="{ deep: isTab }">
        <view class="line" :class="{ tab: isTab }">
          <view class="avatar" v-show="showAvatar">
            <image :src="item.users_permissions_user.avatar" mode="scaleToFill" />
          </view>

          <view class="info-detail">
            <view class="name" @click="openBox(item.puid, item.users_permissions_user.username)">{{
              item.users_permissions_user.username
            }}</view>
            <view class="content" @click="openBox(item.puid, item.users_permissions_user.username)"
              >回复@{{ replyUserName }}： {{ item.content }}</view
            >
            <view class="time" v-show="showTime">
              <text>{{ formatTime(item.createdAt) }}</text>
              <image
                class="delete"
                @click="deletePost(item.puid)"
                v-if="item.users_permissions_user.username === global.userInfo.username"
                src="https://iili.io/3WJstv1.png"
                mode="scaleToFill"
              />
            </view>
          </view>
        </view>

        <!-- 二级回复 缩进-->
        <CommentBox
          :child-list="item.child"
          :reply-user-name="item.users_permissions_user.username"
          :isTab="true"
          @delete="handleChildDelete"
        />
      </view>
    </template>
  </view>

  <!-- 评论框 -->
  <!-- <CommentPop v-show="global.showCommentDialog" @comfirm="submitReply" /> -->
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

  .comment-item.deep {
    padding: 20rpx 0;
  }

  .line {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;

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
        color: #000;
        font-size: 500;
        margin-bottom: 8rpx;
      }

      .content {
        font-size: 18rpx;
        color: #333;
        margin-bottom: 8rpx;
      }

      .time {
        width: 100%;
        padding: 6rpx 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 18rpx;
        color: #333;
        position: relative;

        .delete {
          width: 20rpx;
          height: 20rpx;
          position: absolute;
          left: 200rpx;
          top: 50%;
          transform: translateY(-50%);
        }
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
