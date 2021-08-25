<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate()">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleSetting(scope.row)" type="primary" size="mini">设置权限</el-button>
            <el-button type="danger" @click="handleDel(scope.row._id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"/>
    </div>
    <el-dialog title="创建角色" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea"  :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框 -->
    <el-dialog title="设置权限" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }">

          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/util";

export default {
  name: "role ",
  data() {
    return {
      queryForm: {
        roleName: '',
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
             let names = []
            let list = value.halfCheckedKeys || []
            list.map(key => {
              if (this.actionMap[key]) names.push(this.actionMap[key])
            })
            return names.join(',')
          }
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      roleList: [],
      pager: {
        total: 0,
        pageSize: 10
      },
      showModal: false,
      roleForm: {
        roleName: '',
        remark: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称' }
        ]
      },
      showPermission: false,
      curRoleName: '',
      curRoleId: '',
      menuList: [],
      // 菜单映射表
      actionMap: {}
    };
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    // 角色列表初始化
    async getRoleList() {
      try {
        let { page, list } = await this.$api.getRoleList(this.queryForm)
        this.roleList = list
        this.pager.total = page.total
      } catch (e) {
        throw new Error(e)
      }
    },
    // 菜单列表初始化
    async getMenuList() {
      try {
        let list= await this.$api.getMenuList()
        this.menuList = list
        this.getActionMap(list)
      } catch (e) {
        throw new Error(e)
      }
    },
    getActionMap(list) {
      let actionMap = {}
      const deep = (arr) => {
        while(arr.length) {
          let item = arr.pop()
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName
          }
          if (item.children && !item.action) {
            deep(item.children)
          }
        }
      }
      deep(JSON.parse(JSON.stringify(list)))
      this.actionMap = actionMap
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 设置权限
    handleSetting(row) {
      this.curRoleId = row._id
      this.curRoleName = row.roleName
      this.showPermission = true
      let { checkedKeys } = row.permissionList
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.tree.getCheckedNodes()
      console.log(nodes)
      let halfKeys = this.$refs.tree.getHalfCheckedKeys()
      let checkedKeys = []
      let parentKeys = []
      console.log(halfKeys)
      nodes.map(node => {
        if (!node.children) {
          checkedKeys.push(node._id)
        } else {
          parentKeys.push(node._id)
        }
      })
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys)
        }
      }
      await this.$api.updatePermission(params)
      this.showPermission = false
      this.$message.success('设置成功')
      this.getRoleList()
    },
    handleCreate() {
      this.action = "create";
      this.showModal = true
    },
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        Object.assign(this.roleForm, row);
      });
    },
    async handleDel(_id) {
      await this.$api.roleOperate({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (!valid) return 
        let { action, roleForm } = this;
        let params = { ...roleForm, action };
        let res = await this.$api.roleOperate(params);
        this.showModal = false;
        this.$message.success("操作成功");
        this.handleReset("dialogForm");
        this.getRoleList();
      });
    },
    // 弹框关闭
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
  },
};
</script>