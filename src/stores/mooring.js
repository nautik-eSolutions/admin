import {defineStore} from 'pinia';


export const useMooring = defineStore('mooringStore',{
  state:()=>{
    return{
    Moorings:[]
    }
  },
  actions:{
    async getMoorings(portId){



    }
  }


})
