import {defineStore} from 'pinia';
import {getMooringById, getMooringByZoneId, getMoorings} from "src/service/MooringService.js";
import {Mooring} from "src/model/Mooring.js";


export const useMooring = defineStore('mooringStore', {
  state: () => {
    return {
      Moorings: [],
      Mooring:Mooring
    }
  },
  actions: {
    async getMoorings(portId) {
      const resp = await getMoorings(portId)

      if (resp.status === 200) {
        console.log("recuerda hacer el toast de esto : mooringStore 16")
      }
      this.Moorings = resp.data.map(mooring =>this.fromJson(mooring))
      return this.Moorings;
      },

    async getMooringByZoneId(zoneId) {
      const resp = await getMooringByZoneId(zoneId)


      if (resp.status === 200) {
        console.log("recuerda hacer el toast de esto : mooringStore 16")
        this.Moorings = resp.data.map(mooring => this.fromJson(mooring))
        return this.Moorings;
      }

    },
    async getMooringById(id){
      const resp  =  await getMooringById(id)
      if (resp.status === 200){
        console.log("recuerda hacer el toast de esto : mooringStore")

       this.Mooring = this.fromJson(resp.data);
      }

      return this.Mooring;

    }

  ,
    fromJson(json) {
      return new Mooring(
        json.id,
        json.number,
        json.mooringCategory.dimensionsMaxLength,
        json.mooringCategory.dimensionsMaxBeam,
      );
    }


  }


})
