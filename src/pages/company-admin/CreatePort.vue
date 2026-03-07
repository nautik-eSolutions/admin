<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { usePortStore } from 'stores/port.js'
import { CityService } from '../../service/CityService.js'

const $q = useQuasar()
const router = useRouter()
const portStore = usePortStore()

const cityOptions = ref([])
const loading = ref(false)
const mapCenter = ref({ lat: 39.5, lng: -3.5 })
const selectedPosition = ref(null)
const map = ref(null)
const marker = ref(null)

const spainBounds = {
  minLat: 27.5,
  maxLat: 43.8,
  minLng: -18.5,
  maxLng: 4.5
}

const form = ref({
  name: '',
  vhfChannel: null,
  cityName: null,
  fuelStation: false,
  travelLift: false,
  crane: false,
  lon: null,
  lat: null,
  phone: '',
  email: '',
  openingHours: ''
})

const rules = {
  required: val => !!val || 'Este campo es obligatorio.',
  max45: val => !val || val.length <= 45 || 'Máximo 45 caracteres.',
  max100: val => !val || val.length <= 100 || 'Máximo 100 caracteres.',
  max255: val => !val || val.length <= 255 || 'Máximo 255 caracteres.',
  email: val => !val || /.+@.+\..+/.test(val) || 'Email inválido.',
  number: val => !val || !isNaN(val) || 'Debe ser un número válido.'
}

onMounted(async () => {
  loading.value = true
  try {
    const citiesData = await CityService.getAll()
    cityOptions.value = citiesData.map(c => ({ label: c.name, value: c.name }))
    await initMap()
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: 'Error al cargar los datos iniciales.'
    })
  } finally {
    loading.value = false
  }
})

async function initMap() {
  if (!window.L) {
    await loadLeaflet()
  }
  const L = window.L
  map.value = L.map('map').setView([mapCenter.value.lat, mapCenter.value.lng], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value)
  const bounds = L.latLngBounds(
    L.latLng(spainBounds.minLat, spainBounds.minLng),
    L.latLng(spainBounds.maxLat, spainBounds.maxLng)
  )

  map.value.setMaxBounds(bounds)
  map.value.on('click', (e) => {
    const { lat, lng } = e.latlng
    if (lat < spainBounds.minLat || lat > spainBounds.maxLat ||
      lng < spainBounds.minLng || lng > spainBounds.maxLng) {
      $q.notify({
        type: 'warning',
        position: 'top-right',
        message: 'La ubicación debe estar dentro de España.',
        timeout: 3000
      })
      return
    }
    if (marker.value) {
      map.value.removeLayer(marker.value)
    }
    marker.value = L.marker([lat, lng]).addTo(map.value)
    selectedPosition.value = { lat, lng }
    form.value.lat = lat
    form.value.lon = lng

    $q.notify({
      type: 'info',
      position: 'top-right',
      message: `Ubicación seleccionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      timeout: 2000
    })
  })
}

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

async function onSubmit() {
  if (!selectedPosition.value) {
    $q.notify({
      type: 'warning',
      position: 'top-right',
      message: 'Por favor, seleccione una ubicación en el mapa.'
    })
    return
  }
  loading.value = true
  try {
    const payload = {
      name: form.value.name,
      vhfChannel: form.value.vhfChannel || null,
      cityName: form.value.cityName,
      fuelStation: form.value.fuelStation,
      travelLift: form.value.travelLift,
      crane: form.value.crane,
      lon: form.value.lon,
      lat: form.value.lat,
      phoneNumber: form.value.phone || null,
      email: form.value.email || null,
      openingHours: form.value.openingHours || null
    }
    console.log(payload)
    const port  = await portStore.createPort(payload)

    await router.push('/ports/'+ port.id)
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function onReset() {
  form.name = ''
  form.vhfChannel = null
  form.cityName = null
  form.fuelStation = false
  form.travelLift = false
  form.crane = false
  form.lon = null
  form.lat = null
  form.phone = ''
  form.email = ''
  form.openingHours = ''
  selectedPosition.value = null

  if (marker.value && map.value) {
    map.value.removeLayer(marker.value)
    marker.value = null
  }
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
          <h4 class="q-my-none text-weight-bold">Añadir Nuevo Puerto</h4>
          <p class="text-grey-7 q-mb-none">Complete la información del puerto</p>
        </div>
      </div>
      <q-card flat bordered>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="text-h6 text-primary q-mb-md">Información Básica</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.name"
                  label="Nombre del Puerto *"
                  outlined
                  :rules="[rules.required, rules.max45]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.cityName"
                  :options="cityOptions"
                  emit-value
                  map-options
                  label="Ciudad *"
                  outlined
                  :rules="[rules.required]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model.number="form.vhfChannel"
                  type="number"
                  label="Canal VHF"
                  outlined
                  :rules="[rules.number]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.phone"
                  label="Teléfono"
                  outlined
                  :rules="[rules.max45]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  label="Email"
                  outlined
                  type="email"
                  :rules="[rules.email, rules.max100]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.openingHours"
                  label="Horario de Apertura"
                  outlined
                  :rules="[rules.max255]"
                />
              </div>
            </div>
            <q-separator class="q-my-lg" />
            <div class="text-h6 text-primary q-mb-md">Servicios Disponibles</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-checkbox
                  v-model="form.fuelStation"
                  label="Estación de Combustible"
                  color="primary"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-checkbox
                  v-model="form.travelLift"
                  label="Travel Lift"
                  color="primary"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-checkbox
                  v-model="form.crane"
                  label="Grúa"
                  color="primary"
                />
              </div>
            </div>
            <q-separator class="q-my-lg" />
            <div class="text-h6 text-primary q-mb-md">Ubicación del Puerto *</div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-subtitle2 text-grey-7 q-mb-sm">
                  Haga clic en el mapa para seleccionar la ubicación exacta del puerto
                </div>
                <div
                  id="map"
                  style="height: 400px; width: 100%; border-radius: 8px; border: 1px solid #e0e0e0;"
                ></div>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="form.lat?.toFixed(6) || ''"
                  label="Latitud"
                  outlined
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="form.lon?.toFixed(6) || ''"
                  label="Longitud"
                  outlined
                  readonly
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
                  label="Limpiar"
                  type="reset"
                  outline
                  color="orange"
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  label="Crear Puerto"
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
#map {
  z-index: 0;
}
.leaflet-container {
  font-family: 'Roboto', sans-serif;
}
</style>
