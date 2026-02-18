import {api} from "boot/axios.js";

export async function getAllUsersByPort(portId){
  const resp =  await api.get(`users/`+portId+``)

  return resp
}
