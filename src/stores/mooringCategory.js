import {defineStore} from 'pinia'
import {Notify} from 'quasar'
import {MooringCategory} from '../model/MooringCategory'
import {
  getMooringCategories, getMooringCategory, createMooringCategory, updateMooringCategory, deleteMooringCategory,
} from '../service/MooringCategoryService.js'
import {MooringCategoryInfo} from '../model/MooringCategoryInfo.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) => Notify.create({
  type: 'negative', message: e?.response?.data?.message ?? e?.message ?? msg,
})

export const useMooringCategoryStore = defineStore('mooringCategory', {
  state: () => ({
    categories: [], category: null,
  }),

  actions: {
    async getMooringCategories(PortId) {
      try {
        const resp = await getMooringCategories(PortId)
        if (!isOk(resp)) throw new Error()
        this.categories = resp.data.map(MooringCategory.fromJson)
        return this.categories
      } catch (e) {
        onError(e, 'Error al obtener las categorias.')
      }
    },

    async getMooringCategory(portId,id) {
      try {
        const resp = await getMooringCategory(portId,id)
        if (!isOk(resp)) throw new Error()
        this.category = MooringCategoryInfo.fromJson(resp.data)
      } catch (e) {
        onError(e, 'Error al obtener las categorias.')
      }
    },

    async createMooringCategory(portId,payload) {
      try {
        const resp = await createMooringCategory(portId,payload)
        if (!isOk(resp)) throw new Error()
        this.categories.push(MooringCategory.fromJson(resp.data))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría creada correctamente.'})
      } catch (e) {
        onError(e, 'Error al crear las categoria.')
      }
    },

    async updateMooringCategory(portId,id, payload) {
      try {
        const resp = await updateMooringCategory(portId,id, payload)
        if (!isOk(resp)) throw new Error()
        const updated = MooringCategory.fromJson(resp.data)
        const index = this.categories.findIndex((c) => String(c.id) === String(id))
        if (index !== -1) this.categories[index] = updated
        this.category = updated
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría actualizada correctamente.'})
      } catch (e) {
        onError(e, 'Error al actualizar las categoria.')
      }
    },

    async deleteMooringCategory(portId,id) {
      try {
        const resp = await deleteMooringCategory(portId,id)
        if (!isOk(resp)) throw new Error()
        this.categories = this.categories.filter((c) => String(c.id) !== String(id))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría eliminada correctamente.'})
      } catch (e) {
        onError(e, 'Error al eliminar la categoria.')
      }
    },
  },
})
