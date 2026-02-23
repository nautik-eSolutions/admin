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

export async function getDimensionsByPort(portId){
  try {
    const response = await api.get(`dimensions/ports/${portId}`);
    return response.data.map(item => Dimensions.fromJson(item))
  }catch (error){

  }
}

export async function updateMooringDimension(dimension){
  return await api.patch(`dimensions/${dimension.id}`, dimension);
}
export async function deleteMooringDimension(id){
  return await api.delete(`dimensions/${id}`)
}
export async function createMooringDimension(portId, dimension){
  return await api.post(`dimensions/ports/${portId}`,dimension)
}
