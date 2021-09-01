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
import QueryForm from './../packages/QueryForm/index'

const app = createApp(App)

app.directive('has', {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    const userAction = storage.getItem('actionList')
    const value = binding.value
    // 判断列表中是否有对应按钮权限标识
    const hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style = 'display: none;'
      setTimeout(() => {
        el.parentNode.removeChild(el)
      })
    }
  }
})


app.config.globalProperties.$api = api
app.config.globalProperties.$request = request
app.config.globalProperties.$storeage = storage

app.use(router)
  .use(store)
  .use(ElementPlus, { size: 'small', zIndex: 3000 })
  .use(QueryForm)
  .mount('#app')
