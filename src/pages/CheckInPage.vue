<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { useOccupancyStore } from 'src/stores/occupancy.js';

const $q = useQuasar();
const occupancyStore = useOccupancyStore();

const selectedDate = ref(date.formatDate(Date.now(), 'YYYY/MM/DD'));
const loading = ref(false);
const editingTime = ref(null);

const checkIns = computed(() => occupancyStore.checkIns);

const formattedDate = computed(() => {
  return (date.formatDate(selectedDate.value, 'YYYY-MM-DD')).replace("/","-");
});

async function loadCheckIns (){
  loading.value = true;
  try {

    await occupancyStore.getCheckInsByDate(formattedDate.value);
  } finally {
    loading.value = false;
  }
};

async function onDateChange (value) {
  selectedDate.value = value;
  await loadCheckIns();
};

const toggleArrival = async (checkIn) => {
  const newStatus = !checkIn.hasArrived;
  const currentTime = newStatus ? date.formatDate(Date.now(), 'HH:mm') : null;

  await occupancyStore.updateArrivalStatus(
    checkIn.id,
    newStatus,
    currentTime
  );
};

async function startEditingTime (checkInId) {
  editingTime.value = checkInId;
};

const updateTime = async (checkIn, newTime) => {
  if (newTime && newTime !== checkIn.actualTime) {
    await occupancyStore.updateCheckInTime(checkIn.id, newTime);
  }
  editingTime.value = null;
};
onMounted(() => {
  loadCheckIns();
});
</script>

<template>
  <q-page padding class="bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">Check-Ins del Día</h3>
            <p class="text-gray-600">Gestiona las llegadas programadas</p>
          </div>

          <div class="flex items-center gap-4">
            <q-input
              type="date"
              v-model="selectedDate"
              filled
              dense
              class="w-48"
              @update:model-value="onDateChange"
            >
            </q-input>

            <q-btn
              icon="refresh"
              color="primary"
              flat
              round
              @click="loadCheckIns"
              :loading="loading"
            >
              <q-tooltip>Recargar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <q-card flat bordered class="shadow-sm">
        <q-card-section class="p-0">
          <q-list separator>
            <q-item class="bg-gray-50 text-gray-700 font-semibold">
              <q-item-section avatar class="min-w-0 pr-0" style="max-width: 50px;">
                <div class="text-center text-xs">Estado</div>
              </q-item-section>
              <q-item-section style="max-width: 120px;">
                <div class="text-xs">Hora Llegada</div>
              </q-item-section>
              <q-item-section>
                <div class="text-xs">Huésped</div>
              </q-item-section>
              <q-item-section>
                <div class="text-xs">Embarcación</div>
              </q-item-section>
              <q-item-section style="max-width: 120px;">
                <div class="text-xs">Amarre</div>
              </q-item-section>
            </q-item>

            <!-- Loading State -->
            <q-item v-if="loading">
              <q-item-section>
                <div class="flex justify-center py-12">
                  <q-spinner color="primary" size="3em" />
                </div>
              </q-item-section>
            </q-item>
            <q-item v-else-if="checkIns.length === 0">
              <q-item-section>
                <div class="text-center py-12">
                  <q-icon name="event_busy" size="4em" color="grey-4" class="mb-3" />
                  <div class="text-gray-500 text-lg">No hay check-ins programados para {{ formattedDate }}</div>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-for="checkIn in checkIns"
              :key="checkIn.id"
              class="hover:bg-gray-50 transition-colors"
              :class="{ 'bg-green-50': checkIn.hasArrived }"
            >
              <q-item-section avatar class="min-w-0 pr-0" style="max-width: 50px;">
                <q-checkbox
                  :model-value="checkIn.hasArrived"
                  @update:model-value="toggleArrival(checkIn)"
                  color="green"
                  size="md"
                />
              </q-item-section>
              <q-item-section style="max-width: 120px;">
                <div v-if="editingTime === checkIn.id">
                  <q-input
                    :model-value="checkIn.actualTime || checkIn.scheduledTime"
                    mask="##:##"
                    fill-mask
                    dense
                    outlined
                    bg-color="white"
                    @blur="(e) => updateTime(checkIn, e.target.value)"
                    @keyup.enter="(e) => updateTime(checkIn, e.target.value)"
                    autofocus
                  >
                    <template v-slot:prepend>
                      <q-icon name="schedule" size="xs" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-else
                  @click="startEditingTime(checkIn.id)"
                  class="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <q-icon name="schedule" size="xs" color="primary" />
                    <span class="font-mono">{{ checkIn.actualTime || checkIn.scheduledTime || '--:--' }}</span>
                    <q-icon name="edit" size="xs" color="grey-6" />
                  </div>
                  <q-tooltip>Click para editar</q-tooltip>
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-medium text-gray-800">
                  {{ checkIn.guestName }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-gray-700">
                  <q-icon name="sailing" size="xs" class="mr-1" />
                  {{ checkIn.boatName }}
                </q-item-label>
              </q-item-section>
              <q-item-section style="max-width: 120px;">
                <q-badge color="primary" outline class="px-3 py-1">
                  Amarre {{ checkIn.mooringNumber }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <div class="mt-6 bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div>
              <div class="text-sm text-gray-600">Total Check-Ins</div>
              <div class="text-2xl font-bold text-gray-800">{{ checkIns.length }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Completados</div>
              <div class="text-2xl font-bold text-green-600">
                {{ checkIns.filter(c => c.hasArrived).length }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600">Pendientes</div>
              <div class="text-2xl font-bold text-orange-600">
                {{ checkIns.filter(c => !c.hasArrived).length }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<style scoped>
</style>
