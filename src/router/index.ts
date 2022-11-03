import { createRouter, createWebHistory } from 'vue-router'
import { usegoogleStore } from '@/stores/google'

import HomeView from '@/views/home.vue'
import LaunchView from '@/views/launch/launch.vue'

import ExerciseView from '@/views/exercise_view/exercise_view.vue'
import ExeciseList from '@/views/exercise_view/exercise_list/exercise_list.vue'
import Execise from '@/views/exercise_view/exercise/exercise.vue'

import WorkoutView from '@/views/workout_view/workout_view.vue'
import WorkoutList from '@/views/workout_view/workout_list/workout_list.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/workouts',
      component: WorkoutView,
      children: [
        {
          path: '',
          name: 'workout_list',
          component: WorkoutList
        }
      ]
    },
    {
      path: '/exercises',
      component: ExerciseView,
      children: [
        {
          path: '',
          name: 'exercise_list',
          component: ExeciseList
        },
        {
          path: ':exerciseId',
          name: 'exercise',
          component: Execise
        }
      ]
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
  const gstore = usegoogleStore()
  if (to.name !== 'launch' && !gstore.isAuthenticated) next({ name: 'launch' })
  else next()
})

export default router
