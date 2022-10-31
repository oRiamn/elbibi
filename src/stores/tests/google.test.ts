import { createPinia, setActivePinia } from 'pinia'
import { SpyInstance, spyOn } from 'vitest'
import * as loadScript from 'vue-plugin-load-script'
import { usegoogleStore } from '../google'

describe('Google Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should define isReady to false by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.isReady).toBe(false)
  })

  it('should define isAuthenticated to false by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.isAuthenticated).toBe(false)
  })

  it('should define spreadsheetId to null by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.spreadsheetId).toBe(null)
  })

  describe('loadGoogleApi', () => {
    let loadScriptSpy: SpyInstance
    let gapi: { load: SpyInstance; client: { load: SpyInstance } }
    beforeEach(() => {
      loadScriptSpy = spyOn(loadScript, 'loadScript')
      gapi = {
        load: vi.fn(),
        client: {
          load: vi.fn()
        }
      }
      window.gapi = gapi
      console.log = vi.fn()
      console.error = vi.fn()
    })

    it('should inject google api script base', async () => {
      loadScriptSpy.mockResolvedValue(true)
      gapi.load.mockImplementation((_n, callback) => callback())

      gapi.client.load.mockResolvedValue(true)

      const gstore = usegoogleStore()
      await gstore.loadGoogleApi()

      expect(loadScriptSpy.mock.calls).toStrictEqual([
        ['https://apis.google.com/js/api.js'],
        ['https://accounts.google.com/gsi/client']
      ])
    })

    it('should load client', async () => {
      loadScriptSpy.mockResolvedValue(true)
      gapi.load.mockImplementation((_n, callback) => callback())

      gapi.client.load.mockResolvedValue(true)

      const gstore = usegoogleStore()
      await gstore.loadGoogleApi()

      expect(gapi.load).toHaveBeenCalledTimes(1)
      expect(gapi.load).toHaveBeenCalledWith(
        'client',
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('should load drive version 3 using gapi.client.load', async () => {
      loadScriptSpy.mockResolvedValue(true)
      gapi.load.mockImplementation((_n, callback) => callback())

      gapi.client.load.mockResolvedValue(true)

      const gstore = usegoogleStore()
      await gstore.loadGoogleApi()

      expect(gapi.client.load).toHaveBeenCalledTimes(1)
      expect(gapi.client.load).toHaveBeenCalledWith('drive', 'v3')
    })

    describe('when google api fully loaded', () => {
      beforeEach(async () => {
        loadScriptSpy.mockResolvedValue(true)
        gapi.load.mockImplementation((_n, callback) => callback())

        gapi.client.load.mockResolvedValue(true)
      })
      it('should patch state.isReady to true', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(true)
      })

      it('should log succes message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith('google api is ready')
      })
    })

    describe('when api.js injection fail', () => {
      const errormsg = 'an error message'
      beforeEach(() => {
        loadScriptSpy.mockImplementation((url) => {
          if (url === 'https://apis.google.com/js/api.js') {
            return Promise.reject(errormsg)
          } else {
            return Promise.resolve()
          }
        })

        gapi.load.mockImplementation((_n, callback) => callback())

        gapi.client.load.mockResolvedValue(true)
      })
      it('should keep state.isReady to false', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(false)
      })

      it('should not log succes message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.log).toHaveBeenCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(errormsg)
      })
    })

    describe('when gsi/client injection fail', () => {
      const errormsg = 'an error message'
      beforeEach(() => {
        loadScriptSpy.mockImplementation((url) => {
          if (url === 'https://accounts.google.com/gsi/client') {
            return Promise.reject(errormsg)
          } else {
            return Promise.resolve()
          }
        })

        gapi.load.mockImplementation((_n, callback) => callback())

        gapi.client.load.mockResolvedValue(true)
      })
      it('should keep state.isReady to false', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(false)
      })

      it('should not log succes message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.log).toHaveBeenCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(errormsg)
      })
    })

    describe('when gapi.load fail', () => {
      const errormsg = 'an error message'

      beforeEach(async () => {
        loadScriptSpy.mockResolvedValue(true)
        gapi.load.mockImplementation((_n, _x, fail) => fail(errormsg))
      })

      it('should not try to load drive version 3 using gapi.client.load', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gapi.client.load).toHaveBeenCalledTimes(0)
      })

      it('should keep state.isReady to false', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(false)
      })

      it('should not log succes message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.log).toHaveBeenCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(errormsg)
      })
    })

    describe('when gapi.client.load fail', () => {
      const errormsg = 'an error message'

      beforeEach(async () => {
        loadScriptSpy.mockResolvedValue(true)
        gapi.load.mockImplementation((_n, callback) => callback())
        gapi.client.load.mockRejectedValue(errormsg)
      })

      it('should keep state.isReady to false', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(false)
      })

      it('should not log succes message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.log).toHaveBeenCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(errormsg)
      })
    })
  })
})
