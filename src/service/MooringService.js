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


export async function  getMoorings(portId){
  return await api.get(`moorings/ports/${portId}`)
}
export async function getMooringById(id){
  return await api.get(`moorings/${id}`)
}

export async function getMooringByZoneId(zoneId){
  return await api.get(`moorings/zone/${zoneId}`)
}

