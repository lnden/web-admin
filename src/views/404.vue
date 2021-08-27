<template>
  <div class="exception">
    <img src="@/assets/image/404.png" >
    <el-button @click="handleToHome">回首页</el-button>
  </div>
</template>

<script>
 export default {
   name: 'exception',
   methods: {
     handleToHome() {
       this.$router.push('/')
     }
   }
 }
</script>

<style lang="scss">
  .exception {
    font-size: 0;
    img {
      width: 100%;
      height: 100vh;
    }
    .el-button {
      position: fixed;
      bottom: 30px;
      left: 50%;
      margin-left: -34px;
    }
  }
</style>