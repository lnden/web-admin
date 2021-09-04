import request from '@/utils/request'

export default {
  /**
   * 获取待审批消息数量
   * @returns 
   */
  getNoticeCount() {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {}
    })
  },
  /**
   * 审批操作(通过/驳回)
   * @param {object} params 
   * @returns 
   */
  getLeaveApprove(params) {
    return request({
      url: '/leave/approve',
      method: 'post',
      data: params
    })
  }
}