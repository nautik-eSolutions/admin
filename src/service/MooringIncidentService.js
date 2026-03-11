import { api } from 'boot/axios.js'

export class MooringIncidentService {
  static async createIncident(mooringId, incidentData) {
    const response = await api.post(`/moorings/${mooringId}/incidents`, incidentData)
    return response.data
  }

  static async getCurrentIncidents() {
    const response = await api.get('/moorings/incidents/now')
    return response.data
  }

  static async getAllIncidents() {
    const response = await api.get('/moorings/incidents')
    return response.data
  }

  static async updateIncident(incidentId, incidentData) {
    const response = await api.put(`/moorings/incidents/${incidentId}`, incidentData)
    return response.data
  }

  static async deleteIncident(incidentId) {
    await api.delete(`/moorings/incidents/${incidentId}`)
  }
}
