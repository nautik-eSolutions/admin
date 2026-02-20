import {api} from "boot/axios.js";
import {Dimensions} from "src/model/Dimensions.js";


export class MooringDimensionsService {
  static async getAll() {
    try {
      const response = await api.get("moorings/dimensions")
      return response.data.map(item => Dimensions.fromJson(item))
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}

export async function getAllMooringDimension(portId){
  return await api.get(`moorings/ports/${portId}/dimensions`);
}
export async function updateMooringDimension(dimension){
  return await api.patch(`moorings/dimensions`, dimension);
}
export async function deleteMooringDimension(id){
  return await api.delete(`moorings/dimensions/${id}`)
}
export async function createMooringDimension(portId){
  return await api.post(`moorings/ports/${portId}/dimensions`)
}
