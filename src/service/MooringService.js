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

export const getMoorings = (portId) => api.get(`moorings/ports/${portId}`)

export const getMooringById = (mooringId) => api.get(`moorings/${mooringId}`)

export const getMooringsByCategory = (categoryId) => api.get(`moorings/category/${categoryId}`)

export const getMooringByZoneId = (zoneId) => api.get(`moorings/zone/${zoneId}`)

export const createMooring = (categoryId, payload) => api.post(`moorings/category/${categoryId}`, payload)

export const updateMooring = (mooringId, payload) => api.put(`moorings/${mooringId}`, payload)

export const deleteMooring = (mooringId) => api.delete(`moorings/${mooringId}`)

