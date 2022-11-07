import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { SpyInstance, vi } from 'vitest'

import { useexerciseStore } from '../../../stores/exercise'
import Exercise from './exercise.vue'

vi.mock('vue-router') // mock the import

const pinia = createTestingPinia()
setActivePinia(pinia)

describe('Exercise', () => {
  beforeEach(() => {
    const estore = useexerciseStore()
    estore.getExercises = vi.fn()
    estore.addExercise = vi.fn()
    estore.exercises = [
      { id: 1, name: 'curls' },
      { id: 2, name: 'squat' },
      { id: 3, name: 'deadlift' }
    ]
  })

  it('should display exercise name', async () => {
    const VueRouter = await import('vue-router')
    const useRoute = VueRouter.useRoute as unknown as SpyInstance

    useRoute.mockReturnValueOnce({
      params: { exerciseId: 2 }
    })

    const wrapper = await mount(Exercise, {
      global: { plugins: [pinia] },
      props: {}
    })

    expect(wrapper.find('#exname').text()).toBe('Exercise squat')
  })
})
