/**
 * @description Mutations业务层数据
 * @author lnden
 */
 import storage from './../utils/storage'

 export default {
    saveUserInfo(state,userInfo){
      state.userInfo = userInfo;
      storage.setItem('userInfo',userInfo)
    }
 }