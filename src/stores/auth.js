import { defineStore } from 'pinia'
import User from 'src/model/User.js'
import { loginUser } from 'src/service/AuthService.js'
import { usePortStore } from 'src/stores/port.js'

export const useAuthStore = defineStore('myStore', {
  state: () => ({
    User: User,
    token: '',
    role: '',
    isAuthenticated: false,
  }),
  actions: {
    async loginUser(userName, password) {
      const resp = await loginUser(userName, password)
      if (resp.status === 200) {
        this.User = new User(userName)
        this.role = resp.data.role
        this.token = resp.data.token
        this.isAuthenticated = true

        if (resp.data.portId) {
          const portStore = usePortStore()
          portStore.setPort(resp.data.portId)
        }
      }
    },

    async logout() {
      const portStore = usePortStore()
      this.User = null
      this.token = ''
      this.isAuthenticated = false
      portStore.clearPort()
    },
  },
  persist: true,
})
