import { createSSRApp } from 'vue'
import pinia from './stores'
import App from './App.vue'

// #ifdef H5
import quill from 'quill'
window.Quill = quill
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app,
    pinia
  }
}
