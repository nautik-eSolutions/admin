import {api} from "boot/axios.js";

export async function getBookings(){
  return await api.get(`bookings`);
}
export async function getBookingsByMooringId(mooringId){
  return await api.get(`bookings/moorings/${mooringId}`);
}

export async function getBookingById(id) {
  return await api.get(`/bookings/${id}`)
}

export async function patchBookingStatus(id, status) {
  return await api.patch(`/bookings/${id}`, { status })
}

export async function deleteBooking(id) {
  return await api.delete(`/bookings/${id}`)
}
