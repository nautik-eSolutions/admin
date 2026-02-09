import {api} from "boot/axios.js";
import {Port} from "src/model/Port.js";

export class PortService {

  static async getAll() {
    try {
      const response = await api.get('/api/v1/ports');
      console.log(response);
      return response.data.map(item => Port.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
}
