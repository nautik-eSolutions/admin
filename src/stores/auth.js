import { defineStore } from 'pinia'
import User from 'src/model/User.js'
import { loginUser } from 'src/service/AuthService.js'
import { usePortStore } from 'src/stores/port.js'



export const useAuthStore = defineStore('myStore', {
  state: () => ({
    token: '',
    isCompanyAdmin:false,
    isAuthenticated: false,
  }),
  actions: {
    async loginUser(userName, password) {
      const resp = await loginUser(userName, password)
      if (resp.status === 200) {
        this.isCompanyAdmin = resp.data?.isCompanyAdmin
        this.token = resp.data?.token?.token
        this.isAuthenticated = true

        if (!resp.data?.isCompanyAdmin) {
          const portStore = usePortStore();
          await portStore.setPortByAdmin();
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
