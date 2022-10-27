import { createPinia, setActivePinia } from 'pinia'

import { usegoogleStore } from './google'

describe('Google Store', () => {
  beforeEach(() => {    
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const google = usegoogleStore()
    expect(google.someValue).toBe(0)
    google.increment(1)
    expect(google.someValue).toBe(1)
  })  
})
