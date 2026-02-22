import {api} from 'boot/axios'

export async function getMooringCategories(portId) {
  return api.get(`/mooring-categories/ports/${portId}`)
}

export async function getMooringCategory(id) {
  return api.get(`/mooring-categories/${id}`)
}

export async function createMooringCategory(payload) {
  return api.post('/mooring-categories', payload)
}

export async function updateMooringCategory(id, payload) {
  return api.put(`/mooring-categories/${id}`, payload)
}

export async function deleteMooringCategory(id) {
  return api.delete(`/mooring-categories/${id}`)
}
