<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="所有"></el-option>
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleView(scope.row)" type="primary" size="mini">查看</el-button>
            <el-button v-if="[1, 2].includes(scope.row.applyState)" @click="handleDel(scope.row)" type="danger" size="mini">作废</el-button>
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
    <el-dialog
      title="申请休假"
      v-model="showModel">
      <el-form ref="dialogForm" :model="leaveForm" label-width="100px" :rules="rules">
        <el-form-item label="休假类型" required>
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker 
                  v-model="leaveForm.startTime"
                  type="date"
                  @change="(val) => handleDateChaneg('startTime', val)"
                  placeholder="请选择开始日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker 
                  v-model="leaveForm.endTime"
                  type="date"
                  @change="(val) => handleDateChaneg('endTime', val)"
                  placeholder="请选择结束日期"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长">
          <span>{{leaveForm.leaveTime}}</span>
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input 
          type="textarea" 
          :row="3"
          v-model="leaveForm.reasons"
          placeholder="请输入休假原因"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal" destroy-on-close> 
      <el-steps :active="detail.applyState > 2 ? 3 : detail.applyState" align-center finish-status="success">
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批拒绝/审批通过"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
          <div>{{ detail.applyState }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import util from '@/utils/util'

export default defineComponent({
  name: 'leave',
  setup() {
    const { $api, $message } = getCurrentInstance().appContext.config.globalProperties
    const { ctx } = getCurrentInstance()

    const queryForm = reactive({
      applyState: 1
    })

    const showModel = ref(false)
    const showDetailModal = ref(false)
    // create:创建  delete:作废
    const action = ref('create')

    let detail = ref({
      applyState: 1,
      applyTypeName: '',
      time: '',
      reasons: '',
      curAuditUserName: ''
    })
    const leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ''
    })

    // 定义表单校验规则
    const rules = reactive({
      startTime: [
        { type: 'date', required: true, message: '请输入开始日期', trigger: 'change' },
      ],
      endTime: [
        { type: 'date', required: true, message: '请输入结束日期', trigger: 'change' },
      ],
      reasons: [
         { required: true, message: '请输入休假原因', trigger: ['change', 'blur'] },
      ]
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
        width: 120
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
        prop: 'reasons',
        width: 70
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
        prop: 'auditUsers'
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName'
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
        }
      }
    ])
  
    const applyList = ref([])

    onMounted(() => {
      getApplyList()
    })

    const getApplyList = async () => {
      let params = { ...queryForm, ...pager, type: 'leave' }
      const { list, page } = await $api.getApplyList(params)
      applyList.value = list
      pager.total = page.total
    }
    
    const handleApply = () => {
      showModel.value = true 
      action.value = 'create'
    }

    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }

    const handleClose = () => {
      showModel.value = false
      handleReset('dialogForm')
    }

    const handleDateChaneg = (key, val) => {
      let  { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return
      if (startTime > endTime) {
        $message.error('开始日期不能晚于结束日期')
        leaveForm.leaveTime = '0天'
        setTimeout(() => {
          leaveForm[key] = ''
        })
      } else {
        leaveForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + '天'
      }
    }

    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if(!valid) return
        try {
          let params = { ...leaveForm, action: action.value }
          await $api.leaveOperate(params)
          $message.success('操作成功')
          handleClose()
          getApplyList()
        } catch (error) {
          console.log(error)
        }
      })
    }

    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
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

    const handleDel = (_id) => {
      action.value = 'delete'
      try {
        let params = { _id, action: action.value }
        const { list, page } = $api.leaveOperate(params)
        applyList.value = list 
        pager.total = page.total
        $message.success('操作成功')
        getApplyList()
      } catch (error) {
        console.log(error)
      }
    }

    return {
      handleReset,
      handleCurrentChange,
      queryForm,
      columns,
      pager,
      getApplyList,
      handleApply,
      applyList,
      showModel,
      leaveForm,
      handleClose,
      handleSubmit,
      rules,
      handleDateChaneg,
      showDetailModal,
      detail,
      handleView,
      handleDel
    }
  }
})
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>