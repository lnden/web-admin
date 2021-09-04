/**
 * @description 审批管理API集合
 * @param {Object} 
 *  leave 休假审批
 *  approve 待审批
 */
import leave from './leave'
import approve from './approve'

export default {
  ...leave,
  ...approve
}