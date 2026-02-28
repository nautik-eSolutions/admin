
import { api } from 'src/boot/axios'

export default {
  getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate) {
    return api.get(`/occupancy/mooring-categories/${mooringCategoryId}/dates/${startDate}/${endDate}`)
  }
}
