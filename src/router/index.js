/**
 * @description 路由配置
 * @author lnden
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from '@/layout/BasicLayout.vue'
import storage from '@/utils/storage'
import API from '@/api'
import util from '@/utils/util'

const routes = [
  {
    name: 'layout',
    path: '/',
    meta: {
      title: '首页'
    },
    component: BasicLayout,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('@/views/Welcome.vue')
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('@/views/Login.vue')
  },
  {
    name: 'system',
    path: '/system',
    meta: {
      title: '系统管理'
    },
    component: BasicLayout,
    children: [
      // {
      //   name: 'user',
      //   path: 'user',
      //   meta: {
      //     title: '用户管理'
      //   },
      //   component: () => import('@/views/User.vue')
      // },
      // {
      //   name: 'menu',
      //   path: 'menu',
      //   meta: {
      //       title: '菜单管理'
      //   },
      //   component: () => import('@/views/Menu.vue')
      // },
      // {
      //   name: 'role',
      //   path: 'role',
      //   meta: {
      //     title: '角色管理'
      //   },
      //   component: () => import('@/views/Role.vue')
      // },
      // {
      //   name: 'dept',
      //   path: 'dept',
      //   meta: {
      //       title: '部门管理'
      //   },
      //   component: () => import('@/views/Dept.vue')
      // }
    ]
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('@/views/404.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * @description 判断当前地址是否可以访问
 * @param {*} path  => router.hasRoute(to.name)
 * @returns 
 */
// function checkPermission(path) {
//   const hasPermission = router.getRoutes().filter(route => route.path === path).length
//   if (hasPermission) {
//     return true
//   } else {
//     return false
//   }
// }

async function loadAsyncRoutes() {
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

await loadAsyncRoutes()

// 导航守卫
router.beforeEach((to, form, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router