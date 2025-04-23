import { createPinia } from 'pinia' //引入pinia

import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia() //创建pinia实例

pinia.use(
  createPersistedState({
    storage: {
      getItem(key: string) {
        return <string | null>uni.getStorageSync(key)
      },
      setItem(key: string, value: string) {
        uni.setStorageSync(key, value)
      }
    }
  })
) //将插件添加到 pinia 实例上

export default pinia //导出pinia用于main.js注册
