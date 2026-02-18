import { defineStore } from 'pinia'
import User from "src/model/User.js";
import {loginUser} from "src/service/AuthService.js";


const linksList = [
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
    title: 'Barcos',
    icon: '',
    link: '/boats'
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
  }
]
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
    title: 'Barcos',
    icon: '',
    link: '/boats'
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
    title: 'Barcos',
    icon: '',
    link: '/boats'
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
        case "PORT_ADMIN":
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


