<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import {PortService} from "src/service/PortService.js";
import {ZoneService} from "src/service/ZoneService.js";

const router = useRouter()

const port=ref();
const ports = ref();
const zones = ref();
onMounted(async () => {
  ports.value = await PortService.getAll();
})
async function getZones(port) {
zones.value = await ZoneService.getAllZonesFromAPort(port.value);
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Zona',
    align: 'left',
    field: 'name',
    sortable: true
  }
]


function handleClick(zone) {
  router.push('/zone/'+zone.id)
}
</script>



<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div v-if="ports" class="col-12 col-md-4">
        <q-select
          v-model="port"
          :options="ports.map(port=> {return {label:port.name, value:port.id}})"
          label="Selecciona un puerto"
          @update:modelValue="getZones"
        />
      </div>
      <div class="col-12" v-if="zones">
        <q-table
          title="Zonas"
          :rows="zones"
          :columns="columns"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-btn
                flat
                class="hover:border-gray-100"
                color="primary"
                :label="props.row.name"
                @click="handleClick(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>

    </div>
  </q-page>
</template>


<style scoped>
</style>
