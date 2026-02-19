import { defineStore } from 'pinia'
import User from "src/model/User.js";
import {loginUser} from "src/service/AuthService.js";




export default defineStore('myStore', {
  state: () => {
    return {
      User: User,
      token : "",
      isAuthenticated: false,
    }
  },
  getters: {},
  actions: {
    async loginUser(userName, password) {
      const resp = await loginUser(userName, password)
      console.log(resp)
      if (resp.status === 200) {
        this.User =  new User(userName)
        this.token =  resp.data.token.token
        this.isAuthenticated =  true;
      }
    }
    ,
    async logout(){
      this.User = null
      this.token = ''
      this.isAuthenticated = false
    }

  },
  persist:true
})


