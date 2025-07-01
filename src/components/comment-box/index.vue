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
  },
  // 是否一级回复
  isTop: {
    type: Boolean,
    default: true
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
  <view class="comment-area" :class="{ 'is-top': isTop }">
    <template v-if="Array.isArray(childList) && childList.length > 0">
      <view v-for="item in childList" :key="item.documentId" class="comment-item" :class="{ 'is-reply': !isTop }">
        <view class="line">
          <view class="avatar" :class="{ 'is-reply': !isTop }" v-show="showAvatar">
            <image :src="item.users_permissions_user.avatar" mode="scaleToFill" />
          </view>

          <view class="info-detail">
            <view class="name">
              <text> {{ item.users_permissions_user.username }} </text>

              <text class="reply-name" v-if="!isTop">{{ replyUserName }}</text>
            </view>

            <view
              class="content"
              :class="{ 'is-reply': !isTop }"
              @click="openBox(item.puid, item.users_permissions_user.username)"
            >
              {{ item.content }}
            </view>
            <view class="time" :class="{ 'is-reply': !isTop }" v-show="showTime">
              <text>{{ formatTime(item.createdAt) }}</text>

              <text
                @click="deletePost(item.puid)"
                v-if="item.users_permissions_user.username === global.userInfo.username"
                class="delete"
                >删除</text
              >
              <text v-else class="reply" @click="openBox(item.puid, item.users_permissions_user.username)">回复</text>
            </view>
          </view>
        </view>

        <!-- 二级回复 缩进-->
        <CommentBox
          :is-top="false"
          :child-list="item.child"
          :reply-user-name="item.users_permissions_user.username"
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
  background: #f6f6f6;
  border-radius: 40rpx;
  &.is-top {
    padding: 32rpx;
  }

  .comment-item {
    width: 100%;
    box-sizing: border-box;
  }

  .comment-item.is-reply {
    padding-left: 80rpx;
    margin-top: 24rpx;
  }

  .comment-item.is-reply .comment-item.is-reply {
    padding-left: 0; /* 重置缩进 */
  }

  .line {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;

    .avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 16rpx;
      flex-shrink: 0;
      &.is-reply {
        width: 40rpx;
        height: 40rpx;
      }

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

      .name {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 500;
        font-size: 24rpx;
        color: #999999;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 8rpx;
      }

      .reply-name {
        padding-left: 48rpx;
        position: relative;
        &::before {
          content: '';
          position: absolute;

          width: 0;
          height: 0;
          top: 50%;
          transform: translateY(-50%);
          left: 16rpx;
          border-top: 14rpx solid transparent;
          border-bottom: 14rpx solid transparent;
          border-left: 14rpx solid #d9d9d9; /* 调整颜色/尺寸 */
        }
      }

      .content {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #333333;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 16rpx;
        &.is-reply {
          transform: translateX(-52rpx);
          margin-top: 20rpx;
        }
      }

      .time {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #aaaaaa;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        &.is-reply {
          transform: translateX(-52rpx);
        }

        .reply,
        .delete {
          padding-left: 40rpx;
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #d294ff;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
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
