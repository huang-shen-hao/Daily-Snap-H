// vite.config.js
import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import AutoImport from 'unplugin-auto-import/vite'
// import cdn from 'vite-plugin-cdn-import'

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
      imports: ['vue', 'uni-app', 'pinia'], // 自动导入vue和uni-app的api
      dts: 'types/auto-imports.d.ts', // 使用typescript，需要指定生成对应的d.ts文件或者设置为true,生成默认导入d.ts文件
      dirs: ['src/stores', 'src/constant', 'src/hooks', '@dcloudio/uni-app'],
      vueTemplate: true,
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `path.join(process.cwd(), '.eslintrc-auto-import.json')`
        globalsPropValue: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
  // —— 开发模式：esbuild 预构建（等同于 “transpileDependencies”）
  // optimizeDeps: {
  //   include: [
  //     '@dcloudio/uni-ui' // 把 uni-ui 整包预先走 esbuild 转为 ESM
  //   ]
  // },
  // —— 生产打包：Rollup CommonJS 插件也对 uni-ui 做编译
  // build: {
  //   commonjsOptions: {
  //     include: [
  //       /node_modules/, // 保证默认的 node_modules 都能走 CJS 转 ESM
  //       /@dcloudio\/uni-ui/ // 且额外处理 uni-ui 里的 CommonJS 源码
  //     ]
  //   }
  // }
})
