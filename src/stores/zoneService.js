import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import {
  getServicesByZone,
  addServiceToZone,
  removeServiceFromZone,
} from '../service/ZoneService.js'

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

export const useZoneServiceStore = defineStore('zoneService', {
  state: () => ({
    zoneServices: [],
  }),

  actions: {
    async getServicesByZone(zoneId) {
      try {
        const resp = await getServicesByZone(zoneId)
        if (!isOk(resp)) throw new Error()
        this.zoneServices = resp.data
        return this.zoneServices
      } catch (e) {
        onError(e, 'Error al obtener los servicios de la zona.')
      }
    },

    async addServiceToZone(serviceId, zoneId) {
      try {
        const resp = await addServiceToZone(serviceId, zoneId)
        if (!isOk(resp)) throw new Error()
        onSuccess('Servicio vinculado correctamente.')
      } catch (e) {
        onError(e, 'Error al vincular el servicio a la zona.')
      }
    },

    async removeServiceFromZone(serviceId, zoneId) {
      try {
        const resp = await removeServiceFromZone(serviceId, zoneId)
        if (!isOk(resp)) throw new Error()
        this.zoneServices = this.zoneServices.filter(s => s.id !== serviceId)
        onSuccess('Servicio desvinculado correctamente.')
      } catch (e) {
        onError(e, 'Error al desvincular el servicio.')
      }
    },
  },
})
