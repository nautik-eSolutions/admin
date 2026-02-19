import {defineStore} from 'pinia'
import {getAllUsersByPort} from "src/service/UsersService.js";


export const useUserStore = defineStore('userStore', {
    state: () => {
      return {
        Users: []
      }
    },
    actions: {
      async getAllUsersByPort(portId) {
        const resp = await getAllUsersByPort(portId);
        if (resp.status === !200) {
          console.log("")
        }
        this.Users = resp.data.map(json => this.fromJson(json))
        return this.Users;
      },
      fromJson(json) {
        return new User(
          json.firstName,
          json.lastName,
          json.email,
          json.id
        )
      }
    }
  }
)


class User {
  constructor(firstName, lastName, email, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.id = id;
  }
}
