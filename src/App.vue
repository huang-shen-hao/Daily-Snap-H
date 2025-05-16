<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
/* 每个页面公共css */
@import './static/icon/remixicon.css';

@font-face {
  font-family: 'Alibaba PuHuiTi';
  src:
    url('https://daily-snap.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-3-55-Regular.woff'),
    url('https://daily-snap.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-3-55-Regular.ttf'),
    url('https://daily-snap.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-3-55-Regular.woff2');
}
</style>
