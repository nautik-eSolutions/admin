<script setup>
import {useRoute} from "vue-router";
  import {PortService} from "src/service/PortService.js";
import { onMounted, ref} from "vue";
import {ZoneService} from "src/service/ZoneService.js";

  const routeParams = useRoute().params

  const port = ref();
  const zones = ref([]);

  onMounted(() => {
    loadPortInfo()
  })

  const loadPortInfo = async () => {

    port.value = await PortService.getOne(routeParams.portId);
    zones.value = await ZoneService.getAllZonesAndMooringsFromPort(routeParams.portId);
  }


const columnsMoorings = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'number', label: 'NUMBER', field: 'number', align: 'center' },
  { name: 'length', label: 'LENGTH', field: 'length', align: 'center' },
  { name: 'beam', label: 'BEAM', field: 'beam', align: 'center' }
]


const pagination = ref({
  page: 1,
  rowsPerPage: 10
})


</script>

<template>
  <q-page>


    <q-markup-table>
      <thead>
      <tr>
        <th class="text-center">ID</th>
        <th class="text-center">NAME</th>
        <th class="text-center">COMPANY NAME</th>
        <th class="text-center">CITY NAME</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-center">{{port.id}}</td>
        <td class="text-center">{{port.name}}</td>
        <td class="text-center">{{port.companyName}}</td>
        <td class="text-center">{{port.cityName}}</td>
      </tr>
      </tbody>
    </q-markup-table>

    <h3>Zones: </h3>

    <q-expansion-item v-for="zone in zones" :key="zone.id"
                      expand-separator
                      icon="perm_identity"
                      :label="zone.description"
                      :caption="zone.name"
    >
      <q-card>
        <q-table
          title="Moorings"
          :rows="zone._moorings"
          :columns="columnsMoorings"
          row-key="id"
          v-model:pagination="pagination"
          :rows-per-page-options="[5, 10, 20]"
          class="cursor-pointer"
        />

      </q-card>
    </q-expansion-item>



  </q-page>
</template>

<style scoped>



</style>
