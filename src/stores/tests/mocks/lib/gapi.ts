import { SpyInstance } from 'vitest'

export type gapimock = {
  load: SpyInstance
  client: {
    init: SpyInstance
    load: SpyInstance
    drive: {
      files: {
        list: SpyInstance
      }
    }
    sheets: {
      spreadsheets: {
        create: SpyInstance
      }
    }
  }
}

export function doGapiMock(scope: any): gapimock {
  const mock = {
    load: vi.fn(),
    client: {
      load: vi.fn(),
      init: vi.fn(),
      drive: {
        files: {
          list: vi.fn()
        }
      },
      sheets: {
        spreadsheets: {
          create: vi.fn()
        }
      }
    }
  }

  Object.assign(scope, {
    gapi: mock
  })

  return mock
}
