import {api} from "boot/axios.js";

export async function getBookings(portId){
  return await api.get(`bookings/ports/${portId}`);
}
export async function getBookingsByMooringId(mooringId){
  return await api.get(`bookings/moorings/${mooringId}`);
}
