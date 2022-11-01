import { SpyInstance } from 'vitest'

export type googlemock = {
  accounts: {
    oauth2: {
      initTokenClient: SpyInstance
    }
  }
}
export function doGoogleMock(scope: any): googlemock {
  const mock = {
    accounts: {
      oauth2: {
        initTokenClient: vi.fn()
      }
    }
  }

  Object.assign(scope, {
    google: mock
  })

  return mock
}
