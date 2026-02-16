<script setup>
import {useRoute} from "vue-router";
import {PortService} from "src/service/PortService.js";
import {computed, onMounted, ref} from "vue";
import {ZoneService} from "src/service/ZoneService.js";
import {MooringDimensionsService} from "src/service/MooringDimensionsService.js";
import {MooringCreate} from "src/model/Create/MooringCreate.js";
import {MooringService} from "src/service/MooringService.js";



const routeParams = useRoute().params

const zoneName = ref();
const description = ref();

const port = ref({
  id: '',
  name: '',
  companyName: '',
  cityName: ''
});
  const zones = ref([]);

  const zonesMap = computed(() =>
    zones.value.map(zone => ({
    value: zone.id,
    label: zone.name+" ("+zone.description+")"
  }))
  )


const optionsDimensionsMap = computed(() =>
  dimensionsOptions.value.map(dimensions => ({
    value: dimensions.id,
    label: dimensions.toString()
  }))
)

  const mooringNumber = ref();
  const dimensions = ref();
  const dimensionsOptions = ref([]);
  const zonaAddMooring = ref();

  onMounted(() => {
    loadPortInfo()
  })

  const loadPortInfo = async () => {

    port.value = await PortService.getOne(routeParams.portId);
    zones.value = await ZoneService.getAllZonesAndMooringsFromPort(routeParams.portId);
    dimensionsOptions.value = await MooringDimensionsService.getAll();

  }

  const addZone = async () => {
    await ZoneService.addZone(zoneName.value, description.value, routeParams.portId);
    await loadPortInfo();

  }

  const addMooring = async () => {
    console.log(dimensions);
    console.log(dimensions.value);
    console.log(dimensions.value.value);

      const mooring = new MooringCreate(mooringNumber.value, zonaAddMooring.value.value,dimensions.value.value );
      await MooringService.save(mooring, routeParams.portId);
      await loadPortInfo();

  }

  const deleteMooring = async (id) => {
     await  MooringService.delete(id);
     await loadPortInfo();
  }

  const deleteZone = async (id) => {
    await ZoneService.delete(id, routeParams.portId);
    await loadPortInfo();
  }


const columnsMoorings = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'number', label: 'NUMBER', field: 'number', align: 'center' },
  { name: 'length', label: 'LENGTH', field: 'length', align: 'center' },
  { name: 'beam', label: 'BEAM', field: 'beam', align: 'center' },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'center' }
]


const pagination = ref({
  page: 1,
  rowsPerPage: 10
})


</script>

<template>
  <q-page >


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

    <h3>Zonas: </h3>
    <q-tr>
      <q-td colspan="3">
        <q-form @submit.prevent="addZone">

          <q-card
            flat
            bordered
            class="q-pa-md bg-white"
            style="border-radius: 12px;"
          >
            <p>Añadir zona:</p>
            <div class="row q-col-gutter-md items-end">

              <div class="col-5">
                <q-input
                  v-model="zoneName"
                  label="Zone Name"
                  dense
                  outlined
                  clearable
                />
              </div>

              <div class="col-5">
                <q-input
                  v-model="description"
                  label="Zone Description"
                  dense
                  outlined
                  clearable
                />
              </div>

              <div class="col-2 flex flex-end">
                <q-btn
                  color="positive"
                  label="Add"
                  type="submit"
                  unelevated
                  class="full-width"
                />
              </div>

            </div>
          </q-card>
        </q-form>
      </q-td>
    </q-tr>


        <q-form @submit.prevent="addMooring">

          <q-card
            flat
            bordered
            class="q-pa-md bg-white"
            style="border-radius: 12px;"
          >
            <p>Añadir amarre:</p>
            <div class="row q-col-gutter-md items-end">

              <div class="col-5">
                <q-input
                  v-model="mooringNumber"
                  label="Mooring number"
                  dense
                  outlined
                  clearable
                />
              </div>

              <div class="col-5">
                <q-select
                  :options="optionsDimensionsMap"
                  v-model="dimensions"
                  label="Mooring dimensions: length x bream x draft"
                  dense
                />
              </div>

              <div class="col-5">
                <q-select
                  :options="zonesMap"
                  v-model="zonaAddMooring"
                  label="Zona"
                  dense
                />
              </div>

              <div class="col-2 flex flex-end">
                <q-btn
                  color="positive"
                  label="Add"
                  type="submit"
                  unelevated
                  class="full-width"
                />
              </div>

            </div>
          </q-card>
        </q-form>


    <q-expansion-item v-for="zone in zones" :key="zone.id"
                      expand-separator
                      icon="perm_identity"
                      :label="zone.name"
                      :caption="zone.description"
    >
      <q-card>

        <q-btn v-if="zone._moorings.length <= 0"
            color="negative"
            label="DELETE"
            dense
            @click="deleteZone(zone.id)"
        />

        <q-table v-if="zone._moorings.length > 0"
          title="Moorings"
          :rows="zone._moorings"
          :columns="columnsMoorings"
          row-key="id"
          v-model:pagination="pagination"
          :rows-per-page-options="[5, 10, 20]"
          class="cursor-pointer"
        >
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                color="negative"
                label="DELETE"
                dense
                @click="deleteMooring(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>

      </q-card>
    </q-expansion-item>



  </q-page>
</template>

<style scoped>



</style>
