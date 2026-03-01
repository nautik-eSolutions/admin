import {defineStore} from 'pinia'
import occupancyService from 'src/service/OccupancyService'
import {Booking} from 'src/model/Booking'
import {Mooring} from 'src/model/Mooring'
import {useQuasar} from 'quasar'

const isOk = (status) => status >= 200 && status < 300

export const useOccupancyStore = defineStore('occupancy', {
  state: () => ({
    bookings: [], moorings: [], error: null
  }),

  actions: {
    async getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate) {
      const $q = useQuasar()

      try {
        this.error = null
        const response = await occupancyService.getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate)
        if (!isOk(response.status)) {
          this.error = 'Error al cargar datos'
          $q.notify({
            type: 'negative', message: 'Error', caption: `Estado ${response.status}: ${response.statusText}`
          })
          throw new Error(`Failed with aque Error: ${response.status}`)
        }

        this.bookings = response.data.bookings.map(bookingData => Booking.fromJson(bookingData))
        this.moorings = response.data.moorings.map(mooringData => Mooring.fromJson(mooringData))
        $q.notify({
          type: 'positive',
          message: 'Datos cargados correctamente',
          caption: `${this.bookings.length} reservas y ${this.moorings.length} amarres`
        })

        return response.data

      } catch (error) {
        this.error = error.response?.data?.message || error.message

        $q.notify({
          type: 'negative', message: 'Error al cargar la ocupación', caption: this.error
        })

        throw error
      }
    },

    clearOccupancy() {
      this.bookings = []
      this.moorings = []
      this.error = null
    }
  }
})
