
import { api } from 'src/boot/axios'

export async function getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate) {
    return api.get(`/occupancy/mooring-categories/${mooringCategoryId}/dates/${startDate}/${endDate}`)}

export async function getCheckInsByDate(date) {
  return await api.get(`/occupancy/checkins/${date}`);
}

export async function getCheckOutsByDate(date) {
  return await api.get(`/occupancy/checkouts/${date}`);
}

export async function updateArrivalStatus(occupancyId, hasArrived, actualTime) {
  return await api.put(`/occupancy/${occupancyId}/arrival`, {
    hasArrived,
    actualTime
  });
}

export async function updateDepartureStatus(occupancyId, hasArrived, actualTime) {
  return await api.put(`/occupancy/${occupancyId}/departure`, {
    hasArrived,
    actualTime
  });
}

export async function updateCheckInTime(occupancyId, time) {
  return await api.put(`/occupancy/${occupancyId}/checkin-time`, { time });
}

export async function updateCheckOutTime(occupancyId, time) {
  return await api.put(`/occupancy/${occupancyId}/checkout-time`, { time });
}

