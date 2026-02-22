// src/stores/mooringCategoryStore.js
import {defineStore} from 'pinia'
import {Notify} from 'quasar'
import {MooringCategory} from 'src/models/MooringCategory'
import {
  getMooringCategories, getMooringCategory, createMooringCategory, updateMooringCategory, deleteMooringCategory,
} from '../service/MooringCategoryService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) => Notify.create({
  type: 'negative', message: e?.response?.data?.message ?? e?.message ?? msg,
})

export const useMooringCategoryStore = defineStore('mooringCategory', {
  state: () => ({
    categories: [], category: null,
  }),

  actions: {
    async getMooringCategories() {
      try {
        const resp = await getMooringCategories()
        if (!isOk(resp)) throw new Error()
        this.categories = resp.data.map(MooringCategory.fromJson)
        return this.categories
      } catch (e) {
        onError(e, 'Error al obtener las categorias.')
      }
    },

    async getMooringCategory(id) {
      try {
        const resp = await getMooringCategory(id)
        if (!isOk(resp)) throw new Error()
        this.category = MooringCategory.fromJson(resp.data)
      } catch (e) {
        onError(e, 'Error al obtener las categorias.')
      }
    },

    async createMooringCategory(payload) {
      try {
        const resp = await createMooringCategory(payload)
        if (!isOk(resp)) throw new Error()
        this.categories.push(MooringCategory.fromJson(resp.data))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría creada correctamente.'})
      } catch (e) {
        onError(e, 'Error al crear las categoria.')
      }
    },

    async updateMooringCategory(id, payload) {
      try {
        const resp = await updateMooringCategory(id, payload)
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

    async deleteMooringCategory(id) {
      try {
        const resp = await deleteMooringCategory(id)
        if (!isOk(resp)) throw new Error()
        this.categories = this.categories.filter((c) => String(c.id) !== String(id))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría eliminada correctamente.'})
      } catch (e) {
        onError(e, 'Error al eliminar la categoria.')
      }
    },
  },
})
