<template>
  <el-input 
    :modelValue="userName"
    @update:modelValue="handleInput"
    ></el-input>
    <el-button @click="handleSubmit">提交测试</el-button>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'v-input',
  props: ['modelValue', 'title'],
  emits: ['update:modelValue', 'handleSubmit'],
  setup(props, context) {
    let userName = ref(props.modelValue)
    
    const handleInput = (val) => {
      userName.value = val
      context.emit('update:modelValue', val)
    }
    const handleSubmit = () => {
      context.emit('handleSubmit', userName)
    }

    return {
      userName,
      handleInput,
      handleSubmit
    }
  },
})
</script>

