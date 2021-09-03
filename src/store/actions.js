/**
 * @description Actions
 * @author lnden
 */
import storage from '@/utils/storage'
import API from '@/api'
import util from '@/utils/util'
import router from '@/router'

export default {
  async setRouter() {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
      const { menuList } =  await API.getPermissionList()
      let routes = util.generateRoute(menuList)
      routes.map(route => {
        let url = `./../views/${route.component}.vue`
        route.component = () => import(url)
        router.addRoute('system', route)
      })
    }
  }
}