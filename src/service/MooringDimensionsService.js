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
