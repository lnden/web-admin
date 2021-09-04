import request from '@/utils/request'

export default {
  /**
   * 获取休假/待审批列表
   * @param {object} params 
   * @returns 
   */
  getApplyList(params) {
    return request({
      url: '/leave/list',
      method: 'get',
      data: params
    })
  },
  /**
   * 休假操作(创建/作废)
   * @param {object} params 
   * @returns 
   */
  getLeaveOperate(params) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data: params
    })
  }
}