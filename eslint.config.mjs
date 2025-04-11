import { defineConfig } from 'eslint/config'
import globals from 'globals'
import { configs, parser } from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import eslintPluginImportX from 'eslint-plugin-import-x'
import tsParser from '@typescript-eslint/parser'
// 导入这个可以一次性设置 `eslint-plugin-prettier` 和 `eslint-config-prettier`
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'off',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn'
    }
  },

  ...configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, wx: true, uni: true } }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: { js },
    extends: ['js/recommended']
  },

  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],

    languageOptions: { parserOptions: { parser: parser } }
  },
  {
    ignores: ['node_modules', 'src/static/', '.vscode', '.husky']
  },
  eslintPluginPrettierRecommended
])
