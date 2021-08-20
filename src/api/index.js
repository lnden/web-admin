/**
 * @description API 管理
 * @author lnden
 */
 import request from '../utils/request'

 export default {
   login(params) {
     return request({
       url: '/users/login',
       method: 'post',
       data: params
     })
   }
 }