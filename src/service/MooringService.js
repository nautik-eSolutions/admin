import {api} from "boot/axios.js";


export class MooringService {
  static async save(mooring, portId) {
    try {
      console.log(mooring);
      await api.post(`moorings/${portId}`, mooring);

    } catch (error) {
      console.log(error);
    }

  }

  static async delete(mooringId) {
    try {
      await api.delete(`moorings/${mooringId}`);
    }catch(error) {
      console.log(error);
    }
  }
}

export async function getMoorings(portId) {
  return await api.get(`moorings/ports/${portId}`)
}

export async function getMooringById(mooringId) {
  return await api.get(`moorings/${mooringId}`)
}

export async function getMooringsByCategory(categoryId) {
  return await api.get(`moorings/category/${categoryId}`)
}

export async function getMooringByZoneId(zoneId) {
  return await api.get(`moorings/zone/${zoneId}`)
}

export async function createMooring(categoryId, payload) {
  return await api.post(`moorings/category/${categoryId}`, payload)
}

export async function updateMooring(mooringId, payload) {
  return await api.put(`moorings/${mooringId}`, payload)
}

export async function deleteMooring(mooringId) {
  return await api.delete(`moorings/${mooringId}`)
}
