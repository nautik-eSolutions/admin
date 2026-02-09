import {api} from "boot/axios.js";
import User from "src/model/User.js";

export class UserService {

  static async getAll() {
    try {
      const response = await api.get('/api/v1/users');
      console.log(response);
      return response.data.map(item => User.fromJson(item));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
}
