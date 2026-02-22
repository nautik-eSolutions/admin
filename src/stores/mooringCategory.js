// src/stores/mooringCategoryStore.js
import {defineStore} from 'pinia'
import {Notify} from 'quasar'
import {MooringCategory} from 'src/models/MooringCategory'
import {
  getMooringCategories, getMooringCategory, createMooringCategory, updateMooringCategory, deleteMooringCategory,
} from '../service/MooringCategoryService.js'

const isOk = (resp) => resp?.status >= 200 && resp?.status < 300

const onError = (e, msg) => Notify.create({
  type: 'negative',
  message: e?.response?.data?.message ?? e?.message ?? msg,
})

export const useMooringCategoryStore = defineStore('mooringCategory', {
  state: () => ({
    categories: [], category: null,
  }),

  actions: {
    async getMooringCategories() {
      try {
        const {data} = await getMooringCategories()
        this.categories = data.map(MooringCategory.fromJson)
        return this.categories
      } catch {
        Notify.create({type: 'negative', position: 'top-right', message: 'No se pudieron cargar las categorías.'})
      }
    },

    async getMooringCategory(id) {
      try {
        const {data} = await getMooringCategory(id)
        this.category = MooringCategory.fromJson(data)
      } catch {
        Notify.create({type: 'negative', position: 'top-right', message: 'No se pudo cargar la categoría.'})
      }
    },

    async createMooringCategory(payload) {
      try {
        const {data} = await createMooringCategory(payload)
        this.categories.push(MooringCategory.fromJson(data))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría creada correctamente.'})
        ret
      } catch {
        Notify.create({type: 'negative', position: 'top-right', message: 'No se pudo crear la categoría.'})
        throw new Error()
      }
    },

    async updateMooringCategory(id, payload) {
      try {
        const {data} = await updateMooringCategory(id, payload)
        const updated = MooringCategory.fromJson(data)
        const index = this.categories.findIndex((c) => String(c.id) === String(id))
        if (index !== -1) this.categories[index] = updated
        this.category = updated
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría actualizada correctamente.'})
      } catch {
        Notify.create({type: 'negative', position: 'top-right', message: 'No se pudo actualizar la categoría.'})
        throw new Error()
      }
    },

    async deleteMooringCategory(id) {
      try {
        await deleteMooringCategory(id)
        this.categories = this.categories.filter((c) => String(c.id) !== String(id))
        Notify.create({type: 'positive', position: 'top-right', message: 'Categoría eliminada correctamente.'})
      } catch {
        Notify.create({type: 'negative', position: 'top-right', message: 'No se pudo eliminar la categoría.'})
        throw new Error()
      }
    },
  },
})
