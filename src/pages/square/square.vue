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
              src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E6%9B%B4%E5%A4%9A.svg"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
      <view class="info-contain">
        <!-- <view class="title"> {{ item.title }}</view> -->
        <view class="content"> {{ item.content }}</view>

        <view v-if="Array.isArray(item.img) && item.img.length > 0" class="content-img">
          <view v-for="s in item.img" :key="s" class="img-item">
            <image class="img" :src="s" mode="scaleToFill" />
          </view>
        </view>
        <view class="content-footer">
          <view class="like-con" v-if="item.likes.length > 0">
            <view
              class="like-item"
              v-for="like in item.likes.length > 3 ? item.likes.slice(0, 3) : item.likes"
              :key="like.uuid"
            >
              <image class="like-avatar" :src="like.avatar" mode="scaleToFill" />
            </view>
            <view class="like-item">
              <view class="like-avatar num">+{{ item.likes.length }}</view>
            </view>
            <view class="text">觉得很赞</view>
          </view>

          <view class="tools">
            <view>
              <image
                class="like"
                v-show="item.isLike"
                src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E5%B7%B2%E7%82%B9%E8%B5%9E.svg"
                @click="doUnLikePost(item.puid)"
                mode="scaleToFill"
              />
              <image
                class="like"
                v-show="!item.isLike"
                src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E6%9C%AA%E7%82%B9%E8%B5%9E.svg"
                @click="doLikePost(item.puid)"
                mode="scaleToFill"
              />
              <text class="desc" v-show="item.isLike" @click="doUnLikePost(item.puid)">点赞</text>
              <text class="desc" v-show="!item.isLike" @click="doLikePost(item.puid)">取消</text>
            </view>

            <view @click="openBox(item.puid, item.users_permissions_user.username)">
              <image
                class="comment"
                src="https://daily-snap.oss-cn-hangzhou.aliyuncs.com/%E8%AF%84%E8%AE%BA.svg"
                mode="scaleToFill"
              />
              <text class="desc">评论</text>
            </view>
          </view>
        </view>
      </view>

      <CommentBox
        v-show="item.child.length > 0"
        :child-list="item.child"
        :reply-user-name="item.users_permissions_user.username"
        @delete="refresh"
      />
    </view>

    <!-- 评论框 -->
    <CommentPop v-show="global.showCommentDialog" @comfirm="refresh" />

    <!-- <view class="add" @click="toAddPage"> 发帖 </view> -->
  </view>
  <my-tab-bar :selected="1" />
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
  global.$patch({
    previewTabIndex: 1
  })
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
  box-sizing: border-box;
  padding-top: 24rpx;
  padding-bottom: calc(130rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(130rpx + env(safe-area-inset-bottom));

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
    padding: 0 40rpx;
    box-sizing: border-box;
    margin-bottom: 60rpx;
    .info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 24rpx;
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
        width: 88rpx;
        height: 88rpx;
        border-radius: 20rpx;
        overflow: hidden;
        margin-right: 24rpx;
        flex-shrink: 0;
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
          font-family:
            Alibaba PuHuiTi,
            Alibaba PuHuiTi;
          font-weight: bold;
          font-size: 32rpx;
          color: #333333;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
          margin-bottom: 8rpx;
        }

        .time {
          font-family:
            PingFang SC,
            PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;

          .delete {
            width: 48rpx;
            height: 48rpx;
            position: absolute;
            right: 0;
            bottom: 0;
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

      box-sizing: border-box;
      background: #f6f6f6;
      border-radius: 0rpx 40rpx 40rpx 40rpx;
      padding: 24rpx 32rpx 32rpx 32rpx;
      margin-top: 24rpx;
      margin-bottom: 22rpx;

      .title,
      .content {
        width: 100%;
        text-align: left;
      }

      .title {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 600;
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .content {
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #333333;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .content-img {
        margin-top: 24rpx;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 190rpx);
        grid-template-rows: 190rpx;
        gap: 16rpx;
        .img-item {
          width: 100%;
          height: 100%;
          .img {
            border-radius: 20rpx;
            width: 100%;
            height: 100%;
          }
        }
      }
      .content-footer {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24rpx;
        .tools {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-end;

          view {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          view .desc {
            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 600;
            font-size: 24rpx;
            color: #999999;
            line-height: 40rpx;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }

          view image {
            width: 56rpx;
            height: 56rpx;
            margin: 0 16rpx;
          }
        }
        .like-con {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          flex: 1;
          .like-item {
            .like-avatar {
              display: block;
              width: 56rpx;
              height: 56rpx;
              border-radius: 50%;
            }
            .num {
              background: #e6e6e6;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family:
                Alibaba PuHuiTi,
                Alibaba PuHuiTi;
              font-weight: bold;
              font-size: 24rpx;
              color: #999999;
            }
          }
          .like-item:not(:first-child) {
            margin-left: -12rpx;
          }

          .text {
            font-size: 24rpx;
            color: #666;
            margin-left: 10rpx;
          }
        }
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
