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
  font-family: 'Alibaba PuHuiT';
  src:
    url('~@/static/fonts/AlibabaPuHuiTi-3-55-Regular.woff') format('woff'),
    url('~@/static/fonts/AlibabaPuHuiTi-3-55-Regular.woff2') format('woff2'),
    url('~@/static/fonts/AlibabaPuHuiTi-3-55-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
