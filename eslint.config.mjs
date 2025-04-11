import { defineConfig } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import { configs, parser } from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginImportX from 'eslint-plugin-import-x'

export default defineConfig([
  {
    ignores: ['node_modules', 'src/static/', '.vscode', '.husky']
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,,ts,tsx,vue}'],
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      parser: parser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        wx: true,
        uni: true,
        WechatMiniprogram: true,
        getCurrentPages: true,
        UniHelper: true
      }
    }
  },
  // @eslint/js 扩展插件
  pluginJs.configs.recommended,
  // typescript-eslint 扩展插件
  ...configs.recommended,
  // eslint-plugin-vue 扩展插件
  ...pluginVue.configs['flat/essential'],
  // eslint-plugin-vue 配置对象属性
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: parser } } },
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  eslintPluginPrettierRecommended
])
