/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_CLIENT_ID: string
  readonly VITE_APP_API_KEY: string
  readonly VITE_APP_DISCOVERY_DOC: string
  readonly VITE_APP_SCOPES: string
}


interface window {
  readonly gapi: any;
  readonly google: any;
}