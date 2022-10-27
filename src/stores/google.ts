import { defineStore } from 'pinia'

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
      const libs = [
        'https://apis.google.com/js/api.js',
        'https://accounts.google.com/gsi/client'
      ]

      try {
        await Promise.all(
          libs.map((src) => {
            const script = document.createElement('script')
            script.src = src
            document.body.appendChild(script)
            return new Promise((res) => {
              script.onload = res
            })
          })
        )

        await new Promise((res) => {
          window.gapi.load('client', async function () {
            await Promise.all([window.gapi.client.load('drive', 'v3')])
            res(true)
          })
        })

        console.log('google is loaded')

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
          callback: async (resp: any) => {
            if (resp.error !== undefined) {
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
