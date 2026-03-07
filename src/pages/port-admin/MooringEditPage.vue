<script setup>
import { onMounted, ref } from 'vue'
import { useMooring } from "stores/mooring.js";
import { useRoute } from "vue-router";
import { useBookingStore } from "stores/booking.js";

const mooringStore = useMooring();
const bookingStore = useBookingStore();
const params = useRoute().params;

const mooring = ref(null);
const bookings = ref([]);

onMounted(async () => {
  mooring.value = await mooringStore.getMooringById(params.id);
  bookings.value = await bookingStore.getBookingsByMooring(params.id);
})

const bookingsColumns = [
  { name: 'client', label: 'Cliente', field: 'cc', align: 'left', sortable: true },
  { name: 'boat', label: 'Embarcación', field: 'boatId', align: 'left' },
  { name: 'startDate', label: 'Check-in', field: 'startDate', align: 'center' },
  { name: 'endDate', label: 'Check-out', field: 'endDate', align: 'center' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' }
]


</script>
<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">

      <q-card flat bordered class="q-mb-lg overflow-hidden">
        <q-card-section class="row items-center q-col-gutter-md q-pa-lg">
          <div class="col">
            <template v-if="mooring">
              <div class="row items-baseline q-gutter-sm">
                <span class="text-h4 text-weight-bold text-grey-9">{{ mooring.number }}</span>
                <q-badge outline color="primary" label="Amarre Activo" />
              </div>
              <div class="row q-gutter-md q-mt-xs text-subtitle1 text-grey-7">
                <div class="row items-center">
                  <q-icon name="straighten" class="q-mr-xs" />
                  Eslora: <span class="text-weight-bold text-grey-10 q-ml-xs">{{ mooring.length }}m</span>
                </div>
                <div class="row items-center">
                  <q-icon name="width_full" class="q-mr-xs" />
                  Manga: <span class="text-weight-bold text-grey-10 q-ml-xs">{{ mooring.beam }}m</span>
                </div>
                <div class="row items-center">
                  <q-icon name="sailing" class="q-mr-xs" />
                  Calado: <span class="text-weight-bold text-grey-10 q-ml-xs">{{ mooring.draft }}m</span>
                </div>
              </div>
            </template>
            <q-skeleton v-else type="rect" width="300px" height="40px" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg" v-if="mooring">
          <div class="text-overline text-grey-7 q-mb-md">Detalles Técnicos</div>
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-6 uppercase">Identificador de Amarre</div>
              <div class="text-subtitle1 text-weight-medium">{{ mooring.number }}</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-6 uppercase">Dimensiones Máximas (LxBxD)</div>
              <div class="text-subtitle1 text-weight-medium">
                {{ mooring.length }}m x {{ mooring.beam }}m x {{ mooring.draft }}m
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-table
        v-if="mooring"
        :rows="bookings"
        :columns="bookingsColumns"
        row-key="id"
        flat
        bordered
        title="Historial de Reservas"
        class="sticky-header-table shadow-1"
      >
        <template v-slot:top-right>
          <q-btn color="secondary" icon="add" label="Crear Reserva" dense class="q-px-md" unelevated />
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'Confirmada' ? 'positive' : 'warning'"
              rounded
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1000px;
}
.sticky-header-table {
  background: white;
  border-radius: 8px;
}
.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.q-table tbody tr:hover) {
  background-color: #f5f8ff !important;
}
</style>
