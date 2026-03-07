<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { PortService } from '../../service/PortService.js'
import { getPortImages, getPortImagesPortAdmin, uploadPortImage } from '../../service/PortImageService.js'
import { useAuthStore } from 'stores/auth.js'
import {usePortStore} from "stores/port.js";

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const portStore = usePortStore();
const port = ref(null)
const images = ref([])
const uploading = ref(false)
const fileInput = ref(null)

onMounted(async () => {
  const [portData, imagesData] = await Promise.all([
    authStore.role === 'ADMIN_PORT'
      ? portStore.getPortByPortAdmin()
      : portStore.getPortById(route.params.id),
    authStore.role === 'ADMIN_PORT'
      ? getPortImagesPortAdmin().then(r => r.data).catch(() => [])
      : getPortImages(route.params.id).then(r => r.data).catch(() => [])
  ])
  port.value = portData
  console.log(portData)
  images.value = imagesData
})

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
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: 'Foto subida correctamente.'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: 'Error al subir la foto.'
    })
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
        <q-btn flat round dense icon="arrow_back" @click="router.back()" class="q-mr-sm" />
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
              <div>
                <q-btn
                  flat
                  dense
                  icon="edit"
                  label="Editar"
                  @click="router.push(`/ports/${port.id}/edit`)"
                />
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Canal VHF</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.vhfChannel || '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Eslora máx. (m)</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.maxBoatLength ? port.maxBoatLength + ' m' : '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Manga máx. (m)</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.maxBoatBeam ? port.maxBoatBeam + ' m' : '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Calado máx. (m)</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.maxBoatDraft ? port.maxBoatDraft + ' m' : '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Total amarres</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.moorings || '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Horario</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.openingHours || '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Teléfono</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.phone || '-' }}
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="text-caption text-grey-6 uppercase">Email</div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ port.email || '-' }}
                </div>
              </div>
            </div>

            <div class="text-overline text-grey-7 q-mt-lg q-mb-sm">Servicios</div>
            <div class="row q-gutter-md">
              <template v-for="(label, key) in {
                fuelStation: 'Gasolinera',
                travelLift: 'Travel Lift',
                crane: 'Grúa'
              }" :key="key">
                <div class="row items-center q-gutter-xs">
                  <q-icon
                    :name="port[key] ? 'check_circle' : 'cancel'"
                    :color="port[key] ? 'positive' : 'grey-4'"
                  />
                  <span :class="port[key] ? 'text-grey-9' : 'text-grey-5'">{{ label }}</span>
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
