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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
          :formatter="item.formatter"
          :width="item.width">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
              <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
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
    <el-dialog title="用户新增" v-model="showModal">
      <el-form ref="dialogForm" :model="userForm"  label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" :disabled="action == 'edit'" placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" :disabled="action == 'edit'" placeholder="请输入用户邮箱">
            <template #append>@admin.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户手机号"/>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入用户岗位"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state"  placeholder="请选择用户状态">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" multiple style="width:100%" placeholder="请选择用户系统角色">
            <el-option 
              v-for="role in roleList" 
              :key="role._id" 
              :label="role.roleName" 
              :value="role._id"></el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
           <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            style="width:100%" 
            clearable>
           </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, defineComponent, onMounted, reactive, ref, toRaw } from 'vue'
import utils from '@/utils/util'

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

    // 新增用户对象
    const userForm = reactive({
      userName: '',
      userEmail: '',
      mobile: '',
      job: '',
      state: 3,
      roleList: '',
      deptId: ''
    })

    // 定义表单校验规则
    const rules = reactive({
      userName: [
        { required: true, message: '请输入用户名称', trigger: 'blur' },
      ],
      userEmail: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
      ],
      mobile: [
        { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ],
      deptId: [
        { required: true, message: '请选择当前部门', trigger: 'change' },
      ]
    })

    // 所有的角色列表
    const roleList = ref([])

    // 部门列表
    const deptList = ref([])

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
        prop: 'userEmail',
        width: '140'
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
        prop: 'createTime',
        width: '180',
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value))
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
         width: '180',
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value))
        }
      }
    ])

    // 选中用户列表的对象
    const checkeduserIds = ref([])

    // 弹框显示对象
    const showModal = ref(false)

    // 初始化接口调用
    onMounted(() => {
      getUserList()
      getRoleAllList()
      getDeptList()
    })
    
    // 获取部门列表
    const getDeptList = async () => {
      const list = await $api.getDeptList()
      deptList.value = list
    }

    // 定义用户操作的行为
    const action = ref('create')

    // 获取角色列表
    const getRoleAllList = async () => {
      const list = await $api.getRoleAllList()
      roleList.value = list
    }

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
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }

    // 列表编辑方法
    const handleEdit = (row) => {
      action.value = 'edit'
      showModal.value = true
      ctx.$nextTick(() => {
        Object.assign(userForm, row)
      })
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
      getUserList()
    }

    const handleCreate = () => {
      action.value = 'create'
      showModal.value = true
    }

    // 用户弹框关闭
    const handleCancel = () => {
      showModal.value = false
      handleReset('dialogForm')
    }

    // 用户新增提交
    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if (!valid) return
        let params = toRaw(userForm)
        params.userEmail += '@admin.com'
        params.action = action.value

        const res = await $api.userSubmit(params)
        if (res) {
          showModal.value = false
          $message.success(res)
          handleReset('dialogForm')
          getUserList()
        }
      })
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
      handleSelect,
      handleCreate,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      handleCancel,
      handleSubmit,
      action
    }
  }
})
</script>

<style lang="scss">
</style>
