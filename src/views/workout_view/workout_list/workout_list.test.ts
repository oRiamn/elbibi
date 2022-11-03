import WorkoutList from './workout_list.vue'

import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useworkoutStore } from '@/stores/workout'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

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
