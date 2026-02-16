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

  static async delete(boatId) {
    try {
      const response = await api.delete(`api/v1/boats/${boatId}`);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error deleting boat:", error);
      return [];
    }


  }

  static async getBoatsTypes() {
    try {
      const response = await api.get('/api/v1/boats/types');
      return response.data;
    } catch (error) {
      console.error("Error fetching boats:", error);
      return [];
    }
  }

  static async addBoat(boat, userId) {
    try {

      const response = await api.post(`/api/v1/boats/${userId}`, boat);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }

  }
}

