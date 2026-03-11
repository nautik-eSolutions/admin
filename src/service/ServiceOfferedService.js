import { api } from 'boot/axios.js'

export async function getAllServices() {
  return await api.get('services')
}

export async function createService(payload) {
  return await api.post('services', payload)
}

export async function deleteService(serviceId) {
  return await api.delete(`services/${serviceId}`)
}
