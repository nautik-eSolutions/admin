import {api} from "boot/axios.js";

export async function getAllPriceConfigurations(portId) {
  return await api.get(`price-configurations/ports/${portId}`)
}

export async function getPriceConfiguration(portId, id) {
  return await api.get(`price-configurations/ports/${portId}/${id}`)
}

export async function createPriceConfiguration(portId, payload) {
  return await api.post(`price-configurations/ports/${portId}`, payload)
}

export async function updatePriceConfiguration(portId, id, payload) {
  return await api.put(`price-configurations/ports/${portId}/${id}`, payload)
}

export async function deletePriceConfiguration(portId, id) {
  return await api.delete(`price-configurations/ports/${portId}/${id}`)
}
