import {api} from "boot/axios.js";
import {Zone} from "src/model/Zone.js";
import {Mooring} from "src/model/Mooring.js";

export class ZoneService{
  static async getAllFromPort(portId){
      try {
        const response = await api.get(`/ports/${portId}/zones`);
        return response.data.map(item => Zone.fromJson(item));
      }catch(error){
        console.log("Error: "+error);
      }
  }
  static async getAllMooringsFromZoneId(zoneId){
    try {
      const response = await api.get(`/api/v1/moorings/zone/${zoneId}`);
      return response.data.map(item => Mooring.fromJson(item));
    }catch(error){
      console.log("Error: "+error);
    }
  }

  static async getAllZonesAndMooringsFromPort(portId){
    try{
      const responseZones = await api.get(`/api/v1/ports/${portId}/zones`);
      const zones = responseZones.data.map(item => Zone.fromJson(item));
      console.log(zones);
      for (const zone of zones) {
        zone.setMoorings( (await api.get(`/api/v1/moorings/zone/${zone.id}`)).data.map(item => Mooring.fromJson(item)));
      }
      console.log(zones);
      return zones;
    }catch(error){
      console.log("Error: "+error);
    }
  }
}
