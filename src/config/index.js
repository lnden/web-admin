/**
 * @description 环境配置封装
 * @author lnden
 */

 const env = import.meta.env.MODE || 'prod'
 const EnvConf = {
   dev: {
     baseURL: '/api',
     mockURL: 'http://mock.pactera.xyz/mock/616646c2815a76477d287040/admin'
   },
   test: {
     baseURL: '/api',
     mockURL: 'http://mock.pactera.xyz/mock/616646c2815a76477d287040/admin'
   },
   production: {
     baseURL: 'http://www.pactera.xyz/api',
     mockURL: '',
   }
 }
 
 export default {
   env,
   mock: false,
   namespace: 'manager',
   ...EnvConf[env]
 }