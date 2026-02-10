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
      />
    </div>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRouter} from 'vue-router'
import {PortService} from "src/service/PortService.js";

const router = useRouter()



const columnsPorts = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'NAME', field: 'name', align: 'center' },
  { name: 'cityName', label: 'CITY', field: 'cityName', align: 'center' },
  { name: 'companyName', label: 'COMPANY', field: 'companyName', align: 'center' }
]


const paginationPorts = ref({
  page: 1,
  rowsPerPage: 10
})


const ports = ref([])

const loadPorts = async () => {
    ports.value = await PortService.getAll()
}

onMounted(async () => {
  await loadPorts()
})


const goToPort = (evt, row) => {
  router.push(`/ports/${row.id}`)
}
</script>
