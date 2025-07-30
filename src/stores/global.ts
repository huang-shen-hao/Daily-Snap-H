import { defineStore } from 'pinia'

const globalStore = defineStore('global', {
  state: () => {
    return {
      previewTabIndex: 0, // 跳转tabbar之前一个的索引
      text: '', //回复的内容
      puid: '', //回复帖子的id
      commentReplyName: '', // 评论回复的用户名
      showCommentDialog: false, // 是否显示评论弹窗
      showTextarea: false, // 任务补充输入框
      isLogin: false, // 是否登录
      windowHeight: 0,
      userInfo: {
        username: '',
        email: '',
        avatar: '',
        id: '',
        uuid: ''
      }
    }
  },
  getters: {
    user_userInfo: state => state.userInfo
  },
  actions: {
    openCommentDialog(name: string) {
      this.commentReplyName = name
      this.showCommentDialog = true
    },
    closeCommentDialog() {
      this.showCommentDialog = false
      this.commentReplyName = ''
    },
    changeTextarea(paylod: boolean) {
      this.showTextarea = paylod
    },
    setCommentInfo(paylod: any) {
      const { puid, commentReplyName } = paylod
      this.puid = puid
      this.commentReplyName = commentReplyName
    },
    resetCommentInfo() {
      this.puid = ''
      this.commentReplyName = ''
    }
  },
  persist: {
    key: 'user',
    storage: localStorage,
    paths: ['userInfo'] // 需要持久化的状态
  }
})

export default globalStore
