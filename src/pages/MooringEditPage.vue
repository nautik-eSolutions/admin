<script setup>
import {onMounted, ref} from 'vue'
import {useMooring} from "stores/mooring.js";
import {useRoute} from "vue-router";
import {useBookingStore} from "stores/booking.js";


const mooringStore = useMooring();
const bookingStore = useBookingStore();
const params = useRoute().params;


const mooring1 = ref({
  id: 101,
  number: 'A-01-NORTH',
  length: 15.00,
  beam: 5.20
})
const mooring = ref();
const bookings = ref([
  {
    id: 1,
    cliente: 'Juan Pérez',
    barco: 'Sea Breeze',
    entrada: '2026-05-10',
    salida: '2026-05-15',
    status: 'Confirmada'
  },
  {
    id: 2,
    cliente: 'Marina S.L.',
    barco: 'The Kraken',
    entrada: '2026-06-01',
    salida: '2026-06-10',
    status: 'Pendiente'
  },
  {id: 3, cliente: 'Elena Smith', barco: 'Liberty', entrada: '2026-07-20', salida: '2026-07-25', status: 'Confirmada'}
])

const bookingsColumns = [
  {name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left', sortable: true},
  {name: 'barco', label: 'Embarcación', field: 'boatId', align: 'left'},
  {name: 'entrada', label: 'Check-in', field: 'startDate', align: 'center'},
  {name: 'salida', label: 'Check-out', field: 'endDate', align: 'center'},
  {name: 'status', label: 'Estado', field: 'status', align: 'center'}
]

onMounted(async () => {
  mooring.value = await mooringStore.getMooringById(params.id)
  console.log(mooring)
  bookings.value = await bookingStore.getBookingsByMooring(params.id);
})

const onSubmit = () => {

}
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
                <q-badge outline color="primary" label="Amarre Activo"/>
              </div>
              <div class="row q-gutter-md q-mt-xs text-subtitle1 text-grey-7">
                <div class="row items-center">
                  <q-icon name="straighten" class="q-mr-xs"/>
                  Eslora: <span class="text-weight-bold text-grey-10 q-ml-xs">{{ mooring.length }}m</span>
                </div>
                <div class="row items-center">
                  <q-icon name="width_full" class="q-mr-xs"/>
                  Manga: <span class="text-weight-bold text-grey-10 q-ml-xs">{{ mooring.beam }}m</span>
                </div>
              </div>
            </template>
          </div>

          <div class="col-auto row q-gutter-sm">
            <q-btn outline color="grey-7" icon="history" label="Historial"/>
            <q-btn color="primary" icon="save" label="Actualizar Datos" @click="onSubmit"/>
          </div>
        </q-card-section>

        <q-separator/>
        <template v-if="mooring">
          <q-card-section class="q-pa-lg">
            <div class="text-overline text-grey-7 q-mb-md">Configuración Técnica</div>
            <q-form class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="mooring.number"
                  label="Identificador"
                  outlined
                  dense
                  bg-color="white"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model.number="mooring.length"
                  type="number"
                  label="Eslora (L)"
                  suffix="metros"
                  outlined
                  dense
                  bg-color="white"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model.number="mooring.beam"
                  type="number"
                  label="Manga (B)"
                  suffix="metros"
                  outlined
                  dense
                  bg-color="white"
                />
              </div>
            </q-form>
          </q-card-section>
        </template>
      </q-card>
    <template  v-if="mooring">
      <q-table
        :rows="bookings"
        :columns="bookingsColumns"
        row-key="id"
        flat
        bordered
        title="Reservas Vinculadas"
        class="sticky-header-table"
      >
        <template v-slot:top-right>
          <q-btn color="secondary" icon="add" label="Nueva Reserva" dense class="q-px-md"/>
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
    </template>
    </div>
  </q-page>
</template>


<style scoped>
.max-width-container {
  max-width: 1000px;
}

.sticky-header-table {
  background: white;
}

:deep(.q-table tbody tr:hover) {
  background-color: #f5f8ff !important;
}
</style>+
