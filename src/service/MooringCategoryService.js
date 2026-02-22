import {api} from 'boot/axios'

export async function getMooringCategories(portId) {
  return api.get(`/mooring-categories/ports/${portId}`)
}

export async function getMooringCategory(portId, id) {
  return api.get(`/mooring-categories/ports/${portId}/${id}`)
}

export async function createMooringCategory(portId, payload) {
  return api.post(`/mooring-categories/ports/${portId}`, payload)
}

export async function updateMooringCategory(portId, id, payload) {
  return api.put(`/mooring-categories/ports/${portId}/${id}`, payload)
}

export async function deleteMooringCategory(portId,id) {
  return api.delete(`/mooring-categories/ports/${portId}/${id}`)
}
