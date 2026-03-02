<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useOccupancyStore } from 'src/stores/occupancy.js';

const $q = useQuasar();
const occupancyStore = useOccupancyStore();

const selectedDate = ref(date.formatDate(Date.now(), 'YYYY/MM/DD').replaceAll("/","-"));
const loading = ref(false);
const editingTime = ref(null);

const checkOuts = computed(() => occupancyStore.checkOuts);
const formattedDate = computed(() => date.formatDate(selectedDate.value, 'DD/MM/YYYY'));

const columns = [
  {
    name: 'status',
    label: 'Estado',
    field: 'hasArrived',
    align: 'center',
    style: 'width: 80px'
  },
  {
    name: 'time',
    label: 'Hora Salida',
    field: row => row.actualTime || row.scheduledTime || '--:--',
    align: 'left',
    style: 'width: 140px'
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

    await occupancyStore.getCheckOutsByDate((selectedDate.value));
  } finally {
    loading.value = false;
  }
}

async function onDateChange(value) {
  selectedDate.value = value;
  await loadCheckOuts();
}

async function toggleDeparture(checkOut) {
  const newStatus = !checkOut.hasArrived;
  const currentTime = newStatus ? date.formatDate(Date.now(), 'HH:mm') : null;

  await occupancyStore.updateDepartureStatus(
    checkOut.id,
    newStatus,
    currentTime
  );
}

async function startEditingTime(checkOutId) {
  editingTime.value = checkOutId;
}

async function updateTime(checkOut, newTime) {
  if (newTime && newTime !== checkOut.actualTime) {
    await occupancyStore.updateCheckOutTime(checkOut.id, newTime);
  }
  editingTime.value = null;
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
            <p class="text-sm text-gray-600">Gestiona las salidas programadas</p>
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
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <q-card flat bordered>
          <q-card-section class="text-center">
            <div class="text-sm text-gray-600 mb-1">Total Check-Outs</div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.total }}</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="text-center">
            <div class="text-sm text-gray-600 mb-1">Completados</div>
            <div class="text-3xl font-bold text-green-600">{{ stats.completed }}</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="text-center">
            <div class="text-sm text-gray-600 mb-1">Pendientes</div>
            <div class="text-3xl font-bold text-orange-600">{{ stats.pending }}</div>
          </q-card-section>
        </q-card>
      </div>

      <q-table
        flat
        bordered
        :rows="checkOuts"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :rows-per-page-options="[10, 25, 50]"
        :pagination="{ rowsPerPage: 25 }"
        class="shadow-sm"
        no-data-label="No hay check-outs programados"
        :no-data-icon="null"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-checkbox
              :model-value="props.row.hasArrived"
              @update:model-value="toggleDeparture(props.row)"
              color="green"
              size="md"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-time="props">
          <q-td :props="props">
            <div v-if="editingTime === props.row.id" class="q-pa-xs">
              <q-input
                :model-value="props.row.actualTime || props.row.scheduledTime"
                mask="##:##"
                fill-mask
                dense
                outlined
                bg-color="white"
                @blur="(e) => updateTime(props.row, e.target.value)"
                @keyup.enter="(e) => updateTime(props.row, e.target.value)"
                autofocus
              >
                <template v-slot:prepend>
                  <q-icon name="schedule" size="xs" />
                </template>
              </q-input>
            </div>

            <div
              v-else
              @click="startEditingTime(props.row.id)"
              class="cursor-pointer hover:bg-gray-100 rounded px-3 py-2 transition-colors inline-flex items-center gap-2"
            >
              <q-icon name="schedule" size="xs" color="primary" />
              <span class="font-mono font-medium">{{ props.value }}</span>
              <q-icon name="edit" size="xs" color="grey-5" />
              <q-tooltip>Click para editar</q-tooltip>
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
              <q-icon name="sailing" size="sm" color="primary" />
              {{ props.value }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-mooring="props">
          <q-td :props="props">
            <q-chip
              color="primary"
              text-color="white"
              size="sm"
              icon="anchor"
            >
              Amarre {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="{ 'bg-green-50': props.row.hasArrived }"
          >
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <component
                :is="$options.components[`body-cell-${col.name}`] || 'div'"
                v-bind="{ props: { ...props, value: col.value } }"
              />
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
