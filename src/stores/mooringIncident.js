import { defineStore } from 'pinia'
import { MooringIncidentService } from '../service/MooringIncidentService'

export const useMooringIncidentStore = defineStore('mooringIncident', {
  state: () => ({
    incidents: [],
    currentIncidents: [],
    currentIncident: null,
    loading: false,
    error: null
  }),

  getters: {
    pendingIncidents: (state) => {
      return state.incidents.filter(i => i.status === 'PENDING')
    },

    inProgressIncidents: (state) => {
      return state.incidents.filter(i => i.status === 'IN_PROGRESS')
    },

    resolvedIncidents: (state) => {
      return state.incidents.filter(i => i.status === 'RESOLVED')
    },

    cancelledIncidents: (state) => {
      return state.incidents.filter(i => i.status === 'CANCELLED')
    },

    activeIncidents: (state) => {
      return state.incidents.filter(i => i.status === 'PENDING' || i.status === 'IN_PROGRESS')
    }
  },

  actions: {
    async fetchCurrentIncidents() {
      this.loading = true
      this.error = null
      try {
        this.currentIncidents = await MooringIncidentService.getCurrentIncidents()
        return this.currentIncidents
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAllIncidents() {
      this.loading = true
      this.error = null
      try {
        this.incidents = await MooringIncidentService.getAllIncidents()
        return this.incidents
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createIncident(mooringId, incidentData) {
      this.loading = true
      this.error = null
      try {
        const newIncident = await MooringIncidentService.createIncident(mooringId, incidentData)
        this.incidents.push(newIncident)
        if (newIncident.status === 'PENDING' || newIncident.status === 'IN_PROGRESS') {
          this.currentIncidents.push(newIncident)
        }
        return newIncident
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateIncident(incidentId, incidentData) {
      this.loading = true
      this.error = null
      try {
        const updatedIncident = await MooringIncidentService.updateIncident(incidentId, incidentData)

        const index = this.incidents.findIndex(i => i.id === incidentId)
        if (index !== -1) {
          this.incidents[index] = updatedIncident
        }

        const currentIndex = this.currentIncidents.findIndex(i => i.id === incidentId)
        if (currentIndex !== -1) {
          if (updatedIncident.status === 'PENDING' || updatedIncident.status === 'IN_PROGRESS') {
            this.currentIncidents[currentIndex] = updatedIncident
          } else {
            this.currentIncidents.splice(currentIndex, 1)
          }
        }

        if (this.currentIncident && this.currentIncident.id === incidentId) {
          this.currentIncident = updatedIncident
        }

        return updatedIncident
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteIncident(incidentId) {
      this.loading = true
      this.error = null
      try {
        await MooringIncidentService.deleteIncident(incidentId)
        this.incidents = this.incidents.filter(i => i.id !== incidentId)
        this.currentIncidents = this.currentIncidents.filter(i => i.id !== incidentId)
        if (this.currentIncident && this.currentIncident.id === incidentId) {
          this.currentIncident = null
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentIncident(incident) {
      this.currentIncident = incident
    },

    clearError() {
      this.error = null
    }
  }
})
