<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="form" inline :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item  label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item  label="用户状态" prop="state">
          <el-select v-model="user.state"  placeholder="请选择状态">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        @selection-change="handleSelect">
        <el-table-column
          type="selection" width="55">
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
              <el-button @click="handleEdit" type="primary" size="mini">编辑</el-button>
              <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        @current-change="handleChange"
        :page-size="pager.pageSize"
        :total="pager.total" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, defineComponent, onMounted, reactive, ref } from 'vue'
export default defineComponent({
  name: 'user',
  setup() {
    // 获取 composition Api 上下文对象
    const { $api, $message } = getCurrentInstance().appContext.config.globalProperties
    const { ctx } = getCurrentInstance()

    // 初始化用户表单对象
    const user = reactive({
      userId: '',
      userName: '',
      state: 0
    })
    
    // 初始化用户列表数据
    const userList = ref([])

    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })

    // 定义动态表格-表头格式
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
         formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime'
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime'
      }
    ])

    // 选中用户列表的对象
    const checkeduserIds = ref([])

    // 初始化接口调用
    onMounted(() => {
      getUserList()
    })

    // 获取用户列表
    const getUserList = async () => {
      let params = {...user, ...pager}
      try {
        const {page, list} = await $api.getUserList(params)
        userList.value = list
        pager.total = page.total
      } catch (error) {
        
      }
    }
    
    // 查询方法
    const handleSearch = () => {
      getUserList()
    }
    // 重置方法
    const handleReset = () => {
      ctx.$refs.form.resetFields()
    }
    // 列表编辑方法
    const handleEdit = () => {

    }
    // 列表删除方法
    const handleDel = async (row) => {
      const res = await $api.getUserDel({
        userIds: [row.userId]
      })
      if (res.nModified > 0) {
        $message.success('刪除成功')
        getUserList()
      } else {
        $message.success('修改失败')
      }
    }
    // 列表批量刪除
    const handlePatchDel = async () => {
      if (checkeduserIds.value.length == 0 ) {
         $message.error('请选择要删除的用户')
         return 
      }
      const res = await $api.getUserDel({
        userIds: [checkeduserIds.value]
      })
      if (res.nModified > 0) {
        $message.success('刪除成功')
        getUserList()
      } else {
        $message.success('修改失败')
      }
    }

    // 表格多选
    const handleSelect = (list) => {
      let arr = []
      list.map(item => {
        arr.push(item.userId)
      })
      checkeduserIds.value = arr
    }

    const handleChange = (current) => {
      pager.pageNum = current
    }

    return {
      user,
      handleSearch,
      handleReset,
      userList,
      columns,
      handleEdit,
      handleDel,
      handlePatchDel,
      getUserList,
      pager,
      handleChange,
      handleSelect
    }
  }
})
</script>

<style lang="scss">
</style>
