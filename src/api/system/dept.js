import request from '@/utils/request'

export default {
  /**
   * 获取部门列表
   * @returns 
   */
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get',
      data: {}
    })
  },
  /**
   * 部门操作(新增/编辑/删除)
   * @param {object} params 
   * @returns 
   */
  getDeptOperate(params) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data: params
    })
  }
}