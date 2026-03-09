import {api} from "boot/axios.js";
import {Boat as Company} from "src/model/Boat.js";


export class CompanyService {

  static async getAll() {
    try {
      const response = await api.get('companies')
      return response.data
    } catch (error) {
      console.error('Error fetching companies:', error)
      return []
    }
  }
  static async create(companyDto, username, password) {
    const response = await api.post(
      `companies/administrators/${encodeURIComponent(username)}/${encodeURIComponent(password)}`,
      companyDto
    )
    return response.data
  }

  static async delete(companyId) {
    const response = await api.delete(`companies/${companyId}`)
    return response
  }

}
