import { api } from 'boot/axios.js'

export async function getPortImages(portId) {
  return await api.get(`ports/${portId}/images`)
}

export async function uploadPortImage(portId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return await api.post(`ports/${portId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
