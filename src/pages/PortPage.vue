<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { PortService } from '../service/PortService.js'
import { getPortImages, uploadPortImage } from '../service/PortImageService.js'

const route = useRoute()
const $q = useQuasar()

const port = ref(null)
const images = ref([])
const uploading = ref(false)
const fileInput = ref(null)

// Campos mock editables
const mockFields = ref({
  vhfChannel: '09',
  maxBoatLength: 25,
  maxBoatBeam: 8,
  maxBoatDraft: 3.5,
  totalBerths: 150,
  fuelStation: true,
  electricity: true,
  water: true,
  wifi: true,
  crane: false,
  travelift: false,
  phone: '+34 971 000 000',
  email: 'info@puerto.es',
  openingHours: '08:00 - 20:00',
  emergencyPhone: '112',
})

const editingMock = ref(false)
const mockSnapshot = ref({})

onMounted(async () => {
  const [portData, imagesData] = await Promise.all([
    PortService.getOne(route.params.id),
    getPortImages(route.params.id).then(r => r.data).catch(() => []),
  ])
  port.value = portData
  images.value = imagesData
})

function startEditMock() {
  mockSnapshot.value = { ...mockFields.value }
  editingMock.value = true
}

function cancelEditMock() {
  mockFields.value = { ...mockSnapshot.value }
  editingMock.value = false
}

function saveEditMock() {
  // Aquí se llamará al endpoint cuando esté disponible
  $q.notify({ type: 'positive', position: 'top-right', message: 'Datos actualizados correctamente.' })
  editingMock.value = false
}

function triggerFileInput() {
  fileInput.value.click()
}

async function handleFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const resp = await uploadPortImage(route.params.id, file)
    images.value.push(resp.data)
    $q.notify({ type: 'positive', position: 'top-right', message: 'Foto subida correctamente.' })
  } catch (error) {
    $q.notify({ type: 'negative', position: 'top-right', message: 'Error al subir la foto.' })
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>

<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">

      <div class="row items-center q-mb-md">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold">Detalle del Puerto</div>
      </div>

      <template v-if="port">

        <q-card flat bordered class="q-mb-lg overflow-hidden">
          <q-card-section class="q-pa-lg">
            <div class="row items-baseline q-gutter-sm q-mb-xs">
              <span class="text-h4 text-weight-bold text-grey-9">{{ port.name }}</span>
              <q-badge outline color="primary" label="Puerto Activo" />
            </div>
            <div class="row q-gutter-md text-subtitle1 text-grey-7">
              <div class="row items-center">
                <q-icon name="location_city" class="q-mr-xs" />
                {{ port.cityName }}
              </div>
              <div class="row items-center">
                <q-icon name="business" class="q-mr-xs" />
                {{ port.companyName }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-overline text-grey-7">Datos Técnicos</div>
              <div v-if="!editingMock">
                <q-btn flat dense icon="edit" label="Editar" @click="startEditMock" />
              </div>
              <div v-else class="q-gutter-sm">
                <q-btn flat dense label="Cancelar" @click="cancelEditMock" />
                <q-btn color="primary" dense unelevated label="Guardar" @click="saveEditMock" />
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Canal VHF</div>
                <q-input v-if="editingMock" v-model="mockFields.vhfChannel" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.vhfChannel }}</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Eslora máx. (m)</div>
                <q-input v-if="editingMock" v-model.number="mockFields.maxBoatLength" type="number" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.maxBoatLength }} m</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Manga máx. (m)</div>
                <q-input v-if="editingMock" v-model.number="mockFields.maxBoatBeam" type="number" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.maxBoatBeam }} m</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Calado máx. (m)</div>
                <q-input v-if="editingMock" v-model.number="mockFields.maxBoatDraft" type="number" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.maxBoatDraft }} m</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Total amarres</div>
                <q-input v-if="editingMock" v-model.number="mockFields.totalBerths" type="number" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.totalBerths }}</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Horario</div>
                <q-input v-if="editingMock" v-model="mockFields.openingHours" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.openingHours }}</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Teléfono</div>
                <q-input v-if="editingMock" v-model="mockFields.phone" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.phone }}</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Email</div>
                <q-input v-if="editingMock" v-model="mockFields.email" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.email }}</div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Teléfono emergencias</div>
                <q-input v-if="editingMock" v-model="mockFields.emergencyPhone" dense outlined />
                <div v-else class="text-subtitle1 text-weight-medium">{{ mockFields.emergencyPhone }}</div>
              </div>
            </div>

            <div class="text-overline text-grey-7 q-mt-lg q-mb-sm">Servicios</div>
            <div class="row q-gutter-md">
              <template v-for="(value, key) in {
                fuelStation: 'Gasolinera',
                electricity: 'Electricidad',
                water: 'Agua',
                wifi: 'WiFi',
                crane: 'Grúa',
                travelift: 'Travel lift',
              }" :key="key">
                <div class="row items-center q-gutter-xs">
                  <q-toggle
                    v-if="editingMock"
                    v-model="mockFields[key]"
                    :label="value"
                    color="primary"
                  />
                  <template v-else>
                    <q-icon
                      :name="mockFields[key] ? 'check_circle' : 'cancel'"
                      :color="mockFields[key] ? 'positive' : 'grey-4'"
                    />
                    <span :class="mockFields[key] ? 'text-grey-9' : 'text-grey-5'">{{ value }}</span>
                  </template>
                </div>
              </template>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="row items-center justify-between q-pa-lg">
            <div class="text-h6 text-weight-bold">Fotos del puerto</div>
            <q-btn
              color="primary"
              icon="photo_camera"
              label="Subir foto"
              unelevated
              dense
              class="q-px-md"
              :loading="uploading"
              @click="triggerFileInput"
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileSelected"
            />
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg">
            <div v-if="images.length === 0" class="text-center text-grey-5 q-py-xl">
              No hay fotos subidas todavía.
            </div>
            <div v-else class="row q-col-gutter-md">
              <div
                v-for="image in images"
                :key="image.id"
                class="col-12 col-sm-6 col-md-4"
              >
                <q-img
                  :src="image.presignedUrl"
                  ratio="16/9"
                  class="rounded-borders"
                  spinner-color="primary"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

      </template>

      <template v-else>
        <q-card flat bordered class="q-pa-lg">
          <q-skeleton type="rect" height="200px" />
        </q-card>
      </template>

    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1000px;
}
.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
