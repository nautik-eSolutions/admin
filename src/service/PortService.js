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

  static async getOne(id) {
    try{
      const response = await api.get(`/api/v1/ports/${id}`);
      const port =  Port.fromJson(response.data);
      console.log(port);
      return port;
    }catch(error){
      console.error("Error:", error);
    }
  }
}
