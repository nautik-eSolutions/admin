<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { PortService } from '../service/PortService.js'
import { CityService } from '../service/CityService.js'

const $q = useQuasar()
const router = useRouter()

const ports = ref([])
const cityOptions = ref([])
const loading = ref(false)
const addDialogOpen = ref(false)

const form = reactive({
  name: '',
  cityName: null,
})

const rules = {
  required: val => !!val || 'Este campo es obligatorio.',
  max45: val => (val && val.length <= 45) || 'Máximo 45 caracteres.',
}

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'cityName', label: 'Ciudad', field: 'cityName', align: 'left', sortable: true },
  { name: 'companyName', label: 'Empresa', field: 'companyName', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

onMounted(async () => {
  loading.value = true
  const [portsData, citiesData] = await Promise.all([
    PortService.getAll(),
    CityService.getAll(),
  ])
  ports.value = portsData
  cityOptions.value = citiesData.map(c => ({ label: c.name, value: c.name }))
  loading.value = false
})

function goToPort(id) {
  router.push(`/ports/${id}`)
}

function openAddDialog() {
  form.name = ''
  form.cityName = null
  addDialogOpen.value = true
}

async function handleCreate() {
  try {
    const created = await PortService.add({
      name: form.name,
      cityName: form.cityName,
    })
    ports.value.push(created)
    $q.notify({ type: 'positive', position: 'top-right', message: 'Puerto creado correctamente.' })
    addDialogOpen.value = false
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al crear el puerto.'
    $q.notify({ type: 'negative', position: 'top-right', message })
  }
}

function confirmDelete(port) {
  $q.dialog({
    title: 'Eliminar puerto',
    message: `¿Desea eliminar el puerto "${port.name}"? Esta acción no se puede deshacer.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await PortService.delete(port.id)
      ports.value = ports.value.filter(p => p.id !== port.id)
      $q.notify({ type: 'positive', position: 'top-right', message: 'Puerto eliminado correctamente.' })
    } catch (error) {
      if (error.response?.status === 409) {
        const message = error.response.data?.detail || 'No se puede eliminar: existen registros relacionados.'
        $q.notify({ type: 'negative', position: 'top-right', message, timeout: 5000 })
      } else {
        $q.notify({ type: 'negative', position: 'top-right', message: 'Error inesperado al eliminar el puerto.' })
      }
    }
  })
}
</script>

<template>
  <q-page padding>

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Puertos</div>
      <q-btn color="primary" icon="add" label="Nuevo puerto" @click="openAddDialog" />
    </div>

    <q-table
      :rows="ports"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template #no-data>
        <div class="full-width row flex-center q-py-xl text-grey-6">
          No hay puertos registrados.
        </div>
      </template>

      <template #body-cell-actions="{ row }">
        <q-td class="text-right">
          <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="addDialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Nuevo puerto</div>
        </q-card-section>

        <q-form @submit="handleCreate">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Nombre"
              outlined
              dense
              :rules="[rules.required, rules.max45]"
            />
            <q-select
              v-model="form.cityName"
              :options="cityOptions"
              emit-value
              map-options
              label="Ciudad"
              outlined
              dense
              :rules="[rules.required]"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn color="primary" label="Crear" type="submit" unelevated />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>
