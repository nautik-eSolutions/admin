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

