import { defineStore } from 'pinia'
import {
  getBookings,
  getBookingById,
  patchBookingStatus,
  deleteBooking,
  getBookingsByMooringId
} from 'src/service/BookingService.js'
import { useQuasar } from 'quasar'
import { Booking } from 'src/model/Booking.js'

export const useBookingStore = defineStore('bookingStore', {
  state: () => ({
    Bookings: [],
    Booking: null
  }),

  actions: {
    async getAllBookings(params = {}) {
      const $q = useQuasar()
      try {
        const resp = await getBookings(params)

        if (resp.status !== 200) {
          $q.notify({ type: 'negative', message: 'Error loading bookings' })
          return []
        }
        this.Bookings = resp.data.content.map(booking => this.fromJson(booking))
        console.log(this.Bookings)
        return this.Bookings
      } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: error.response?.data?.detail || 'Error loading bookings' })
        return []
      }
    },

    async getBookingById(id) {
      const $q = useQuasar()
      try {
        const resp = await getBookingById(id)
        if (resp.status !== 200) {
          console.log("Recuerda poner algo outgeniero bookingStore 15")
          $q.notify({ type: 'negative', message: 'Error loading booking' })
          return null
        }
        this.Booking = this.fromJson(resp.data)
        return this.Booking
      } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: error.response?.data?.detail || 'Error loading booking' })
        return null
      }
    },
    async getBookingsByMooring(id) {
      const $q = useQuasar()
      try {
        const resp = await getBookingsByMooringId(id)
        if (resp.status !== 200) {
          $q.notify({ type: 'negative', message: 'Error loading bookings' })
          return null
        }
        this.Bookings = resp.data.map(json=>this.fromJson(json))
        return this.Bookings
      } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: error.response?.data?.detail || 'Error loading booking' })
        return null
      }
    },

    async updateBookingStatus(id, status) {
      const $q = useQuasar()
      try {
        const resp = await patchBookingStatus(id, status)
        if (resp.status !== 200) {
          $q.notify({ type: 'negative', message: 'Error updating status' })
          return null
        }
        const updated = this.fromJson(resp.data)
        const index = this.Bookings.findIndex(b => b.id === id)
        if (index !== -1) this.Bookings[index] = updated
        if (this.Booking && this.Booking.id === id) this.Booking = updated
        $q.notify({ type: 'positive', message: 'Booking status updated' })
        return updated
      } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: error.response?.data?.detail || 'Error updating status' })
        return null
      }

    },

    fromJson(json) {

      return new Booking(
        json.id,
        json.startDate,
        json.endDate,
        json.boatId,
        json.boatName,
        json.boatRegistryNumber,
        json.clientName,
        json.clientEmail,
        json.bookingStatus,
        json.mooring?.number,
        json.mooring?.id
      )
    }
  }
})
