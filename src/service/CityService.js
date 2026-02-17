import {api} from "boot/axios.js";
import {City} from "src/model/City.js";


export class CityService {

  static async getAll() {
    try {
      const cities = await api.get(`locations/cities`);
      console.log(cities)
      return cities.data.map(item => City.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

}
