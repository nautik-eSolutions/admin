// src/stores/mooring.js
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { Mooring } from '../model/Mooring'
import {
  getMoorings,
  getMooringById,
  getMooringByZoneId, getMooringsByCategory,
} from '../service/MooringService.js'
import { MooringService } from '../service/MooringService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) =>
  Notify.create({
    type: 'negative',
    message: e?.response?.data?.message ?? e?.message ?? msg,
  })

export const useMooring = defineStore('mooring', {
  state: () => ({
    moorings: [],
    mooring: null,
  }),

  actions: {
    async getMoorings(portId) {
      try {
        const resp = await getMoorings(portId)
        if (!isOk(resp)) throw new Error()
        this.moorings = resp.data.map(Mooring.fromJson)
        return this.moorings
      } catch (e) {
        onError(e, 'Error al obtener los amarres.')
      }
    },

    async getMooringById(id) {
      try {
        const resp = await getMooringById(id)
        if (!isOk(resp)) throw new Error()
        this.mooring = Mooring.fromJson(resp.data)
        return this.mooring
      } catch (e) {
        onError(e, 'Error al obtener el amarre.')
      }
    },

    async getMooringsByZone(zoneId) {
      try {
        const resp = await getMooringByZoneId(zoneId)
        if (!isOk(resp)) throw new Error()
        this.moorings = resp.data.map(Mooring.fromJson)
        return this.moorings
      } catch (e) {
        onError(e, 'Error al obtener los amarres por zona.')
      }
    },

    async getMooringsByCategory( categoryId) {
      try {
        const resp = await getMooringsByCategory(categoryId)
        if (!isOk(resp)) throw new Error()
        this.moorings = resp.data.map(Mooring.fromJson)

        return this.moorings
      } catch (e) {
        onError(e, 'Error al obtener los amarres por categoría.')
      }
    },

    async createMooring(portId, payload) {
      try {
        const resp = await MooringService.save(payload, portId)
        if (!isOk(resp)) throw new Error()
        const created = Mooring.fromJson(resp.data)
        this.moorings.push(created)
        Notify.create({
          type: 'positive',
          position: 'top-right',
          message: 'Amarre creado correctamente.',
        })
        return created
      } catch (e) {
        onError(e, 'Error al crear el amarre.')
      }
    },

    async deleteMooring(mooringId) {
      try {
        const resp = await MooringService.delete(mooringId)
        if (!isOk(resp)) throw new Error()
        this.moorings = this.moorings.filter(
          (m) => String(m.id) !== String(mooringId)
        )
        Notify.create({
          type: 'positive',
          position: 'top-right',
          message: 'Amarre eliminado correctamente.',
        })
      } catch (e) {
        onError(e, 'Error al eliminar el amarre.')
      }
    },
  },
})
