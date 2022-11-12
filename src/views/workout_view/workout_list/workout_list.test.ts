import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { vi } from 'vitest'

import { useexerciseStore } from '@/stores/exercise'
import { useworkoutStore } from '@/stores/workout'

import WorkoutList from './workout_list.vue'


const pinia = createTestingPinia()
setActivePinia(pinia)

describe('WorkoutList', () => {

  beforeEach(() => {
    const wstore = useworkoutStore()
    wstore.getWorkouts = vi.fn()
    wstore.workouts = []
    
    const estore = useexerciseStore()
    estore.getExercises = vi.fn()
    estore.exercises =  []
  })

  it('should load workouts list on setup', async () => {
    const wstore = useworkoutStore()
    await mount(WorkoutList, {
      global: { plugins: [pinia] },
      props: {}
    })
    expect(wstore.getWorkouts).toHaveBeenCalledTimes(1)
  })

  describe('should wait while workouts not synced', () => {
    const divid = '#addworkout'
    const listid = '#worklist'
    const wstore = useworkoutStore()

    it('should not display add div when workouts not synced', async () => {
      wstore.synced = false

      const wrapper = await mount(WorkoutList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(divid).exists()).toBe(false)
    })

    it('should display add div when workouts synced', async () => {
      wstore.synced = true

      const wrapper = await mount(WorkoutList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(divid).exists()).toBe(true)
    })

    it('should not display workout list when workouts not synced', async () => {
      wstore.synced = false

      const wrapper = await mount(WorkoutList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(listid).exists()).toBe(false)
    })

    it('should display workout list when workouts synced', async () => {
      wstore.synced = true

      const wrapper = await mount(WorkoutList, {
        global: { plugins: [pinia] }
      })

      expect(wrapper.find(listid).exists()).toBe(true)
    })
  })
  
  describe('should add new workout', () => {
    it.todo('test add workout')
    it.todo('add validation form')
    it.todo('test display list refresh')
  })

})
