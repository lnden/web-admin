/**
 * @description Vuex 状态管理
 * @author lnden
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const initState = {
  userInfo: '' || storage.getItem('userInfo')
}

export default createStore({
  state: initState,
  mutations
})