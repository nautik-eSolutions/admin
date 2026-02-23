import { defineStore } from 'pinia'

export const usePortStore = defineStore('port', {
  state: () => ({
    portId: null,
  }),
  actions: {
    setPort(portId) {
      this.portId = portId
    },
    clearPort() {
      this.portId = null
    },
  },
  persist: true,
})
