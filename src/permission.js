import router from './router'

/**
 * @description 导航守卫 路由拦截
 */
router.beforeEach((to, form, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})