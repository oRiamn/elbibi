import { createPinia } from 'pinia'
import { createApp } from 'vue'
import LoadScript from 'vue-plugin-load-script';

import App from './app.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(LoadScript);

app.mount('#app')
