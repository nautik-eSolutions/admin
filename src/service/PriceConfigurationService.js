import {api} from "boot/axios.js";

export async function getAllPriceConfigurations() {
  return await api.get(`price-configurations`)
}

export async function getPriceConfiguration( id) {
  return await api.get(`price-configurations/${id}`)
}

export async function createPriceConfiguration(payload) {
  return await api.post(`price-configurations`, payload)
}

export async function updatePriceConfiguration( id, payload) {
  return await api.put(`price-configurations/${id}`, payload)
}

export async function deletePriceConfiguration( id) {
  return await api.delete(`price-configurations/${id}`)
}
