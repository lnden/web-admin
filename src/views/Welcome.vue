<template>
  <div class="welcome-wrapper">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">技术栈: Vue3.0 + ElementPlus + Node + Mongo + ES6</div>
      <div class="desc">完整的权限控制</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    methods: {
      handleClick() {
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="scss">
  .welcome-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #fff;
    .content {
      /* 自身定位，相对自身距底部40px */
      position: relative;
      bottom: 40px;
      .sub-title {
        font-size: 30px;
        line-height: 42px;
        color: #333333;
      }
      .title {
        font-size: 20px;
        line-height: 62px;
        color: #409eff;
      }
      .desc {
        text-align: right;
        font-size: 14px;
        color: #999999;
      }
    }
    .img {
      margin-left: 105px;
      background: url('../assets/image/welcome.png') no-repeat;
      width: 371px;
      height: 438px;
    }
  }
</style>