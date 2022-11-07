import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { vi } from 'vitest'

import { useworkoutStore } from '@/stores/workout'

import WorkoutList from './workout_list.vue'

const pinia = createTestingPinia()
setActivePinia(pinia)

describe('WorkoutList', () => {

  beforeEach(() => {
    const wstore = useworkoutStore()
    wstore.getWorkouts = vi.fn()
  })

  it('should load exercise list on setup', async () => {
    const wstore = useworkoutStore()
    await mount(WorkoutList, {
      global: { plugins: [pinia] },
      props: {}
    })
    expect(wstore.getWorkouts).toHaveBeenCalledTimes(1)
  })

  it.todo('should wait while workouts not synced')

})
