// stylelint.config.mjs

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-standard-vue'],
  rules: {
    // 忽略rpx校验
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    // 渐变写法校验关闭
    'function-linear-gradient-no-nonstandard-direction': null,
    // 不改写 "0.5" to be "50%"
    'alpha-value-notation': null,
    // 不改写rgba函数
    'color-function-notation': null,
    'font-family-no-missing-generic-family-keyword': null,
    // 重复属性校验关闭 因为需要适配多端代码，会有重复属性
    'declaration-block-no-duplicate-properties': null,
    // 选择器重复校验关闭
    'no-duplicate-selectors': null,
    // 忽略属性简写
    'declaration-block-no-shorthand-property-overrides': null,
    // 忽略URL引号校验
    'function-url-quotes': null,
    // 忽略空文件校验
    'no-empty-source': null,
    'max-line-length': null,
    // 动画函数 忽略校验
    'function-no-unknown': null,
    // 动画名 忽略校验
    'keyframes-name-pattern': null,
    // /前的空格校验
    'scss/operator-no-unspaced': null,
    // 忽略 ".scss" 引用
    'scss/at-import-partial-extension': null,
    // scss 变量名忽略警告
    'scss/dollar-variable-pattern': [/./, { ignore: 'global' }],
    // mixin变量名支持全部字符
    'scss/at-mixin-pattern': /.+/,
    // 类选择器的命名规则
    'selector-class-pattern': '.',
    // 指定字符串使用单引号或双引号 "single"|"double"
    'string-quotes': 'single',
    // 颜色指定大写
    'color-hex-case': 'upper',
    // 禁止空块
    'block-no-empty': true,
    // 颜色6位长度
    'color-hex-length': 'long',
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['flex-flow', '/border/']
      }
    ],
    // 兼容自定义标签名
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'recycle-item', 'view', 'text', 'scroll-view']
      }
    ],
    // 忽略伪类选择器 ::v-deep
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['/./', 'v-deep', '-webkit-']
      }
    ],
    // 禁止低优先级的选择器出现在高优先级的选择器之后。
    'no-descending-specificity': null,
    // 不验证@未知的名字，为了兼容scss的函数
    'at-rule-no-unknown': null,
    // 禁止空注释
    'comment-no-empty': true,
    // 禁止简写属性的冗余值
    'shorthand-property-no-redundant-values': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['/./', '-webkit-']
      }
    ],
    // 禁止值的浏览器引擎前缀
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: 'box'
      }
    ],
    // 禁止属性的浏览器引擎前缀
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: [/./]
      }
    ],
    // 禁止小于 1 的小数有一个前导零
    'number-leading-zero': null,
    // 禁止空第一行
    'no-empty-first-line': true
  },
  ignoreFiles: ['dist/**/*', '*.json']
}
