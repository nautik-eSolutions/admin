import { defineStore } from 'pinia'
import User from "src/model/User.js";
import router from "src/router/routes.js";
import {loginUser} from "src/service/AuthService.js";



export default defineStore('myStore', {
  state: () => {
    return {
      User: User,
      token : localStorage.getItem("token"),
      isAuthenticated: false,
    }
  },
  getters: {},
  actions: {
    async loginUser(userName, password) {
      const resp = await loginUser(userName, password)
      if (resp.status === 200) {
        this.User =  new User(userName)
        this.token =  resp.data.token

      }
      this.isAuthenticated =  true;

      router.push()
    }
    ,
    async logout(){
      this.User = null
      this.token = ''
      this.isAuthenticated = false

      router.push()
    }

  },
  persist:true
})


