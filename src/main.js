import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'normalize.css'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import Rocket from './../packages'
import directive from '@/directive'
import '@/permission'

const app = createApp(App)

app.config.globalProperties.$api = api
app.config.globalProperties.$request = request
app.config.globalProperties.$storeage = storage

app.use(router)
  .use(store)
  .use(ElementPlus, { size: 'small', zIndex: 3000 })
  .use(Rocket)
  .use(directive)
  .mount('#app')
