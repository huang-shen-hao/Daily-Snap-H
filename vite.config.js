// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import AutoImport from 'unplugin-auto-import/vite'

// 引入uni-pages-hot-modules
import uniHot from 'uni-pages-hot-modules'
// 安装条件编译命令，安装之后，uniapp就会支持exec hotJs的条件编译
uniHot.setupHotJs()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // 注册uni-pages-hot-modules的热更新vite插件
    uniHot.createHotVitePlugin(),
    AutoImport({
      imports: ['vue'],
      dts: 'types/auto-imports.d.ts', // 使用typescript，需要指定生成对应的d.ts文件或者设置为true,生成默认导入d.ts文件
      dirs: ['src/stores', 'src/constant', 'src/hooks', '@dcloudio/uni-app'],
      vueTemplate: true
    })
  ]
})
