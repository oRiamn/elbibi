import { createRouter, createWebHistory } from 'vue-router'
import { usegoogleStore } from '@/stores/google'

import HomeView from '../views/home.vue'
import LaunchView from '../views/launch/launch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/launch',
      name: 'launch',
      component: LaunchView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/about.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/settings.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const gstore = usegoogleStore();
  if (to.name !== 'launch' && !gstore.isAuthenticated) next({ name: 'launch' })
  else next()
})

export default router
