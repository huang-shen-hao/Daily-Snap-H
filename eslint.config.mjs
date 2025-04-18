import { defineConfig } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import { configs, parser } from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// import eslintPluginImportX from 'eslint-plugin-import-x'

import { readFile } from 'node:fs/promises'

const autoImportFile = new URL('./.eslintrc-auto-import.json', import.meta.url)
const autoImportGlobals = JSON.parse(await readFile(autoImportFile, 'utf8'))

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
    },
    rules: {
      'no-shadow': 'off'
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
        UniHelper: true,
        ...autoImportGlobals.globals
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
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: parser } },
    rules: {
      // 关闭驼峰命名规则
      'vue/multi-word-component-names': 0,
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
  },
  {
    rules: {
      'no-shadow': 'off',
      'linebreak-style': ['off', 'lf'], // 换行符
      quotes: ['error', 'double'], // 使用双引号
      eqeqeq: ['error', 'smart'], // 比较的时候使用严格等于
      semi: ['error', 'never'], // 不使用分号结尾
      'comma-dangle': ['error', 'always-multiline'], // 要求末尾逗号
      'no-unused-vars': 'error', // 禁止出现未使用过的变量
      'default-case': 'error', // 要求 switch 语句中有 default 分支
      'brace-style': ['error', 'stroustrup', { allowSingleLine: true }], // 大括号风格 ["error", "stroustrup"]
      'no-dupe-keys': 'error', // 对象中不允许出现重复的键
      'no-sparse-arrays': 'error', // 禁止稀疏数组， [1,,2]
      'no-empty': 'error', // 不允许出现空的代码块
      '@typescript-eslint/no-explicit-any': 'off', // 允许any类型
      'block-scoped-var': 'error', // 将变量声明放在合适的代码块里
      curly: ['error', 'all'], // 强制使用花括号的风格
      'no-self-compare': 'error', // 不允许自身比较
      'no-multiple-empty-lines': ['error', { max: 2 }], // 空行最多不能超过两行
      'no-const-assign': 'error', // 禁止修改const声明的变量
      'no-redeclare': 'error', // 禁止重复声明变量
      'no-func-assign': 'error', // 禁止重复的函数声明
      // 空格
      'space-infix-ops': ['error', { int32Hint: true }], // 操作符周围的空格
      'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }], // 函数定义时括号前的空格
      'space-before-blocks': ['error', 'always'], // 在块语句之前始终有一个空格
      'template-curly-spacing': ['off', 'never'], // 要求模板字符串中的嵌入表达式周围空格的使用
      'key-spacing': ['error', { beforeColon: false, afterColon: true }], // 对象字面量中冒号的前后空格
      'array-bracket-spacing': ['off', 'always'], // 数组内前后要求有空格
      'object-curly-spacing': ['error', 'always'], // 对象内前后要求有空格
      'arrow-spacing': ['error', { before: true, after: true }], // 前头=> 前后都有空格
      'comma-spacing': ['error', { before: false, after: true }], // 要求同一行内逗号后面有空格
      'keyword-spacing': 'error', // 关键字前后的空格
      'no-trailing-spaces': 'error', // 一行最后不允许有空格
      'switch-colon-spacing': ['error', { before: false, after: true }], // switch 冒号后要有空格
      'no-multi-spaces': 'error', // 不允许出现多余的空格

      /* vue相关 - https://eslint.vuejs.org */
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 3 },
          multiline: { max: 1 }
        }
      ],
      'vue/html-indent': ['error', 'tab'],
      'vue/multi-word-component-names': 'off',
      'vue/html-closing-bracket-spacing': [
        'error',
        {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'always'
        }
      ],
      'vue/no-async-in-computed-properties': 'error',
      'vue/space-infix-ops': 'error',
      'vue/key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true
        }
      ],
      'vue/no-extra-parens': ['error', 'all'],
      'vue/multiline-ternary': ['error', 'always-multiline'],

      /* ts相关 - https://eslint.style */
      '@typescript-eslint/indent': 'off' // 禁用ts的缩进规则
    }
  },

  // eslintPluginImportX.flatConfigs.recommended,
  // eslintPluginImportX.flatConfigs.typescript,
  eslintPluginPrettierRecommended
])
