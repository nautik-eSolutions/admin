import { defineBoot } from '#q-app/wrappers'
import useAuth from '../stores/auth.js'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost' })

export default defineBoot(({ app }) => {

  api.interceptors.request.use(config => {
    const authStore = useAuth()
    if (authStore.token) {
      console.log(authStore.token)
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })


  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
