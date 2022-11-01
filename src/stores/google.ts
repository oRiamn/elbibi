import { defineStore } from 'pinia'
import { loadScript } from 'vue-plugin-load-script'

async function loadExternalScripts(list: string[]) {
  return Promise.all(list.map((src) => loadScript(src)))
}

async function googleClientLoad(list: { name: string; version: string }[]) {
  return new Promise((res, rej) => {
    window.gapi.load('client', {
      callback: async function () {
        try {
          await Promise.all(
            list.map(({ name, version }) =>
              window.gapi.client.load(name, version)
            )
          )
          res(true)
        } catch (error) {
          rej(error)
        }
      },
      timeout: 500,
      onerror: rej,
      ontimeout: rej
    })
  })
}

export const usegoogleStore = defineStore({
  id: 'google',
  state: () => ({
    isReady: false,
    isAuthenticated: false,
    spreadsheetId: ''
  }),
  getters: {},
  actions: {
    loadGoogleApi: async function () {
      try {
        await loadExternalScripts([
          'https://apis.google.com/js/api.js',
          'https://accounts.google.com/gsi/client'
        ])
        await googleClientLoad([{ name: 'drive', version: 'v3' }])
        console.log('google api is ready')
        this.$patch((state) => {
          state.isReady = true
        })
      } catch (err) {
        console.error(err)
      }
    },
    authenticate: async function () {
      try {
        await new Promise((res, rej) => {
          const token = window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_APP_CLIENT_ID,
            scope: import.meta.env.VITE_APP_SCOPES,
            callback: (tokenResponse) => {
              if (tokenResponse.error !== undefined) {
                rej(tokenResponse.error)
              }
              res(true)
            }
          })
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_APP_API_KEY as string,
            discoveryDocs: [import.meta.env.VITE_APP_DISCOVERY_DOC as string]
          })
          token.requestAccessToken({ prompt: '' })
        })
        console.log('authentication success')
        this.$patch((state) => {
          state.isAuthenticated = true
        })
      } catch (error) {
        console.error(error)
      }
    },
    loadSpreadsheet: async function () {
      try {
        let spreadsheetId: string
        const title = import.meta.env.VITE_APP_SPREADSHEETNAME as string
        const fileList = await window.gapi.client.drive.files.list({
          pageSize: 10,
          fields:
            'nextPageToken, files(id, name, imageMediaMetadata, mimeType)',
          q: `name='${title}' and mimeType='application/vnd.google-apps.spreadsheet'`
        })
        if (
          fileList &&
          fileList.result &&
          fileList.result.files &&
          fileList.result.files.length > 0
        ) {
          const [spreadsheet] = fileList.result.files
          spreadsheetId = spreadsheet.id as string
        } else {
          const response = await window.gapi.client.sheets.spreadsheets.create({
            resource: {
              properties: {
                title
              }
            }
          })
          spreadsheetId = response.result.spreadsheetId as string
        }

        console.log('spreadsheet loaded')
        this.$patch((state) => {
          state.spreadsheetId = spreadsheetId
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
})
