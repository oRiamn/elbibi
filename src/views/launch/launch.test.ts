import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

import { mount } from '@vue/test-utils'
import Launch from './launch.vue'
import { usegoogleStore } from '@/stores/google'

const pinia = createTestingPinia()
setActivePinia(pinia)

describe('Launch', () => {
  beforeEach(() => {
    const gstore = usegoogleStore()
    gstore.loadGoogleApi = vi.fn()
    gstore.authenticate = vi.fn()
  })
  it('should load google api on setup', async () => {
    const gstore = usegoogleStore()
    await mount(Launch, {
      global: { plugins: [pinia] },
      props: {}
    })
    expect(gstore.loadGoogleApi).toHaveBeenCalledTimes(1)
  })

  describe('should wait while app is not ready', () => {
    const btnid = '#authentbtn'
    const gstore = usegoogleStore()
    it('should not display button when app is not ready', async () => {
      gstore.isReady = false

      const wrapper = await mount(Launch, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(btnid).exists()).toBe(false)
    })

    it('should display button when app is ready', async () => {
      gstore.isReady = true

      const wrapper = await mount(Launch, {
        global: { plugins: [pinia] },
        props: {}
      })

      expect(wrapper.find(btnid).exists()).toBe(true)
    })
  })

  it('should call authenticate action on authenticate button click', async () => {
    const mockRouter = {
      push: vi.fn()
    }

    const btnid = '#authentbtn'

    const gstore = usegoogleStore()

    const wrapper = await mount(Launch, {
      global: { plugins: [pinia], mocks: { $router: mockRouter } },
      props: {}
    })

    await wrapper.find(btnid).trigger('click')

    expect(gstore.authenticate).toHaveBeenCalledTimes(1)
  })

  it('should redirect user to home page after authentication', async () => {
    const mockRouter = {
      push: vi.fn()
    }

    const btnid = '#authentbtn'
    
    const wrapper = await mount(Launch, {
      global: { plugins: [pinia], mocks: { $router: mockRouter } },
      props: {}
    })

    await wrapper.find(btnid).trigger('click')

    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'home' })
  })
})
