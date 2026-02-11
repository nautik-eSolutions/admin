import {api} from "boot/axios.js";



export class MooringService {
  static async save(mooring, portId) {
    try {
      console.log(mooring);
      await api.post(`/api/v1/moorings/${portId}`, mooring);

    } catch (error) {
      console.log(error);
    }

  }
}
