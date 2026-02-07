import {api} from "boot/axios.js";


export async function loginUser(userName,password) {
  const response = await api.post('login', {
    "userName": userName,
    "password": password,
  })
    .then((resp) => resp)

  return response ;

}
