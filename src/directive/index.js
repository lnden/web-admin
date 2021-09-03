
import storage from '../utils/storage'

/**
 * @description 自定义指令以插件的方式使用 app.use() 权限验证指令使用方式使用 v-has="'user-add'"
 * @param {Vue} app 
 */
function has(app) {
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
}

export default {
  install(app){
    app.use(has)
  }
}