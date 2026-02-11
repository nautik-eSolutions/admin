<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 100%; max-width: 1000px">
      <q-table
        title="Ports"
        :rows="ports"
        :columns="columnsPorts"
        row-key="id"
        v-model:pagination="paginationPorts"
        :rows-per-page-options="[5, 10, 20]"
        class="cursor-pointer"
        @row-click="goToPort"
      > <template v-slot:top-row>
        <q-tr>
          <q-td>

          </q-td>
          <q-td>
            <q-input v-model="nameAdd" dense />
          </q-td>

          <q-td>
            <q-select
              v-model="cityAdd"
              :options="cityMap"
              dense
            />
          </q-td>

          <q-td>
            <q-select
              v-model="companyAdd"
              :options="companyMap"
              dense
            />
          </q-td>

          <q-td>
            <q-btn
              color="positive"
              label="ADD"
              @click="addPort"
              dense
            />
          </q-td>
        </q-tr>
      </template>



        <template v-slot:body-cell-actions="props">
      <q-td align="center">
        <q-btn
          color="negative"
          label="DELETE"
          dense
          @click="deletePort(props.row.id)"
        />
      </q-td>
    </template>
        </q-table>
    </div>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import { useRouter} from 'vue-router'
import {PortService} from "src/service/PortService.js";
import {CityService} from "src/service/CityService.js";
import {CompanyService} from "src/service/CompanyService.js";
import {PortCreate} from "src/model/Create/PortCreate.js";

const router = useRouter()



const columnsPorts = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'NAME', field: 'name', align: 'center' },
  { name: 'cityName', label: 'CITY', field: 'cityName', align: 'center' },
  { name: 'companyName', label: 'COMPANY', field: 'companyName', align: 'center' },
  { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'center' }
]


const nameAdd = ref();
const cityAdd = ref();
const companyAdd = ref();

const cities = ref([]);
const companies = ref([]);

const cityMap = computed(() =>
  cities.value.map(city => ({
    value: city.id,
    label: city.name
  }))
)

const companyMap = computed(() =>
  companies.value.map(company => ({
    value: company.id,
    label: company.name,
  }))
)

const loadCityAndCompany = async () => {
  cities.value = await CityService.getAll();
}
const loadCompany = async () => {
  companies.value = await CompanyService.getAll();
}


const paginationPorts = ref({
  page: 1,
  rowsPerPage: 10
})

const deletePort = async (id) => {
  await PortService.delete(id);
  await loadPorts();
}

const addPort = async () => {
  await PortService.add(new PortCreate(nameAdd.value, cityAdd.value.label, companyAdd.value.label));
  setNullRefs()
  await loadPorts();
}

const setNullRefs = () => {
   nameAdd.value = "";
   cityAdd.value = "";
   companyAdd.value = "";
}


const ports = ref([])

const loadPorts = async () => {
    ports.value = await PortService.getAll()
}

onMounted(async () => {
  await loadPorts()
  await loadCityAndCompany()
  await loadCompany()
})


const goToPort = (evt, row) => {
  router.push(`/ports/${row.id}`)
}
</script>
