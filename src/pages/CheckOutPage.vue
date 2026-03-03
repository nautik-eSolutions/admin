<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useOccupancyStore } from 'src/stores/occupancy.js';
import {printCheckInOut} from "src/utils/printList.js";

const $q = useQuasar();
const occupancyStore = useOccupancyStore();

const selectedDate = ref(date.formatDate(Date.now(), 'YYYY/MM/DD').replaceAll("/","-"));
const loading = ref(false);

const checkOuts = computed(() => occupancyStore.checkOuts);
const formattedDate = computed(() => date.formatDate(selectedDate.value, 'DD/MM/YYYY'));

const columns = [
  {
    name: 'time',
    label: 'Hora',
    field: row => row.scheduledTime.substring(11, 16),
    align: 'center',
    style: 'width: 100px',
    sortable: true
  },
  {
    name: 'guest',
    label: 'Huésped',
    field: 'guestName',
    align: 'left',
    sortable: true
  },
  {
    name: 'boat',
    label: 'Embarcación',
    field: 'boatName',
    align: 'left',
    sortable: true
  },
  {
    name: 'mooring',
    label: 'Amarre',
    field: 'mooringNumber',
    align: 'center',
    style: 'width: 120px',
    sortable: true
  }
];

const stats = computed(() => ({
  total: checkOuts.value.length,
  completed: checkOuts.value.filter(c => c.hasArrived).length,
  pending: checkOuts.value.filter(c => !c.hasArrived).length
}));

async function loadCheckOuts() {
  loading.value = true;
  try {
    await occupancyStore.getCheckOutsByDate(selectedDate.value);
  } finally {
    loading.value = false;
  }
}

async function onDateChange(value) {
  selectedDate.value = value;
  await loadCheckOuts();
}

function printList() {
  printCheckInOut("Check-out", formattedDate.value,checkOuts)
}

onMounted(() => {
  loadCheckOuts();
});
</script>

<template>
  <q-page padding class="bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">Check-Outs del Día</h3>
            <p class="text-sm text-gray-600">Visualiza las salidas programadas</p>
          </div>

          <div class="flex items-center gap-3">
            <q-input
              type="date"
              v-model="selectedDate"
              filled
              dense
              class="w-48"
              @update:model-value="onDateChange"
            />

            <q-btn
              icon="refresh"
              color="primary"
              flat
              round
              @click="loadCheckOuts"
              :loading="loading"
            >
              <q-tooltip>Recargar</q-tooltip>
            </q-btn>

            <q-btn
              icon="print"
              color="primary"
              unelevated
              label="Imprimir"
              @click="printList"
              :disable="checkOuts.length === 0"
            >
              <q-tooltip v-if="checkOuts.length === 0">No hay datos para imprimir</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <q-table
        flat
        bordered
        :rows="checkOuts"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :rows-per-page-options="[10, 25, 50, 0]"
        :pagination="{ rowsPerPage: 25 }"
        class="shadow-sm"
      >
        <template v-slot:body-cell-time="props">
          <q-td :props="props">
            <div class="flex items-center justify-center gap-2">
              <q-icon name="schedule" size="xs" color="primary" />
              <span class="font-mono font-medium">{{props.value}}</span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-guest="props">
          <q-td :props="props">
            <div class="font-medium text-gray-800">{{ props.value }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-boat="props">
          <q-td :props="props">
            <div class="flex items-center gap-2 text-gray-700">
              {{ props.value }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-mooring="props">
          <q-td :props="props">
            <q-chip
              color="primary"
              text-color="white"
              size="md"
            >
              Amarre {{ props.value }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-row="props">
          <q-tr
            :props="props"
            :class="{ 'bg-green-50': props.row.hasArrived }"
          >
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center text-gray-500 q-gutter-sm q-py-xl">
            <q-icon name="event_busy" size="2em" />
            <span class="text-lg">No hay check-outs programados para {{ formattedDate }}</span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped>
:deep(.q-table tbody td) {
  height: 60px;
}

:deep(.q-table th) {
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
