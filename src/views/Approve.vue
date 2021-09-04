<template>
  <div class="approve-manage">
    <div class="query-form">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
      </div>
      <el-table
        :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              v-if="scope.row.curAuditUserName == userInfo.userName && [1, 2].includes(scope.row.applyState)"
              @click="handleView(scope.row)"
              type="primary"
              size="mini">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pager.pageSize"
        :total="pager.total" />
    </div>
    <el-dialog title="审核" width="50%" v-model="showDetailModal" destroy-on-close> 
      <el-form ref="dialogForm" :model="auditForm"  label-width="120px" label-suffix=":" :rules="rules">
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" placeholder="请输入审核备注" v-model="auditForm.remark"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')" type="primary">审核通过</el-button>
          <el-button @click="handleApprove('refuse')">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import util from '@/utils/util'

export default defineComponent({
  name: 'approve',
  setup() {
    const { $api, $message, $store } = getCurrentInstance().appContext.config.globalProperties
    const { ctx } = getCurrentInstance()

    const queryForm = reactive({
      applyState: 1
    })

    const showDetailModal = ref(false)
    const userInfo = $store.state.userInfo
    const auditForm = reactive({
      remark: ''
    })
    let detail = ref({
      applyStateName: '',
      applyTypeName: '',
      time: '',
      reasons: '',
      curAuditUserName: '',
      applyUser: {
        userName: ''
      }
    })

    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    
    // 定义动态表格-表头格式
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo',
        width: 100
      },
      {
        label: '申请人',
        prop: '',
        formatter(row) {
           return row.applyUser.userName
        },
         width: 70
      },
      {
        label: '休假时间',
        prop: 'time',
        width: 180,
        formatter: (row, column, value) => {
          return (
            util.formateDate(new Date(row.startTime), 'yyyy-MM-dd') + 
            ' 到 '
            + util.formateDate(new Date(row.endTime), 'yyyy-MM-dd')
          )
        }
      },
      {
        label: '休假时长',
        prop: 'leaveTime',
        width: 70
      },
      {
        label: '休假类型',
        prop: 'applyType',
        width: 70,
        formatter(row, column, value) {
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value]
        }
      },
      {
        label: '休假原因',
        prop: 'reasons'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        width: 160,
        formatter: (row, column, value) => {
          return util.formateDate(new Date(value))
        }
      },
      {
        label: '审批人',
        prop: 'auditUsers',
        width: 120
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName',
        width: 80
      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter(row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value]
        },
        width: 70
      }
    ])
  
    const applyList = ref([])
    // 定义表单校验规则
    const rules = reactive({
      remark: [
        { required: true, message: '请输入审核备注', trigger: 'change' },
      ],
  
    })
    onMounted(() => {
      getApplyList()
    })

    const getApplyList = async () => {
      let params = { ...queryForm, ...pager, type: 'approve' }
      const { list, page } = await $api.getApplyList(params)
      applyList.value = list
      pager.total = page.total
    }
    
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }

    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getApplyList()
    }

    const handleView = (row) => {
      let data = {...row}
      data.applyTypeName = {
        1: '事假',
        2: '调休',
        3: '年假'
      }[data.applyType]
      data.time = (
        util.formateDate(new Date(data.startTime), 'yyyy-MM-dd') + 
          ' 到 '
        + util.formateDate(new Date(data.endTime), 'yyyy-MM-dd')
      )
      data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
      }[data.applyState]
      detail.value = data
      showDetailModal.value = true
    }

    const handleClose = () => {
      showDetailModal.value = false
      handleReset('dialogForm')
    }

    const handleApprove = (action) => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if(!valid) return
        let params = { _id: detail.value._id, action, remark: auditForm.remark }
        try {
          await $api.getLeaveApprove(params)
          handleClose()
          $message.success('处理成功')
          getApplyList()
          $store.commit('saveNoticeCount', $store.state.noticeCount - 1)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return {
      handleReset,
      handleCurrentChange,
      queryForm,
      columns,
      pager,
      getApplyList,
      applyList,
      showDetailModal,
      detail,
      handleView,
      userInfo,
      auditForm,
      handleApprove,
      rules
    }
  }
})
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>