import { defineStore } from 'pinia'
import { loadScript } from 'vue-plugin-load-script'

export const loadExternalScripts = async (list: string[]) => {
  return Promise.all(list.map((src) => loadScript(src)))
}

export const googleClientLoad = async function (list: string[][]) {
  return new Promise((res, rej) => {
    window.gapi.load(
      'client',
      async function () {
        await Promise.all(list.map((args) => window.gapi.client.load(...args)))
        res(true)
      },
      rej
    )
  })
}

let tokenClient: any
export const usegoogleStore = defineStore({
  id: 'google',
  state: () => ({
    isReady: false,
    isAuthenticated: false,
    spreadsheetId: null
  }),
  getters: {},
  actions: {
    loadGoogleApi: async function () {
      try {
        await loadExternalScripts([
          'https://apis.google.com/js/api.js',
          'https://accounts.google.com/gsi/client'
        ])
        await googleClientLoad([['drive', 'v3']])
        console.log('google api is ready')
        this.$patch((state) => {
          state.isReady = true
        })
      } catch (err) {
        console.error(err)
      }
    },
    authenticate: async function () {
      tokenClient = await new Promise((res) => {
        const token = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_APP_CLIENT_ID,
          scope: import.meta.env.VITE_APP_SCOPES,
          callback: (resp: any) => {
            if (resp.error !== undefined) {
              console.error(resp.error)
              throw resp
            }
            res(token)
          }
        })
        window.gapi.client.init({
          apiKey: import.meta.env.VITE_APP_API_KEY,
          discoveryDocs: [import.meta.env.VITE_APP_DISCOVERY_DOC]
        })
        token.requestAccessToken({ prompt: '' })
      })

      this.$patch((state) => {
        state.isAuthenticated = true
      })
    }
  }
})
