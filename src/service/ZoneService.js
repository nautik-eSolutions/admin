import {api} from "boot/axios.js";
import {Zone} from "src/model/Zone.js";
import {Mooring} from "src/model/Mooring.js";
import {ZoneCreate} from "src/model/Create/ZoneCreate.js";
import {Notify} from "quasar";

export class ZoneService {
  static async getAllMooringsFromZoneId(zoneId) {
    try {
      const response = await api.get(`moorings/zone/${zoneId}`);
      return response.data.map(item => Mooring.fromJson(item));
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  static async getAllZonesAndMooringsFromPort(portId) {
    try {
      const responseZones = await api.get(`/zones/port/${portId}`);

      const zones = responseZones.data.map(item => Zone.fromJson(item));
      for (const zone of zones) {
        zone.setMoorings((await api.get(`moorings/zone/${zone.id}`)).data.map(item => Mooring.fromJson(item)));

      }

      return zones;
    } catch (error) {
      console.log("Error: " + error);
    }
  }


  static async getZonesByPort(portId) {
    try {
      const responseZones = await api.get(`/zones/port/${portId}`);
      return responseZones.data.map(item => Zone.fromJson(item))
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  static async addZone(name, description, portId) {
      const dto = new ZoneCreate(name, description);
      return await api.post(`/zones/port/${portId}`, dto);
  }

  static async updateZone(name, description, zoneId) {
    try {
      const dto = new ZoneCreate(name, description);
      return await api.put(`/zones/${zoneId}`, dto);
    } catch (error) {
      console.log("Error: " + error);
    }

  }

  static async getZoneById(id) {
    try {
      const resp = await api.get(`zones/${id}`).then(resp => resp.data)
      return Zone.fromJson(resp)
    } catch (error) {
      console.log("Error: " + error)
    }
  }


  static async delete(zoneId) {

    return await api.delete(`zones/${zoneId}`);

  }
}

export async function getServicesByZone(zoneId) {
  return await api.get(`services/zone/${zoneId}`)
}

export async function addServiceToZone(serviceId, zoneId) {
  return await api.post(`services/${serviceId}/zone/${zoneId}`)
}

export async function removeServiceFromZone(serviceId, zoneId) {
  return await api.delete(`services/${serviceId}/zone/${zoneId}`)
}
