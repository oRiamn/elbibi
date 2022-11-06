import { createPinia, setActivePinia } from 'pinia'
import { SpyInstance, spyOn, vi } from 'vitest'
import * as loadScript from 'vue-plugin-load-script'
import { gapimock, doGapiMock } from './mocks/lib/gapi'
import { googlemock, doGoogleMock } from './mocks/lib/google'

import { usegoogleStore } from '../google'

describe('Google Store', () => {
  let gapi: gapimock
  beforeEach(() => {
    setActivePinia(createPinia())
    gapi = doGapiMock(window)
  })

  it('should define isReady to false by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.isReady).toBe(false)
  })

  it('should define isAuthenticated to false by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.isAuthenticated).toBe(false)
  })

  it('should define spreadsheetId to empty string by default', () => {
    const gstore = usegoogleStore()
    expect(gstore.spreadsheetId).toBe('')
  })

  describe('loadGoogleApi', () => {
    let loadScriptSpy: SpyInstance
    beforeEach(() => {      
      loadScriptSpy = vi.spyOn(loadScript, 'loadScript')
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
    let google: googlemock
    let token: {
      requestAccessToken: SpyInstance
    }
    beforeEach(() => {
      google = doGoogleMock(window)
      token = {
        requestAccessToken: vi.fn()
      }
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

  describe('loadSpreadsheet', () => {
    const spreadsheetId = 'aspreadsheetid'
    const title = import.meta.env.VITE_APP_SPREADSHEETNAME
    describe('when spreadsheet exist', () => {
      beforeEach(() => {
        gapi.client.drive.files.list.mockResolvedValue({
          result: {
            files: [
              {
                id: spreadsheetId
              }
            ]
          }
        })
        console.log = vi.fn()
        console.error = vi.fn()
      })

      it('should call gapi.client.drive.files.list for fetching spreadsheet id', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gapi.client.drive.files.list).toBeCalledTimes(1)
        expect(gapi.client.drive.files.list).toBeCalledWith({
          pageSize: 10,
          fields:
            'nextPageToken, files(id, name, imageMediaMetadata, mimeType)',
          q: `name='${title}' and mimeType='application/vnd.google-apps.spreadsheet'`
        })
      })

      it('should log success fetching', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.log).toBeCalledTimes(1)
        expect(console.log).toBeCalledWith('spreadsheet loaded')
      })

      it('should patch spreadsheetid state', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gstore.spreadsheetId).toBe(spreadsheetId)
      })
    })

    describe('when gapi.client.drive.files.list fail', () => {
      const errormsg = 'an error message'
      beforeEach(() => {
        gapi.client.drive.files.list.mockRejectedValue(errormsg)
        console.log = vi.fn()
        console.error = vi.fn()
      })

      it('should log success fetching', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.log).toBeCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.error).toBeCalledTimes(1)
        expect(console.error).toBeCalledWith(errormsg)
      })

      it('should not patch spreadsheetid state', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gstore.spreadsheetId).toBe('')
      })
    })

    describe('when spreadsheet does not exist', () => {
      beforeEach(() => {
        gapi.client.drive.files.list.mockResolvedValue({
          result: {
            files: []
          }
        })

        gapi.client.sheets.spreadsheets.create.mockResolvedValue({
          result: {
            spreadsheetId
          }
        })
        console.log = vi.fn()
        console.error = vi.fn()
      })

      it('should call gapi.client.sheets.spreadsheets.create creating a spreadsheet', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gapi.client.sheets.spreadsheets.create).toBeCalledTimes(1)
        expect(gapi.client.sheets.spreadsheets.create).toBeCalledWith({
          resource: {
            properties: {
              title
            }
          }
        })
      })

      it('should log success fetching', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.log).toBeCalledTimes(1)
        expect(console.log).toBeCalledWith('spreadsheet loaded')
      })

      it('should patch spreadsheetid state', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gstore.spreadsheetId).toBe(spreadsheetId)
      })
    })

    describe('when gapi.client.sheets.spreadsheets.create fail', () => {
      const errormsg = 'an error message'
      beforeEach(() => {
        gapi.client.drive.files.list.mockResolvedValue({
          result: {
            files: []
          }
        })

        gapi.client.sheets.spreadsheets.create.mockRejectedValue(errormsg)
        console.log = vi.fn()
        console.error = vi.fn()
      })

      it('should log success fetching', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.log).toBeCalledTimes(0)
      })

      it('should log error message', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(console.error).toBeCalledTimes(1)
        expect(console.error).toBeCalledWith(errormsg)
      })

      it('should not patch spreadsheetid state', async () => {
        const gstore = usegoogleStore()
        await gstore.loadSpreadsheet()
        expect(gstore.spreadsheetId).toBe('')
      })
    })
  })
})
