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
   getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params,
      mock: true,
    })
  },
  getUserDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  getRoleList() {
    return request({
      url: '/roles/alList',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get',
      data: {},
      mock: true,
    })
  },
  userSubmit(params) {
    return request({
      url: '/users/operate',
      method: 'post',
      data: params,
      mock: true,
    })
  },
  menuSubmit(params) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data: params,
      mock: false,
    })
  },
 }