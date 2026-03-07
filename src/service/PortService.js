import { api } from 'boot/axios'

export class PortService {
  static async getAll() {
    return await api.get('ports')
  }

  static async getAllByCompanyAdmin() {
    return await api.get('ports/company/administrator')
  }

  static async getPortByPortAdmin() {
    return await api.get('ports/port-administrator')
  }

  static async getById(id) {
    return await api.get(`ports/${id}`)
  }

  static async create(payload) {
    return await api.post('ports', payload)
  }

  static async update(id, payload) {
    return await api.put(`ports/${id}`, payload)
  }

  static async delete(id) {
    return await api.delete(`ports/${id}`)
  }

  static async getImages(portId) {
    return await api.get(`ports/${portId}/images`)
  }


  static async getImagesByPortAdmin() {
    return await api.get('ports/images')
  }

  static async uploadImageByPortAdmin(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post('ports/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
