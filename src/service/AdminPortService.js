import { api } from 'boot/axios'

export function getAdminPortsByCompany() {
  return api.get('/administrators/company/ports')
}

export function getCompanyPorts() {
  return api.get('ports/company/administrator')
}

export function createAdminPort(portId, payload) {
  return api.post(`/administrators/ports/${portId}`, payload)
}

export function updateAdminPort(portId, adminId, payload) {
  return api.put(`/administrators/ports/${portId}/${adminId}`, payload)
}

export function deleteAdminPort(portId, adminId) {
  return api.delete(`/administrators/ports/${portId}/${adminId}`)
}
