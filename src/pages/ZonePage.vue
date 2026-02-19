<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {ZoneService} from "src/service/ZoneService.js";
import {useMooring} from "stores/mooring.js";

const params = useRoute().params;
const mooringStore = useMooring();

const zoneId = params.id;
const zone = ref();
const moorings =  ref();
onMounted(async()=>{
  zone.value = await ZoneService.getZoneById(zoneId);
  moorings.value = await mooringStore.getMooringByZoneId(zoneId)
})

const columns = [
  {
    name: 'numero',
    required: true,
    label: 'Nº Amarre',
    align: 'left',
    field: row => row.number,
    sortable: true
  },
  {
    name: 'dimensiones',
    align: 'center',
    label: 'Dimensiones',
    field: row => `${row.length}m x ${row.beam}m`,
    sortable: true
  },

]

const pagination = ref({
  rowsPerPage: 5
})
</script>

<template>
  <q-page padding>
    <div class="q-pa-md q-mt-md">
      <q-card flat bordered class="my-card q-mb-xl">

        <q-card-section>
          <template v-if="zone">
          <div class="text-h5 text-primary">{{ zone.name }}</div>
          <div class="text-subtitle2 text-grey-8">{{ zone.description }}</div>
          </template>
        </q-card-section>

      </q-card>

     <template v-if="moorings">
      <q-table
        title="Lista de amarres"
        :rows="moorings"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination="pagination"
      >
      </q-table>
     </template>
    </div>
  </q-page>
</template>



<style scoped>
.my-card {
  width: 100%;
  max-width: 20rem;

}
</style>
