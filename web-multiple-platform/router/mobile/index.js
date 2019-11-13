import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
    path: '/',
    name: 'Home',
    component: Index,
    children: [
        { path: '/', component: Home, name: '首页' }
    ],
  },
]
})

router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = '/page/pc/p_index.html#/'
    return
  }
  next()
})

export default router
