<template>
  <el-form ref="queryForm" inline :model="queryModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]"/>
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * form = [
 *  {
 *    type: 'input',
 *    model: 'userId',
 *    label: '用户ID',
 *    placeholder: '请输入用户ID'
 *  }
 * ]
 */
import { getCurrentInstance, reactive } from 'vue'
import FormItem from './FormItem.vue'

export default {
  name: 'QueryForm',
  props: {
    modelValue: {
      type: Object,
      defaut: () => {}
    },
    form: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'handleQuery'],
  components: {
    FormItem,
  },
  setup (props, context) {
    const { ctx } = getCurrentInstance()
    const queryModel = reactive({
      ...props.modelValue
    })
    const handleReset = () => {
      ctx.$refs.queryForm.resetFields()
    }
    const handleQuery = () => {
      context.emit('update:modelValue', { ...queryModel })
      context.emit('handleQuery', { ...queryModel })
    }

    return {
      handleReset,
      handleQuery,
      queryModel
    }
  }
}
</script>

<style scoped>
</style>
