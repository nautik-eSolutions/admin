<script setup>
import { useOccupancyStore } from 'stores/occupancy'
import SchedulerD from 'components/SchedulerD.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const occupancyStore = useOccupancyStore()

const startDate = ref(route.params.startDate)
const endDate = ref(route.params.endDate)
const mooringCategoryId = ref(route.params.id)
const validationError = ref(null)

function validateParams() {
  if (!mooringCategoryId.value || isNaN(Number(mooringCategoryId.value))) {
    return 'El ID de la categoría debe ser un número válido'
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(startDate.value)) {
    return 'La fecha de entrada debe tener el formato YYYY-MM-DD'
  }

  if (!dateRegex.test(endDate.value)) {
    return 'La fecha de salida debe tener el formato YYYY-MM-DD'
  }

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  if (isNaN(start.getTime())) {
    return 'La fecha de entrada no es válida'
  }

  if (isNaN(end.getTime())) {
    return 'La fecha de salida no es válida'
  }

  if (end <= start) {
    return 'La fecha de salida debe ser posterior a la fecha de entrada'
  }

  return null
}

function goToSearch() {
  router.push({ name: 'search' })
}

function formatDateToBackend(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${day}-${month}-${year}`
}

async function loadOccupancy() {
  const error = validateParams()

  if (error) {
    validationError.value = error
    $q.notify({
      type: 'negative',
      message: 'Error de validación',
      caption: error
    })
    return
  }

  try {
    const formattedStartDate = formatDateToBackend(startDate.value)
    const formattedEndDate = formatDateToBackend(endDate.value)

    await occupancyStore.getOccupancyByMooringCategoryAndDates(
      Number(mooringCategoryId.value),
      formattedStartDate,
      formattedEndDate
    )
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar la ocupación',
      caption: error.response?.data?.message || error.message
    })
  }
}

onMounted(() => {
  loadOccupancy()
})
</script>
<template>
  <q-page padding>
    <div v-if="validationError" class="row justify-center q-pa-md">
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-h6 text-negative">Error de Validación</div>
          <p>{{ validationError }}</p>
          <q-btn
            label="Volver a buscar"
            color="primary"
            @click="goToSearch"
          />
        </q-card-section>
      </q-card>
    </div>

    <div v-else>
      <template v-if="occupancyStore.bookings && occupancyStore.moorings">
        <SchedulerD
          :bookings="occupancyStore.bookings"
          :moorings="occupancyStore.moorings"
          :start-date="startDate"
          :end-date="endDate"
        />
      </template>

      <div v-else-if="occupancyStore.error" class="row justify-center q-pa-md">
        <q-card class="col-12 col-md-6">
          <q-card-section>
            <div class="text-h6 text-negative">Error</div>
            <p>{{ occupancyStore.error }}</p>
            <q-btn
              label="Volver a buscar"
              color="primary"
              @click="goToSearch"
            />
          </q-card-section>
        </q-card>
      </div>

      <div v-else class="row justify-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
  </q-page>
</template>



<style scoped>
.q-page {
  padding-top: 20px;
}
</style>
