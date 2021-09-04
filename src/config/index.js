/**
 * @description 环境配置封装
 * @author lnden
 */

 const env = import.meta.env.MODE || 'prod'
 const EnvConf = {
   dev: {
     baseURL: '/api',
     mockURL: ' http://129.28.140.33:7200/mock/611e25f5533ee55fb589008d/api'
   },
   test: {
     baseURL: '/api',
     mockURL: ' http://129.28.140.33:7200/mock/611e25f5533ee55fb589008d/api'
   },
   prod: {
     baseURL: '/',
     mockURL: ''
   }
 }
 
 export default {
   env,
   mock: true,
   namespace: 'manager',
   ...EnvConf[env]
 }