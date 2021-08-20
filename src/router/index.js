/**
 * @description 路由配置
 * @author lnden
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from '../layout/BasicLayout.vue'

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
        component: () => import('../views/Welcome.vue')
      },
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录页'
    },
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router