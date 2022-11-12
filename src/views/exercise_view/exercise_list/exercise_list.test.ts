import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { vi } from 'vitest'

import { useexerciseStore } from '@/stores/exercise'

import ExerciseList from './exercise_list.vue'

const pinia = createTestingPinia()
setActivePinia(pinia)

describe('ExerciseList', () => {
  beforeEach(() => {
    const estore = useexerciseStore()
    estore.getExercises = vi.fn()
    estore.addExercise = vi.fn()
  })

  it('should load exercise list on setup', async () => {
    const estore = useexerciseStore()
    await mount(ExerciseList, {
      global: { plugins: [pinia] },
      props: {}
    })
    expect(estore.getExercises).toHaveBeenCalledTimes(1)
  })

  describe('should wait while exercises not synced', () => {
    const divid = '#addexdiv'
    const listid = '#exlist'
    const estore = useexerciseStore()

    it('should not display add div when exercises not synced', async () => {
      estore.synced = false

      const wrapper = await mount(ExerciseList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(divid).exists()).toBe(false)
    })

    it('should display add div when exercises synced', async () => {
      estore.synced = true

      const wrapper = await mount(ExerciseList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(divid).exists()).toBe(true)
    })

    it('should not display exercise list when exercises not synced', async () => {
      estore.synced = false

      const wrapper = await mount(ExerciseList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(listid).exists()).toBe(false)
    })

    it('should display exercise list when exercises synced', async () => {
      estore.synced = true

      const wrapper = await mount(ExerciseList, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(listid).exists()).toBe(true)
    })
  })

  it.todo('should go to exercise on click')

  describe('should add new exercise', () => {
    it.todo('test add exercise')
    it.todo('add validation form')
    it.todo('test display list')
  })
})
