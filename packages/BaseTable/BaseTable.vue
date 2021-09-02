<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column type="selection" width="55" v-if="item.type == 'selection'" key="selection"></el-table-column>
        <el-table-column v-else-if="!item.type" v-bind="item"></el-table-column>
        <el-table-column v-if="item.type == 'operate'" v-bind="item">
          <template  #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button v-if="btn.visible" :type="btn.type || 'text'" :size="btn.size" @click="handleOperate(index, scope.row)">
                {{btn.text}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :page-size="pager.pageSize"
      :total="pager.total" />
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: ['columns', 'pager'],
  emits: ['handleOperate', 'handleCurrentChange'],
  setup(props, context) {

    /**
     * @description 列按钮点击
     * @param index {number} 索引
     * @param row {object} 行数据
     */
    const handleOperate = (index, row) => {
      context.emit('handleOperate', { index, row: { ...row } })
    }

    /**
     * @description 页码变化
     * @param pageNum {number} 页码
     */
    const handleCurrentChange = (pageNum) => {
      console.log(pageNum, 111)
      context.emit('handleCurrentChange', pageNum)
    }

    return {
      handleOperate,
      handleCurrentChange
    }
  }
}
</script>

<style>

</style>