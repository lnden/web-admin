/**
 * @description API 管理
 * @author lnden
 */
 import request from '@/utils/request'

 export default {
   login(params) {
     return request({
       url: '/users/login',
       method: 'post',
       data: params
     })
   },
   noticeCount() {
     return request({
       url: '/leave/count',
       method: 'get',
       data: {},
       mock: true,
     })
   },
   getMenuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {},
      mock: true,
    })
  }
 }