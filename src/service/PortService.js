import {api} from "boot/axios.js";
import {Port} from "src/model/Port.js";

export class PortService {

  static async getAll() {
    try {
      const response = await api.get('ports');
      return response.data.map(item => Port.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  static async getAllByCompanyAdmin() {
    try {
      const response = await api.get('ports/company/administrator');
      return response.data.map(item => Port.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  static async getPortByAdmin() {
      return  await api.get('ports/admin');
  }



  static async getOne(id) {
    try{
      const response = await api.get(`ports/${id}`);
      const port =  Port.fromJson(response.data);
      return port;
    }catch(error){
      console.error("Error:", error);
    }
  }
  static async getPortByPortAdmin() {
    try{
      const response = await api.get(`ports/port-administrator`);
      const port =  Port.fromJson(response.data);
      return port;
    }catch(error){
      console.error("Error:", error);
    }
  }

  static async delete(id) {
    try {
      await api.delete(`/api/v1/ports/${id}`);
    }catch(error){
      console.error("Error:", error);
    }
  }

  static async add(port) {
    try {
      const response = await api.post(`ports`, port);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
}
