/**
 * @description API 管理
 * @author lnden
 */
 import request from '../utils/request'

 export default {
   login(params) {
     request({
       url: '/users/login',
       method: 'post',
       dataL: params,
       mock: false
     })
   }
 }