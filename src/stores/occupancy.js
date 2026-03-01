
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import {
  getOccupancyByMooringCategoryAndDates,
  getCheckInsByDate,
  getCheckOutsByDate,
  updateArrivalStatus,
  updateDepartureStatus,
  updateCheckInTime,
  updateCheckOutTime
} from 'src/service/OccupancyService';
import { Booking } from 'src/model/Booking';
import { Mooring } from 'src/model/Mooring';
import { CheckInOut } from 'src/model/CheckInOut';

const isOk = (status) => status >= 200 && status < 300;

const onError = (e, msg, $q) =>
  $q.notify({
    type: 'negative',
    position: 'top-right',
    message: e?.response?.data?.message ?? e?.message ?? msg,
  });
const onSuccess = (msg, $q) =>
  $q.notify({
    type: 'positive',
    position: 'top-right',
    message: msg,
  });
export const useOccupancyStore = defineStore('occupancy', {
  state: () => ({
    bookings: [],
    moorings: [],
    error: null,
    checkIns: [],
    checkOuts: [],
    selectedDate: null,
  }),

  actions: {
    async getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate) {
      const $q = useQuasar();

      try {
        this.error = null;
        const response = await getOccupancyByMooringCategoryAndDates(
          mooringCategoryId,
          startDate,
          endDate
        );
        if (!isOk(response.status)) {
          this.error = 'Error al cargar datos';
          onError(this.error,$q)
          throw new Error(`Failed with Error: ${response.status}`);
        }

        this.bookings = response.data.bookings.map(bookingData => Booking.fromJson(bookingData));
        this.moorings = response.data.moorings.map(mooringData => Mooring.fromJson(mooringData));

        return response.data;

      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        onError(error,"Algo salió mal",$q)

        throw error;
      }
    },
    clearOccupancy() {
      this.bookings = [];
      this.moorings = [];
      this.error = null;
    },
    async getCheckInsByDate(date) {
      const $q = useQuasar();

      try {
        const resp = await getCheckInsByDate(date);
        if (!isOk(resp.status)) throw new Error();

        this.checkIns = resp.data.map(item => CheckInOut.fromJson(item));
        this.selectedDate = date;
        return this.checkIns;
      } catch (e) {
        onError(e, 'Error al obtener los check-ins del día.', $q);
        return [];
      }
    },

    async getCheckOutsByDate(date) {
      const $q = useQuasar();

      try {
        const resp = await getCheckOutsByDate(date);
        if (!isOk(resp.status)) throw new Error();

        this.checkOuts = resp.data.map(item => CheckInOut.fromJson(item));
        this.selectedDate = date;
        return this.checkOuts;
      } catch (e) {
        onError(e, 'Error al obtener los check-outs del día.', $q);
        return [];
      }
    },

    async updateArrivalStatus(occupancyId, hasArrived, actualTime) {
      const $q = useQuasar();

      try {
        const resp = await updateArrivalStatus(occupancyId, hasArrived, actualTime);
        if (!isOk(resp.status)) throw new Error();
        const checkIn = this.checkIns.find(c => c.id === occupancyId);
        if (checkIn) {
          checkIn.hasArrived = hasArrived;
          checkIn.actualTime = actualTime;
        }
        onSuccess(hasArrived ? 'Check-in registrado' : 'Check-in desmarcado', $q);
      } catch (e) {
        onError(e, 'Error al actualizar el estado de llegada.', $q);
      }
    },
    async updateDepartureStatus(occupancyId, hasArrived, actualTime) {
      const $q = useQuasar();

      try {
        const resp = await updateDepartureStatus(occupancyId, hasArrived, actualTime);
        if (!isOk(resp.status)) throw new Error();
        const checkOut = this.checkOuts.find(c => c.id === occupancyId);
        if (checkOut) {
          checkOut.hasArrived = hasArrived;
          checkOut.actualTime = actualTime;
        }
        onSuccess(hasArrived ? 'Check-out registrado' : 'Check-out desmarcado', $q);
      } catch (e) {
        onError(e, 'Error al actualizar el estado de salida.', $q);
      }
    },

    async updateCheckInTime(occupancyId, time) {
      const $q = useQuasar();

      try {
        const resp = await updateCheckInTime(occupancyId, time);
        if (!isOk(resp.status)) throw new Error();
        const checkIn = this.checkIns.find(c => c.id === occupancyId);
        if (checkIn) {
          checkIn.actualTime = time;
        }
        onSuccess('Hora de llegada actualizada', $q);
      } catch (e) {
        onError(e, 'Error al actualizar la hora de llegada.', $q);
      }
    },
    async updateCheckOutTime(occupancyId, time) {
      const $q = useQuasar();

      try {
        const resp = await updateCheckOutTime(occupancyId, time);
        if (!isOk(resp.status)) throw new Error();
        const checkOut = this.checkOuts.find(c => c.id === occupancyId);
        if (checkOut) {
          checkOut.actualTime = time;
        }
        onSuccess('Hora de salida actualizada', $q);
      } catch (e) {
        onError(e, 'Error al actualizar la hora de salida.', $q);
      }
    }
  }
});
