import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './plugins/persist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@mdi/font/css/materialdesignicons.css'
import 'animate.css'
import './assets/dialog.css'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app') 