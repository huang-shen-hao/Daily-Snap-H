<template>
  <view class="container">
    <view class="fa" v-for="item in list" :key="item.documentId">
      <view class="info">
        <view class="avatar">
          <image :src="item.users_permissions_user.avatar" mode="scaleToFill" />
        </view>

        <view class="info-detail">
          <view class="name">{{ item.users_permissions_user.username }}</view>
          <view class="time">
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
      <view class="info-contain">
        <view class="title"> {{ item.title }}</view>
        <view class="content"> {{ item.content }}</view>
        <view class="tools">
          <image
            calss="like"
            v-show="item.isLike"
            src="https://iili.io/3WDD4se.png"
            @click="doUnLikePost(item.puid)"
            mode="scaleToFill"
          />
          <image
            calss="like"
            v-show="!item.isLike"
            src="https://iili.io/3VyQCrP.png"
            @click="doLikePost(item.puid)"
            mode="scaleToFill"
          />
          <image
            calss="comment"
            src="https://iili.io/3VyQBEB.png"
            @click="openBox(item.puid, item.users_permissions_user.username)"
            mode="scaleToFill"
          />
        </view>
      </view>

      <view class="like-con" v-if="item.likes.length > 0">
        <view
          class="like-item"
          v-for="like in item.likes.length > 3 ? item.likes.slice(0, 3) : item.likes"
          :key="like.uuid"
        >
          <image class="like-avatar" :src="like.avatar" mode="scaleToFill" />
        </view>
        <view class="text">等{{ item.likes.length }}人觉得很赞</view>
      </view>

      <CommentBox :child-list="item.child" :reply-user-name="item.users_permissions_user.username" @delete="refresh" />
    </view>

    <!-- 评论框 -->
    <CommentPop v-show="global.showCommentDialog" @comfirm="refresh" />

    <view class="add" @click="toAddPage"> 发帖 </view>
  </view>
  <my-tab-bar :selected="2" />
</template>

<script setup lang="ts">
import myTabBar from '@/components/my-tab-bar/index.vue'
import CommentBox from '@/components/comment-box/index.vue'
import CommentPop from '@/components/comment-pop/index.vue'
import { getPostList, deletePostByPuid, likePost, unLikePost } from '@/utils/api'
import { ICommentItem } from '@/utils/interface'
import globalStore from '@/stores/global'
import { formatTime } from '@/utils/tool'

const global = globalStore()

const list = ref<ICommentItem[]>([])

/**
 * 递归遍历帖子列表，设置 isLike 标志
 * @param {Array<Object>} posts - 帖子列表，每个对象可能含有 `likes` 数组和 `child` 子评论数组
 * @param {string} userUuid - 当前登录用户的 uuid
 */
const markLikes = (posts: ICommentItem[], uuid: string) => {
  posts.forEach(post => {
    // 如果 likes 数组中至少有一个点赞对象的 uuid 与当前用户匹配，则标记 isLike
    post.isLike = Array.isArray(post.likes) && post.likes.some(like => like.uuid === uuid)

    // 处理多层嵌套的子评论
    if (Array.isArray(post.child) && post.child.length > 0) {
      markLikes(post.child, uuid)
    }
  })
}

const getList = async () => {
  const res = await getPostList()
  if (res.code === 0) {
    list.value = res.data
    markLikes(list.value, global.userInfo.uuid)
    console.log('sss', list.value)
  }
  console.log(res)
}

onShow(async () => {
  console.log('show')
  uni.hideTabBar()
  await getList()
})

const refresh = async (param: any) => {
  const { status } = param
  console.log('status', status)
  if (status) await getList()
}

const toAddPage = () => {
  uni.navigateTo({
    url: '/pages/post/add'
  })
}

const deletePost = async (puid: string) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该评论吗？',
    success: async res => {
      if (res.confirm) {
        console.log('删除')
        const res = await deletePostByPuid(puid)
        if (res.code === 0) await getList()
      }
    }
  })
}

const openBox = (id: string, username: string) => {
  const param = {
    puid: id,
    commentReplyName: username
  }
  global.setCommentInfo(param)
  global.openCommentDialog(username)
}

const doLikePost = async (puid: string) => {
  const userId = global.userInfo.uuid
  const res = await likePost(puid, userId)
  if (res.code === 0) {
    await getList()
    uni.showToast({
      title: res.message,
      icon: 'none'
    })
  }
}
const doUnLikePost = async (puid: string) => {
  const userId = global.userInfo.uuid
  const res = await unLikePost(puid, userId)
  if (res.code === 0) {
    await getList()
    uni.showToast({
      title: res.message,
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e2e2e2;
  padding: 20px 20px 500rpx 20rpx;

  .add {
    width: 200rpx;
    height: 80rpx;
    border-radius: 80rpx;
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 300rpx;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    color: #fff;
    font-weight: 600;
  }

  .fa {
    width: 100%;
    border-radius: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    margin: 20rpx 0;

    .info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 20rpx;
      box-sizing: border-box;
      border-bottom: 2rpx solid rgb(206 206 206);
      position: relative;

      .delete {
        width: 30rpx;
        height: 30rpx;
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
      }

      .avatar {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
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

        // will-change: transform;
        .name {
          color: #000;
          font-size: 30rpx;
          font-weight: 600;
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

    .info-contain {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      padding: 20rpx;
      box-sizing: border-box;
      border-bottom: 2rpx solid rgb(206 206 206);

      .title,
      .content {
        width: 100%;
        text-align: left;
      }

      .title {
        font-size: 28rpx;
        color: #000;
        margin-bottom: 10rpx;
      }

      .content {
        font-size: 24rpx;
        color: #999;

        // text-indent: 2rem;
      }

      .tools {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 30rpx;

        image {
          width: 40rpx;
          height: 40rpx;
          margin: 0 20rpx;
        }
      }
    }

    .like-con {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 20rpx;
      box-sizing: border-box;
      border-bottom: 2rpx solid rgb(206 206 206);

      .like-item {
        .like-avatar {
          display: block;
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
        }
      }

      .text {
        font-size: 24rpx;
        color: #666;
        margin-left: 10rpx;
      }
    }

    .comment-area {
      width: 100%;

      .comment-item {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding: 20rpx;
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
          font-size: 18rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
