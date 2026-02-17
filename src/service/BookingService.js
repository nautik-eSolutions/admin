import {api} from "boot/axios.js";

export async function getBookings(portId){
  const resp = await api.get(`bookings/ports/${portId}`)
  return resp;
}
