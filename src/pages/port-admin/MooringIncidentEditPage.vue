<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMooringIncidentStore } from 'stores/mooringIncident.js'
import { getMoorings } from '../../service/MooringService.js'
import { useAuthStore } from 'stores/auth.js'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const incidentStore = useMooringIncidentStore()

const moorings = ref([])
const mooringOptions = ref([])
const loading = ref(false)
const loadingMoorings = ref(false)
const loadingIncident = ref(false)

const form = ref({
  mooringId: null,
  description: '',
  startDate: null,
  endDate: null,
  status: 'PENDING'
})

const statusOptions = [
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'En Progreso', value: 'IN_PROGRESS' },
  { label: 'Resuelto', value: 'RESOLVED' },
  { label: 'Cancelado', value: 'CANCELLED' }
]

const rules = {
  required: val => !!val || 'Este campo es obligatorio.',
  max1000: val => !val || val.length <= 1000 || 'Máximo 1000 caracteres.',
  dateRange: () => {
    if (!form.value.startDate || !form.value.endDate) return true
    return new Date(form.value.startDate) <= new Date(form.value.endDate) || 'La fecha de inicio debe ser anterior a la fecha de fin'
  }
}

const incidentId = computed(() => route.params.id)

onMounted(async () => {
  await Promise.all([loadMoorings(), loadIncident()])
})

async function loadMoorings() {
  loadingMoorings.value = true
  try {
    const portId = authStore.portId
    const response = await getMoorings(portId)
    moorings.value = response.data || []

    // Mapeo simplificado: solo mostramos el número
    mooringOptions.value = moorings.value.map(m => ({
      label: m.number,
      value: m.id,
      number: m.number
    }))
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: 'Error al cargar los amarres.'
    })
  } finally {
    loadingMoorings.value = false
  }
}

async function loadIncident() {
  loadingIncident.value = true
  try {
    await incidentStore.fetchAllIncidents()
    const incident = incidentStore.incidents.find(i => i.id === parseInt(incidentId.value))

    if (!incident) {
      $q.notify({
        type: 'negative',
        position: 'top-right',
        message: 'Incidente no encontrado.'
      })
      router.push('moorings/incidents')
      return
    }

    form.value = {
      mooringId: incident.mooringId,
      description: incident.description || '',
      startDate: incident.startDate ? formatDateForInput(incident.startDate) : null,
      endDate: incident.endDate ? formatDateForInput(incident.endDate) : null,
      status: incident.status
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: 'Error al cargar el incidente.'
    })
    router.push('/moorings/incidents')
  } finally {
    loadingIncident.value = false
  }
}

function formatDateForInput(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function onSubmit() {
  loading.value = true
  try {
    const payload = {
      description: form.value.description,
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      status: form.value.status
    }

    await incidentStore.updateIncident(parseInt(incidentId.value), payload)

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: 'Incidente actualizado correctamente.'
    })

    router.push('/moorings/incidents')
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al actualizar el incidente.'
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message
    })
  } finally {
    loading.value = false
  }
}

function onReset() {
  loadIncident()
}

function goBack() {
  router.back()
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="goBack"
          class="q-mr-md"
        />
        <div class="col">
          <h4 class="q-my-none text-weight-bold">Editar Incidente</h4>
          <p class="text-grey-7 q-mb-none">Modifique la información del incidente</p>
        </div>
      </div>

      <q-card flat bordered>
        <q-card-section>
          <q-inner-loading :showing="loadingIncident">
            <q-spinner-hourglass size="50px" color="primary" />
          </q-inner-loading>

          <q-form v-if="!loadingIncident" @submit="onSubmit" @reset="onReset" class="q-gutter-md">

            <div class="text-h6 text-primary q-mb-md">Información del Incidente</div>

            <div class="row q-col-gutter-md">

              <div class="col-12">
                <q-select
                  v-model="form.mooringId"
                  :options="mooringOptions"
                  emit-value
                  map-options
                  label="Amarre *"
                  outlined
                  disable
                  :loading="loadingMoorings"
                  :rules="[rules.required]"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <strong>{{ scope.opt.number }}</strong>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template v-slot:selected-item="scope">
                    <div class="row items-center full-width">
                      <strong>{{ scope.opt.number }}</strong>
                    </div>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.startDate"
                  label="Fecha de Inicio *"
                  outlined
                  :rules="[rules.required, rules.dateRange]"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.startDate" mask="YYYY-MM-DD HH:mm:ss">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="form.startDate" mask="YYYY-MM-DD HH:mm:ss" format24h with-seconds>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.endDate"
                  label="Fecha de Fin"
                  outlined
                  :rules="[rules.dateRange]"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="form.endDate" mask="YYYY-MM-DD HH:mm:ss">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="form.endDate" mask="YYYY-MM-DD HH:mm:ss" format24h with-seconds>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-select
                  v-model="form.status"
                  :options="statusOptions"
                  emit-value
                  map-options
                  label="Estado *"
                  outlined
                  :rules="[rules.required]"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.description"
                  label="Descripción *"
                  outlined
                  type="textarea"
                  rows="4"
                  :rules="[rules.required, rules.max1000]"
                  hint="Describa el problema encontrado"
                  counter
                  maxlength="1000"
                />
              </div>

            </div>

            <q-separator class="q-my-lg" />

            <div class="row q-col-gutter-sm justify-end">
              <div class="col-12 col-sm-auto">
                <q-btn
                  label="Cancelar"
                  outline
                  color="grey-7"
                  @click="goBack"
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  label="Restaurar"
                  type="reset"
                  outline
                  color="orange"
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  label="Actualizar Incidente"
                  type="submit"
                  color="primary"
                  :loading="loading"
                  class="full-width"
                >
                  <template v-slot:loading>
                    <q-spinner-hourglass />
                  </template>
                </q-btn>
              </div>
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
</style>
