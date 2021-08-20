<template>
  <el-button @click="handleClick">去登录页</el-button>
  <h1>欢迎页</h1>
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