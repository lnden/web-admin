/**
 * @description Vuex 状态管理
 * @author lnden
 */
import { createStore } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import storage from '../utils/storage'

const initState = {
  userInfo: storage.getItem('userInfo') || {},
  menuList: storage.getItem('menuList') || [],
  actionList: storage.getItem('actionList') || [],
  noticeCount: 0
}

export default createStore({
  state: initState,
  actions,
  mutations
})