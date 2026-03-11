import { api } from 'boot/axios.js'
import {usePortStore} from "stores/port.js";

export async function getPortImages(portId) {
  return await api.get(`ports/${portId}/images`)
}
export async function getPortImagesPortAdmin() {
  return await api.get(`ports/images`)
}

export async function uploadPortImage(file) {
  const portId = usePortStore().portId
  const formData = new FormData()
  formData.append('file', file)
  return await api.post(`ports/${portId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
