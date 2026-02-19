import {defineStore} from 'pinia';
import {getMooringByZoneId, getMoorings} from "src/service/MooringService.js";
import {Mooring} from "src/model/Mooring.js";


export const useMooring = defineStore('mooringStore', {
  state: () => {
    return {
      Moorings: []
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
    async getMooringByZoneId(zoneId){
      const resp =  await getMooringByZoneId(zoneId)
      if (resp.status=== 200){
        console.log("recuerda hacer el toast de esto : mooringStore 16")
        this.Moorings = resp.data.map(mooring =>this.fromJson(mooring))
        return this.Moorings;
      }

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
