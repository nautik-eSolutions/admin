import { api } from "../boot/axios.js";
import { Boat } from "src/model/Boat.js";

export class BoatService {
  static async getBoats() {
    try {
      const response = await api.get('/api/v1/boats');
      console.log(response);
      return response.data.map(item => Boat.fromJson(item));
    } catch (error) {
      console.error("Error fetching boats:", error);
      return [];
    }
  }
}
