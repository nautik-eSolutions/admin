
import { api } from 'src/boot/axios'

export async function getOccupancyByMooringCategoryAndDates(mooringCategoryId, startDate, endDate) {
    return api.get(`/occupancy/mooring-categories/${mooringCategoryId}/dates/${startDate}/${endDate}`)}

export async function getCheckInsByDate(date) {
  return await api.get(`/occupancy/checkins`, { params: { date } });
}

export async function getCheckOutsByDate(date) {
  return await api.get(`/occupancy/checkouts`, { params: { date } });
}

export async function updateArrivalStatus(occupancyId, hasArrived, actualTime) {
  return await api.patch(`/occupancy/${occupancyId}/arrival`, {
    hasArrived,
    actualTime
  });
}

export async function updateDepartureStatus(occupancyId, hasArrived, actualTime) {
  return await api.patch(`/occupancy/${occupancyId}/departure`, {
    hasArrived,
    actualTime
  });
}

export async function updateCheckInTime(occupancyId, time) {
  return await api.patch(`/occupancy/${occupancyId}/checkin-time`, { time });
}

export async function updateCheckOutTime(occupancyId, time) {
  return await api.patch(`/occupancy/${occupancyId}/checkout-time`, { time });
}

