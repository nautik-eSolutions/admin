<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminPort } from 'stores/adminPort'
import AdminPortDialog from '../components/AdminPortDialog.vue'

const portStore = useAdminPort()
const dialog = ref(false)
const selectedAdmin = ref(null)
onMounted(() => {
  portStore.fetchAll()
})
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'username', label: 'Username', field: 'username', align: 'left' },
  {
    name: 'port',
    label: 'Puerto',
    field: row => row.portName,
    align: 'left'
  },
  { name: 'actions', label: 'Acciones', align: 'right' }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

function openCreate() {
  selectedAdmin.value = null
  dialog.value = true
}

function openEdit(admin) {
  selectedAdmin.value = admin
  dialog.value = true
}

async function saveAdmin(data) {
  if (selectedAdmin.value) {
    await portStore.updateAdmin(data.portId, selectedAdmin.value.id, data)
  } else {
    await portStore.createAdmin(data.portId, data)
  }
}

async function deleteAdmin(admin) {
  await portStore.deleteAdmin(admin.portId, admin.id)
}

async function changePort(admin, newPortId) {
  console.log(admin, newPortId)
  await portStore.updateAdmin(newPortId, admin.id, {
    username: admin.username,
    portId: newPortId
  })
}

const portOptions = computed(() =>
  portStore.ports.map(p => ({ label: p.name, value: p.id }))
)
</script>

<template>
  <div class="q-pa-xl">

    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5">Gestión Administradores de Puerto</div>
      <q-btn color="primary" label="Crear Admin Puerto" @click="openCreate" />
    </div>

    <q-table
      :rows="portStore.admins"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="portStore.loading"
      flat
      bordered
    >
      <template #body-cell-port="props">
        <q-td>
          <q-select
            dense
            outlined
            :options="portOptions"
            :model-value="props.row.portName"
            @update:model-value="val => changePort(props.row, val.value)"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td align="right">
          <q-btn
            flat
            dense
            icon="edit"
            @click="openEdit(props.row)"
          />
          <q-btn
            flat
            dense
            icon="delete"
            color="negative"
            @click="deleteAdmin(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <AdminPortDialog
      v-model="dialog"
      :ports="portStore.ports"
      :admin="selectedAdmin"
      @save="saveAdmin"
    />
  </div>
</template>
