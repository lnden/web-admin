import request from '@/utils/request'

export default {
  /**
   * 获取角色列表
   * @param {object} params 
   * @returns 
   */
  getRoleList(params) {
    return request({
      url: '/roles/list',
      method: 'get',
      data: params,
    })
  },
  /**
   * 角色操作(新增/编辑/删除)
   * @param {object} params 
   * @returns 
   */
  getRoleOperate(params) {
    return request({
      url: '/roles/operate',
      method: 'post',
      data: params,
    })
  },
  /**
   * 更新角色权限
   * @param {object} params 
   * @returns 
   */
  updatePermission(params) {
    return request({
      url: '/roles/update/permission',
      method: 'post',
      data: params
    })
  },
  /**
   * 获取所有角色列表
   * @returns 
   */
  getRoleAllList() {
    return request({
      url: '/roles/allList',
      method: 'get',
      data: {}
    })
  }
}