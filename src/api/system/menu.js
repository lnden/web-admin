import request from '@/utils/request'

export default {
  /**
   * 获取菜单列表
   * @param {object} params
   * @returns
   */
  getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params
    })
  },
  /**
   * 菜单操作(新增/编辑/删除)
   * @param {object} params
   * @returns
   */
  getMenuOperate(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params
    })
  }
}