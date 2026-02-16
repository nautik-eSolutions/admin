import { defineStore } from 'pinia'

export const useBookingStore = defineStore('bookingStore', {
  state: () => {
    return {
      Booking: [],
    }
  },
  actions: {
    async getAllBookings(){
      const resp = await getBookings()

    }


  },
})
