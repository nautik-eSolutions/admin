import {api} from "boot/axios.js";
import {Boat as Company} from "src/model/Boat.js";


export class CompanyService {

  static async getAll() {
    try {
      const companies = await api.get(`companies`);
      console.log(companies)
      return companies.data.map(item => Company.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

}
