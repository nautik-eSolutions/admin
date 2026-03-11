<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {PortService} from '../../service/PortService.js'
import {usePortStore} from "stores/port.js";

const $q = useQuasar()
const router = useRouter()
const portStore = usePortStore();
const ports = ref([])
const loading = ref(false)

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'cityName', label: 'Ciudad', field: 'cityName', align: 'left', sortable: true },
  { name: 'companyName', label: 'Empresa', field: 'companyName', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

onMounted(async () => {
  loading.value = true
  ports.value = await portStore.getAllPortByCompanyAdmin()
  loading.value = false
})

function goToPort(id) {
  router.push(`/ports/${id}`)
}

function goToAddPort() {
  router.push('/ports/create')
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
      <q-btn color="primary" icon="add" label="Nuevo puerto" @click="goToAddPort" />
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
          <q-btn flat round dense icon="visibility" color="primary" @click="goToPort(row.id)" class="q-mr-sm" />
          <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(row)" />
        </q-td>
      </template>
    </q-table>

  </q-page>
</template>
