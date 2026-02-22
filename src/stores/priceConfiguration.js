import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { PriceConfiguration } from '../model/PriceConfiguration'
import {
  getAllPriceConfigurations,
  createPriceConfiguration,
  updatePriceConfiguration,
  deletePriceConfiguration,
} from '../service/PriceConfigurationService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) => Notify.create({
  type: 'negative',
  message: e?.response?.data?.message ?? e?.message ?? msg,
})

export const usePriceConfigurationStore = defineStore('priceConfiguration', {

  state: () => ({
    priceConfigurations: [],
    priceConfiguration:  null,
  }),

  actions: {

    async getAllPriceConfigurations(portId) {
      try {
        const resp = await getAllPriceConfigurations(portId)
        if (!isOk(resp)) throw new Error()
        this.priceConfigurations = resp.data.map(PriceConfiguration.fromJson)
        Notify.create({ type: 'positive', message: 'Configuraciones cargadas correctamente' })
        return this.priceConfigurations
      } catch (e) {
        onError(e, 'Error al obtener las configuraciones.')
      }
    },

    async createPriceConfiguration(portId, payload) {
      try {
        const resp = await createPriceConfiguration(portId, payload)
        if (!isOk(resp)) throw new Error()
        const created = PriceConfiguration.fromJson(resp.data)
        this.priceConfigurations.push(created)
        Notify.create({ type: 'positive', message: 'Configuración creada correctamente' })
        return created
      } catch (e) {
        onError(e, 'Error al crear la configuración.')
      }
    },

    async updatePriceConfiguration(portId, id, payload) {
      try {
        const resp = await updatePriceConfiguration(portId, id, payload)
        if (!isOk(resp)) throw new Error()
        const updated = PriceConfiguration.fromJson(resp.data)
        const idx = this.priceConfigurations.findIndex((p) => p.id === id)
        if (idx !== -1) this.priceConfigurations[idx] = updated
        this.priceConfiguration = updated
        Notify.create({ type: 'positive', message: 'Configuración actualizada correctamente' })
        return updated
      } catch (e) {
        onError(e, 'Error al actualizar la configuración.')
      }
    },

    async deletePriceConfiguration(portId, id) {
      try {
        const resp = await deletePriceConfiguration(portId, id)
        if (!isOk(resp)) throw new Error()
        this.priceConfigurations = this.priceConfigurations.filter((p) => p.id !== id)
        if (this.priceConfiguration?.id === id) this.priceConfiguration = null
        Notify.create({ type: 'positive', message: 'Configuración eliminada correctamente' })
        return true
      } catch (e) {
        onError(e, 'Error al eliminar la configuración')
      }
    },

  },
})
