import { defineStore } from 'pinia'

const userStore = defineStore('user', {
  state: () => {
    return {
      isLogin: false, // 是否登录
      userInfo: {
        username: '',
        email: '',
        avatar: '',
        id: ''
      }
    }
  },
  getters: {
    user_userInfo: state => state.userInfo
  },
  actions: {},
  persist: {
    key: 'user',
    storage: localStorage,
    paths: ['userInfo'] // 需要持久化的状态
  }
})

export default userStore
