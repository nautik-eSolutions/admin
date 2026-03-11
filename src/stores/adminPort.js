import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import {
  getAdminPortsByCompany,
  getCompanyPorts,
  createAdminPort,
  updateAdminPort,
  deleteAdminPort as deleteAdminPortServ,
} from 'src/service/AdminPortService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) =>
  Notify.create({
    type: 'negative',
    position: 'top-right',
    message: e?.response?.data?.detail ?? e?.message ?? msg,
  })

const onSuccess = (msg) =>
  Notify.create({
    type: 'positive',
    position: 'top-right',
    message: msg,
  })

export const useAdminPort = defineStore('adminPort', {
  state: () => ({
    admins: [],
    ports: [],
  }),

  actions: {
    async fetchAll() {
      try {
        const [adminsResp, portsResp] = await Promise.all([
          getAdminPortsByCompany(),
          getCompanyPorts(),
        ])

        if (!isOk(adminsResp) || !isOk(portsResp)) throw new Error()

        this.admins = adminsResp.data
        this.ports = portsResp.data

        return {
          admins: this.admins,
          ports: this.ports,
        }
      } catch (e) {
        onError(e, 'Error al obtener administradores o puertos.')
      }
    },

    async createAdmin(portId, payload) {
      try {
        const resp = await createAdminPort(portId, payload)
        if (!isOk(resp)) throw new Error()

        this.admins.push(resp.data)
        onSuccess('Administrador creado correctamente.')

        return resp.data
      } catch (e) {
        onError(e, 'Error al crear el administrador.')
      }
    },

    async updateAdmin(portId, adminId, payload) {
      try {
        const resp = await updateAdminPort(portId, adminId, payload)
        if (!isOk(resp)) throw new Error()

        const index = this.admins.findIndex(
          (a) => String(a.id) === String(adminId)
        )

        if (index !== -1) this.admins[index] = resp.data

        onSuccess('Administrador actualizado correctamente.')

        return resp.data
      } catch (e) {
        onError(e, 'Error al actualizar el administrador.')
      }
    },

    async deleteAdmin(portId, adminId) {
      try {
        const resp = await deleteAdminPortServ(portId, adminId)
        if (!isOk(resp)) throw new Error()

        this.admins = this.admins.filter(
          (a) => String(a.id) !== String(adminId)
        )

        onSuccess('Administrador eliminado correctamente.')
      } catch (e) {
        if (e.response && e.response.status === 409) {
          const message =
            e.response.data.detail ||
            'No se puede eliminar: existen registros relacionados.'
          onError(e, message)
        } else {
          onError(e, 'Error inesperado al eliminar el administrador.')
          console.error('Error original:', e)
        }
      }
    },
  },
})
