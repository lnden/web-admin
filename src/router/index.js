/**
 * @description 路由配置
 * @author lnden
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from '@/layout/BasicLayout.vue'

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
      {
        name: 'user',
        path: 'user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/User.vue')
      },
      {
        name: 'menu',
        path: 'menu',
        meta: {
            title: '菜单管理'
        },
        component: () => import('@/views/Menu.vue')
      },
      {
        name: 'role',
        path: 'role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/views/Role.vue')
      },
      {
        name: 'dept',
        path: 'dept',
        meta: {
            title: '部门管理'
        },
        component: () => import('@/views/Dept.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router