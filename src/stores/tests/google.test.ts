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
      gapi.load.mockImplementation((_n, { callback }) => callback())

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
      gapi.load.mockImplementation((_n, { callback }) => callback())

      gapi.client.load.mockResolvedValue(true)

      const gstore = usegoogleStore()
      await gstore.loadGoogleApi()

      expect(gapi.load).toHaveBeenCalledTimes(1)
      expect(gapi.load).toHaveBeenCalledWith('client', {
        onerror: expect.any(Function),
        ontimeout: expect.any(Function),
        callback: expect.any(Function),
        timeout: expect.any(Number)
      })
    })

    it('should load drive version 3 using gapi.client.load', async () => {
      loadScriptSpy.mockResolvedValue(true)
      gapi.load.mockImplementation((_n, { callback }) => callback())

      gapi.client.load.mockResolvedValue(true)

      const gstore = usegoogleStore()
      await gstore.loadGoogleApi()

      expect(gapi.client.load).toHaveBeenCalledTimes(1)
      expect(gapi.client.load).toHaveBeenCalledWith('drive', 'v3')
    })

    describe('when google api fully loaded', () => {
      beforeEach(async () => {
        loadScriptSpy.mockResolvedValue(true)
        gapi.load.mockImplementation((_n, { callback }) => callback())

        gapi.client.load.mockResolvedValue(true)
      })
      it('should patch state.isReady to true', async () => {
        const gstore = usegoogleStore()
        await gstore.loadGoogleApi()
        expect(gstore.isReady).toBe(true)
      })

      it('should log success message', async () => {
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

        gapi.load.mockImplementation((_n, { callback }) => callback())

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

        gapi.load.mockImplementation((_n, { callback }) => callback())

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
        gapi.load.mockImplementation((_n, { onerror }) => onerror(errormsg))
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
        gapi.load.mockImplementation((_n, { callback }) => callback())
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

  describe('authenticate', () => {
    let gapi: { client: { init: SpyInstance } }
    let google: { accounts: { oauth2: { initTokenClient: SpyInstance } } }
    let token: {
      requestAccessToken: SpyInstance
    }
    beforeEach(() => {
      gapi = {
        client: {
          init: vi.fn()
        }
      }
      google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn()
          }
        }
      }
      token = {
        requestAccessToken: vi.fn()
      }
      window.gapi = gapi
      window.google = google
      console.log = vi.fn()
      console.error = vi.fn()
    })

    it('should call google.accounts.oauth2.initTokenClient', async () => {
      let callback: Function
      google.accounts.oauth2.initTokenClient.mockImplementation((config) => {
        callback = config.callback
        return token
      })
      token.requestAccessToken.mockImplementation(() => {
        callback({})
      })

      const gstore = usegoogleStore()
      await gstore.authenticate()
      expect(google.accounts.oauth2.initTokenClient).toBeCalledTimes(1)
      expect(google.accounts.oauth2.initTokenClient).toBeCalledWith({
        client_id: import.meta.env.VITE_APP_CLIENT_ID,
        scope: import.meta.env.VITE_APP_SCOPES,
        callback: expect.any(Function)
      })
    })

    it('should call gapi.client.init', async () => {
      let callback: Function
      google.accounts.oauth2.initTokenClient.mockImplementation((config) => {
        callback = config.callback
        return token
      })
      token.requestAccessToken.mockImplementation(() => {
        callback({})
      })

      const gstore = usegoogleStore()
      await gstore.authenticate()
      expect(gapi.client.init).toBeCalledTimes(1)
      expect(gapi.client.init).toBeCalledWith({
        apiKey: import.meta.env.VITE_APP_API_KEY,
        discoveryDocs: [import.meta.env.VITE_APP_DISCOVERY_DOC]
      })
    })

    it('should call token.requestAccessToken', async () => {
      let callback: Function
      google.accounts.oauth2.initTokenClient.mockImplementation((config) => {
        callback = config.callback
        return token
      })
      token.requestAccessToken.mockImplementation(() => {
        callback({})
      })

      const gstore = usegoogleStore()
      await gstore.authenticate()
      expect(token.requestAccessToken).toBeCalledTimes(1)
      expect(token.requestAccessToken).toBeCalledWith({ prompt: '' })
    })

    describe('when authentication is fullyfied', () => {
      beforeEach(() => {
        let callback: Function
        google.accounts.oauth2.initTokenClient.mockImplementation((config) => {
          callback = config.callback
          return token
        })
        token.requestAccessToken.mockImplementation(() => {
          callback({})
        })
      })
      it('should patch state.isAuthenticated to true', async () => {
        const gstore = usegoogleStore()
        await gstore.authenticate()
        expect(gstore.isAuthenticated).toBe(true)
      })

      it('should log success message', async () => {
        const gstore = usegoogleStore()
        await gstore.authenticate()

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith('authentication success')
      })
    })

    describe('when authentication fail', () => {
      const errormsg = 'an error message'
      beforeEach(() => {
        let callback: Function
        google.accounts.oauth2.initTokenClient.mockImplementation((config) => {
          callback = config.callback
          return token
        })
        token.requestAccessToken.mockImplementation(() => {
          callback({ error: errormsg })
        })
      })
      it('should keep state.isAuthenticated to false', async () => {
        const gstore = usegoogleStore()
        await gstore.authenticate()
        expect(gstore.isAuthenticated).toBe(false)
      })

      it('should not log success message', async () => {
        const gstore = usegoogleStore()
        await gstore.authenticate()

        expect(console.log).toHaveBeenCalledTimes(0)
      })

      it('should log error', async () => {
        const gstore = usegoogleStore()
        await gstore.authenticate()

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(errormsg)
      })
    })
  })
})
