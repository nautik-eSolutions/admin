import {api} from "boot/axios.js";


export async function loginUser(userName,password) {
  const response = await api.post('api/v1/auth/login', {
    "userName": userName,
    "password": password,
  })
    .then((resp) => resp)

  console.log(response)

  return response;

}
