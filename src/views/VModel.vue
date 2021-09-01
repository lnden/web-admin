<template>
  <v-input v-model="userName" v-model:title="title" @handleSubmit="handleSubmit"/>
</template>

<script>
import { defineComponent, ref } from 'vue'
import VInput from './components/VInput.vue'

  export default defineComponent({
    name: 'vmodel',
    components: {
      VInput
    },
    setup() {
      let userName = ref('jack')
      let title = ref('vue3')

      const handleSubmit = (values) => {
        console.log('接受数据：', values) 
        console.log('当前对象：', userName) 
      } 

      return {
        userName,
        title,
        handleSubmit
      }
    }
  })
</script>