<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item>
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="handleDel(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="TITLE"
      v-model="showModal">
      <el-form 
        ref="dialogForm" 
        :model="deptForm" 
        :rules="rules"
        label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            clearable
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            :options="deptList"> 
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleChange">
            <el-option 
            v-for="item in userList" 
            :key="item.userId" 
            :label="item.userName"
            :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input 
          disabled 
          placeholder="请输入负责人邮箱"
           v-model="deptForm.userEmail"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dept',
  data() {
    return {
      queryForm: {
        deptName: ''
      },
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      action: 'create',
      showModal: false,
      deptForm: {
        parentId: [null],
        deptName: '',
        user: '',
        userName: '',
        userEmail: ''
      },
      userList: [],
      rules: {
        parentId: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        user: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ]
      },
      columns: [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '负责人',
          prop: 'userName'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
       {
          label: '创建时间',
          prop: 'createTime'
        }
      ]
    }
  },
  computed: {
    TITLE({action}) {
      return action === 'create' ? '创建部门' : '编辑部门'
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  },
  methods: {
    handleChange(val) {
      const [userId, userName, userEmail] = val.split('/')
      Object.assign(this.deptForm, { userId, userName, userEmail })
    },
    async handleDel({_id}) {
      this.action = 'delete'
      await this.$api.getDeptOperate({ _id, action: this.action })
      this.$message.success('删除成功')
      this.getDeptList()
    },
    handleSearch() {},
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    async getAllUserList() {
      let list = await this.$api.getAllUserList()
      this.userList = list
    },
    async getDeptList() {
      let list = await this.$api.getDeptList({
        ...this.queryForm,
        ...this.pager
      })
      this.deptList = list
    },
    handleCreate(row) {
      this.action = 'create'
      this.showModal = true
    },
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        Object.assign(this.deptForm, row , { user: `${row.userId}/${row.userName}/${row.userEmail}` })
      })
      console.log(row)
    }, 
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (!valid) return
        let params = {...this.deptForm, action: this.action}
        delete params.user
        let res = await this.$api.getDeptOperate(params)
        if (res) {
          this.$message.success('操作成功')
          this.handleClose()
          this.getDeptList()
        }
      })
    }
  }
}
</script>

