import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/index.css'
import axios from 'axios'
import moment from 'moment'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

createApp(App)
  .mixin({
    methods: {
      dateTimeFormatter(value: string) {
        return moment(value).format('MMM DD, YYYY HH:mm:ss')
      },
    }
  })
  .use(router)
  .mount('#app')
