<template>
  <view>
    <mp-html :content="content" />
  </view>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'

const content = `
 <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <h1 style="font-size:24px; font-weight:600; margin-bottom:5px;">隐私政策</h1>
  <p style="font-size:14px; color:#666; margin-top:0;">更新日期：2025年5月14日</p>

  <h2 style="font-size:20px; font-weight:600; margin-top:25px; margin-bottom:15px;">1. 信息收集 🧾</h2>
  <p style="font-size:14px; line-height:1.6;">我们可能在您使用本小程序的过程中收集如下信息：</p>
  <ul style="font-size:14px; line-height:1.6; padding-left:20px;">
    <li>📛 基本资料（如微信头像、昵称，仅在授权后收集）</li>
    <li>📱 设备信息（如机型、操作系统、IP等）</li>
    <li>📊 使用行为（如页面访问记录、点击事件等）</li>
  </ul>

  <h2 style="font-size:20px; font-weight:600; margin-top:25px; margin-bottom:15px;">2. 信息用途 🎯</h2>
  <p style="font-size:14px; line-height:1.6;">我们收集的信息主要用于以下目的：</p>
  <ul style="font-size:14px; line-height:1.6; padding-left:20px;">
    <li>🔧 提升产品功能与稳定性</li>
    <li>📈 统计分析与用户体验优化</li>
    <li>🔐 保障账号与服务的安全</li>
  </ul>

  <h2 style="font-size:20px; font-weight:600; margin-top:25px; margin-bottom:15px;">3. 信息存储与安全 🔐</h2>
  <p style="font-size:14px; line-height:1.6;">我们会采取合理的安全措施保护您的数据不被未经授权的访问或泄露：</p>
  <ul style="font-size:14px; line-height:1.6; padding-left:20px;">
    <li>📁 数据加密存储</li>
    <li>🚫 未经授权不向第三方披露</li>
    <li>🧹 提供数据清除机制</li>
  </ul>

  <h2 style="font-size:20px; font-weight:600; margin-top:25px; margin-bottom:15px;">4. 第三方服务 🤝</h2>
  <p style="font-size:14px; line-height:1.6;">我们可能接入由微信平台或其他第三方提供的服务（如登录、支付、统计等），这些服务可能会收集必要的信息以保障功能实现。</p>

  <h2 style="font-size:20px; font-weight:600; margin-top:25px; margin-bottom:15px;">5. 用户权利 🗝️</h2>
  <ul style="font-size:14px; line-height:1.6; padding-left:20px;">
    <li>📥 查看和导出个人信息</li>
    <li>🗑️ 删除授权信息或注销账户</li>
    <li>📞 联系我们处理相关隐私请求</li>
  </ul>

  <div style="margin-top:30px;">
    <h2 style="font-size:20px; font-weight:600; margin-bottom:15px;">6. 联系我们 📬</h2>
    <ul style="font-size:14px; line-height:1.6; padding-left:20px;">
      <li>邮箱：<a href="mailto:support@yourapp.com" style="color:#06f; text-decoration:none;">support@yourapp.com</a></li>
      <li>微信客服：your_wechat_id</li>
    </ul>
  </div>

  <div style="margin-top:30px; padding:15px; background-color:#f8f8f8; border-radius:5px;">
    <p style="font-size:14px; line-height:1.6; margin:0; color:#d32f2f;">⚠️ 本政策将根据实际情况更新，更新内容将在本页面进行公示。</p>
  </div>
</div>
`

onShareAppMessage(() => {
  return {
    title: '隐私政策',
    path: 'pages/private/private'
  }
})
</script>

<style lang="scss" scoped></style>
