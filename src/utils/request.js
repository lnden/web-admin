/**
 * @description axios 二次封装
 * @author lnden
 */
 import axios from 'axios'
 import config from '../config'
 import { ElMessage } from 'element-plus'
 import router from '../router'
 
 const TOKEN_INVALID = 'Token认证失败，请重新登录'
 const NETWORK_ERROR = '网络请求异常，请稍后重试'
 
 // 创建axios实例对象， 添加全局配置
 const service = axios.create({
   baseURL: config.baseURL,
   timeout: 8000
 })
 
 // 请求拦截
 service.interceptors.request.use((req) => {
   // TO-DO
   const headers = req.headers
   if (!headers.Authorization) headers.Authorization = 'Bearer token'
   return req
 })
 
 // 响应拦截
 service.interceptors.response.use((res) => {
   const { code, data, msg } = res.data
   if (code == 20000) {
     return data
   } else if (code === 40001) {
     ElMessage.error(TOKEN_INVALID)
     setTimeout(() => {
       router.push('/login')  
     })
     return Promise.reject(TOKEN_INVALID)
   } else {
     ElMessage.error(msg || NETWORK_ERROR)
     return Promise.reject(msg || NETWORK_ERROR)
   }
 })
 
 /**
  * @description 请求核心函数
  * @param {*} options 请求配置
  * @returns 
  */
 function request(options) {
   options.method = options.method || 'get'
   if (options.method.toLowerCase === 'get') {
     options.params = options.data
   }
  let isMock = config.mock;
  if (typeof options.mock != 'undefined') {
    isMock = options.mock;
  }
   if (config.env === 'prod') {
     service.defaults.baseURL = config.baseURL
   } else {
     service.defaults.baseURL = isMock ? config.mockURL : config.baseURL
   }
   return service(options)
 }
 
 ['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
   request[item] = (url, data, options) => {
     return request({
       url,
       method: item,
       data,
       ...options
     })
   }
 })
 
 export default request