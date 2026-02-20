import {defineStore} from 'pinia'
import {getBookings, getBookingsByMooringId} from "src/service/BookingService.js";
import {Booking} from "src/model/Booking.js";

export const useBookingStore = defineStore('bookingStore', {
  state: () => {
    return {
      Bookings: [],
      Booking:Booking
    }
  },
  actions: {
    async getAllBookings(portId) {
      const resp = await getBookings(portId)

      if (resp.status !== 200) {
        console.log("Recuerda poner algo ingeniero bookingStore 15")
      }

      this.Bookings = resp.data.map(booking => this.fromJson(booking))

      return this.Bookings
    }
    ,
    async getBookingsByMooring(mooringId){
      const resp = await getBookingsByMooringId(mooringId);

      if (resp.status === 200){
        console.log("Recuerda poner algo ingeniero bookingStore 15")

      }
      this.Bookings = resp.data.map(booking => this.fromJson(booking))

      return this.Bookings
    }

  ,

  fromJson(json) {
    return new Booking(json.id,
      json.startDate,
      json.endDate,
      json.boatId, json.bookingStatusId,
      json.mooringNumber,
      json.mooringId)
  }


},
})
