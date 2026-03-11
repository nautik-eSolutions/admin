import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import {
  getAllServices,
  createService,
  deleteService,
} from '../service/ServiceOfferedService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) =>
  Notify.create({
    type: 'negative',
    position: 'top-right',
    message: e?.response?.data?.message ?? e?.message ?? msg,
  })

const onSuccess = (msg) =>
  Notify.create({
    type: 'positive',
    position: 'top-right',
    message: msg,
  })

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
  }),

  actions: {
    async getAllServices() {
      try {
        const resp = await getAllServices()
        if (!isOk(resp)) throw new Error()
        this.services = resp.data
        return this.services
      } catch (e) {
        onError(e, 'Error al obtener el catálogo de servicios.')
      }
    },

    async createService(payload) {
      try {
        const resp = await createService(payload)
        if (!isOk(resp)) throw new Error()
        this.services.push(resp.data)
        onSuccess('Servicio creado correctamente.')
        return resp.data
      } catch (e) {
        onError(e, 'Error al crear el servicio.')
      }
    },

    async deleteService(serviceId) {
      try {
        const resp = await deleteService(serviceId)
        if (!isOk(resp)) throw new Error()
        this.services = this.services.filter(s => s.id !== serviceId)
        onSuccess('Servicio eliminado correctamente.')
      } catch (e) {
        onError(e, 'Error al eliminar el servicio.')
      }
    },
  },
})
