import {api} from "boot/axios.js";


export async function loginUser(userName,password) {
  return await api.post('auth/login/administrator', {
    "userName": userName,
    "password": password,
  })
    .then((resp) => resp) ;

}
