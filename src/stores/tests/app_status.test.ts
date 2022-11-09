import { createPinia, setActivePinia } from 'pinia'
import { SpyInstance, vi } from 'vitest'

import { useappStatusStore } from '../app_status'

describe('AppStatus Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should define isOnline using navigator API', () => {
    const fakeNavigatorOnline = 'onLineValue' as unknown as boolean;
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(fakeNavigatorOnline)
    const appstatusStore = useappStatusStore()
    expect(appstatusStore.isOnline).toBe(fakeNavigatorOnline)
  })

  it('should define isSynced to false by default', () => {
    const appstatusStore = useappStatusStore()
    expect(appstatusStore.isSynced).toBe(false)
  })

  describe('sync', () => {
    let spyAddEventListener: SpyInstance;
    beforeEach(() => {
      spyAddEventListener = vi.spyOn(window, 'addEventListener')
    });

    it('should add 2 event listener to window ', async () => {
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync();
      expect(spyAddEventListener).toBeCalledTimes(2)
    });

    it('should add event listener to online event ', async () => {
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync();
      expect(spyAddEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    });

    it('should add event listener to offline event ', async () => {
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync();
      expect(spyAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
    });

    it('should patch isSynced to true', async () => {
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync()
      expect(appstatusStore.isSynced).toBe(true)
    });

    it('should patch isOnline to true on online event', async () => {
      const event = new Event('online');
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync()
      appstatusStore.isOnline = false
      window.dispatchEvent(event);
      expect(appstatusStore.isOnline).toBe(true)
    })

    it('should patch isOnline to false on offline event', async () => {
      const event = new Event('offline');
      const appstatusStore = useappStatusStore()
      await appstatusStore.sync()
      appstatusStore.isOnline = true
      window.dispatchEvent(event);
      expect(appstatusStore.isOnline).toBe(false)
    })
  });

})
