import { createPinia, setActivePinia } from 'pinia'

import { usegoogleStore } from '../google'

describe('Google Store', () => {
  beforeEach(() => {    
    setActivePinia(createPinia())
  })

  it('should define isReady to false by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.isReady).toBe(false)
  })
})
