import { defineStore } from 'pinia'
import {PortService} from "src/service/PortService.js";
import {Port} from "src/model/Port.js";



const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

export const usePortStore = defineStore('port', {
  state: () => ({
    portId: null,
    Port:Port
  }),
  actions: {
    setPort(portId) {
      this.portId = portId
    },
    clearPort() {
      this.portId = null
    },
    async setPortByAdmin(){

      try {
        const resp = await PortService.getPortByAdmin();
        if (!isOk(resp)) throw new Error()
        this.Port = Port.fromJson(resp)
        this.portId = this.Port.id;
      } catch (e) {
        onError(e, 'Error al obtener el puerto.')
      }

    }
  },
  persist: true,
})
