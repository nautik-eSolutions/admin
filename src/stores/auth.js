import { defineStore } from 'pinia'
import User from "src/model/User.js";
import {loginUser} from "src/service/AuthService.js";


const AdminCompanyLinkList =  [
  {
    title: 'Reservas entrantes',
    icon: '',
    link: '/bookings/incoming'
  },
  {
    title: 'Ocupación',
    icon: '',
    link: '/occupancy'
  },
  {
    title: 'Estado amarres',
    icon: '',
    link: '/states/moorings'
  },
  {
    title: 'Modificar reservas',
    icon: '',
    link: '/bookings/edit'
  },
  {
    title: 'Puertos',
    icon: '',
    link: '/ports'
  },
  {
    title: 'Gestión de usuarios',
    icon: '',
    link:'/users'
  }
]
const PortAdminLinkList = [
  {
    title: 'Reservas entrantes',
    icon: '',
    link: '/bookings/incoming'
  },
  {
    title: 'Ocupación',
    icon: '',
    link: '/occupancy'
  },
  {
    title: 'Estado amarres',
    icon: '',
    link: '/states/moorings'
  },
  {
    title: 'Modificar reservas',
    icon: '',
    link: '/bookings/edit'
  }
]


export const useAuthStore =  defineStore('myStore', {
  state: () => {
    return {
      User: User,
      token : "",
      role:"",
      isAuthenticated: false,
    }
  },
  getters: {},
  actions: {
    async loginUser(userName, password) {
      const resp = await loginUser(userName, password)
      if (resp.status === 200) {
        this.User =  new User(userName)
        this.role = resp.data.role
        this.token =  resp.data.token
        this.isAuthenticated =  true;
      }
    },
    getLinksList(){
      switch (this.role){
        case "ADMIN_COMPANY" :
          return AdminCompanyLinkList;
        case "ADMIN_PORT":
          return PortAdminLinkList;

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


