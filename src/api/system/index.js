/**
 * @description 系统管理API集合
 * @param {Object} 
 *  user 用户管理
 *  menu 菜单管理
 *  role 角色管理
 *  dept 部门管理
 */
import user from './user'
import menu from './menu'
import role from './role'
import dept from './dept'

export default {
  ...user,
  ...role,
  ...menu,
  ...dept
}