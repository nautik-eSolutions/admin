import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { PortService } from 'src/service/PortService.js'
import { Port } from 'src/model/Port.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) => Notify.create({
  type: 'negative',
  message: e?.response?.data?.message ?? e?.message ?? msg,
})

export const usePortStore = defineStore('port', {
  state: () => ({
    ports: [],
    port: null,
    portId: null,
  }),
  actions: {
    setPort(portId) {
      this.portId = portId
    },
    clearPort() {
      this.portId = null
      this.port = null
    },
    async getAllPortByCompanyAdmin() {
      try {
        const resp = await PortService.getAllByCompanyAdmin()
        if (!isOk(resp)) throw new Error()
        this.ports = resp.data.map(Port.fromJson)
        Notify.create({ type: 'positive', message: 'Puertos cargados correctamente' })
        return this.ports
      } catch (e) {
        onError(e, 'Error al obtener los puertos.')
      }
    },
    async getPortById(id) {
      try {
        const resp = await PortService.getById(id)
        if (!isOk(resp)) throw new Error()
        this.port = Port.fromJson(resp.data)
        this.portId = this.port.id
        Notify.create({ type: 'positive', message: 'Puerto cargado correctamente' })
        return this.port
      } catch (e) {
        onError(e, 'Error al obtener el puerto.')
      }
    },
    async getPortByAdmin() {
      try {
        const resp = await PortService.getPortByAdmin()
        if (!isOk(resp)) throw new Error()
        this.port = Port.fromJson(resp.data)
        this.portId = this.port.id
        Notify.create({ type: 'positive', message: 'Puerto cargado correctamente' })
        return this.port
      } catch (e) {
        onError(e, 'Error al obtener el puerto.')
      }
    },
    async getPortByPortAdmin() {
      try {
        const resp = await PortService.getPortByPortAdmin()
        if (!isOk(resp)) throw new Error()
        this.port = Port.fromJson(resp.data)
        this.portId = this.port.id
        Notify.create({ type: 'positive', message: 'Puerto cargado correctamente' })
        return this.port
      } catch (e) {
        onError(e, 'Error al obtener el puerto.')
      }
    },
    async createPort(payload) {
      try {
        const resp = await PortService.create(payload)
        if (!isOk(resp)) throw new Error()
        const created = Port.fromJson(resp.data)
        this.ports.push(created)
        Notify.create({ type: 'positive', message: 'Puerto creado correctamente' })
        return created
      } catch (e) {
        onError(e, 'Error al crear el puerto.')
      }
    },
    async updatePort(id, payload) {
      try {
        const resp = await PortService.update(id, payload)
        if (!isOk(resp)) throw new Error()
        const updated = Port.fromJson(resp.data)
        const idx = this.ports.findIndex(p => p.id === id)

        if (idx !== -1) this.ports[idx] = updated
        if (this.port?.id === id) this.port = updated

        Notify.create({ type: 'positive', message: 'Puerto actualizado correctamente' })
        return updated
      } catch (e) {
        onError(e, 'Error al actualizar el puerto.')
      }
    },
    async deletePort(id) {
      try {
        const resp = await PortService.delete(id)
        if (!isOk(resp)) throw new Error()
        this.ports = this.ports.filter(p => p.id !== id)
        if (this.port?.id === id) this.port = null
        Notify.create({ type: 'positive', message: 'Puerto eliminado correctamente' })
        return true
      } catch (e) {
        onError(e, 'Error al eliminar el puerto.')
      }
    },
  },
  persist:true
})
