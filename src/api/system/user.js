import request from '@/utils/request'

export default {
  /**
   * 登录接口
   * @param {object} params
   * @returns userInfo
   */
  login(params) {
    return request({
      url: '/users/login',
      method: 'post',
      data: params
    })
  },
  /**
   * 获取用户列表
   * @param {object} params 
   * @returns
   */
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params
    })
  },
  /**
   * 获取所有用户列表
   * @returns 
   */
  getAllUserList() {
    return request({
      url: '/users/allList',
      method: 'get',
      data: {}
    })
  },
  /**
   * 用户删除
   * @param {object} params 
   * @returns 
   */
  getUserDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params
    })
  },
  /**
   * 用户操作(新增/编辑)
   * @param {object} params 
   * @returns 
   */
  getUserSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params
    })
  },
  /**
   * 获取当前用户的路由和权限列表
   * @returns 
   */
  getPermissionList() {
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      data: {}
    })
  }
}