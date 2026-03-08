<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMooringIncidentStore } from 'stores/mooringIncident.js'

const $q = useQuasar()
const router = useRouter()
const incidentStore = useMooringIncidentStore()

const incidents = ref([])
const loading = ref(false)
const showAllIncidents = ref(false)

const columns = [
  {
    name: 'mooringNumber',
    label: 'Amarre',
    field: 'mooringNumber',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Descripción',
    field: 'description',
    align: 'left'
  },
  {
    name: 'startDate',
    label: 'Fecha Inicio',
    field: 'startDate',
    align: 'left',
    sortable: true,
    format: val => formatDate(val)
  },
  {
    name: 'endDate',
    label: 'Fecha Fin',
    field: 'endDate',
    align: 'left',
    sortable: true,
    format: val => val ? formatDate(val) : '-'
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: '',
    field: 'actions',
    align: 'right'
  }
]

onMounted(async () => {
  await loadIncidents()
})

async function loadIncidents() {
  loading.value = true
  try {
    if (showAllIncidents.value) {
      incidents.value = await incidentStore.fetchAllIncidents()
      console.log(incidents)
    } else {
      incidents.value = await incidentStore.fetchCurrentIncidents()
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: 'Error al cargar los incidentes.'
    })
  } finally {
    loading.value = false
  }
}

async function toggleIncidentsView() {
  showAllIncidents.value = !showAllIncidents.value
  await loadIncidents()
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status) {
  const colors = {
    'PENDING': 'orange',
    'IN_PROGRESS': 'blue',
    'RESOLVED': 'green',
    'CANCELLED': 'grey'
  }
  return colors[status] || 'grey'
}

function getStatusLabel(status) {
  const labels = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En Progreso',
    'RESOLVED': 'Resuelto',
    'CANCELLED': 'Cancelado'
  }
  return labels[status] || status
}

function viewIncidentDetail(incident) {
  $q.dialog({
    title: `Incidente - ${incident.mooringCode}`,
    message: `
      <div style="text-align: left;">
        <p><strong>Estado:</strong> ${getStatusLabel(incident.status)}</p>
        <p><strong>Descripción:</strong> ${incident.description || 'Sin descripción'}</p>
        <p><strong>Fecha Inicio:</strong> ${formatDate(incident.startDate)}</p>
        ${incident.endDate ? `<p><strong>Fecha Fin:</strong> ${formatDate(incident.endDate)}</p>` : ''}
      </div>
    `,
    html: true,
    ok: {
      label: 'Cerrar',
      color: 'primary'
    }
  })
}

function refreshIncidents() {
  loadIncidents()
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">

      <div class="row items-center justify-between q-mb-md">
        <div>
          <h5 class="q-my-none text-weight-bold">
            {{ showAllIncidents ? 'Todos los Incidentes' : 'Incidentes Actuales' }}
          </h5>
          <p class="text-grey-7 q-mb-none">
            {{ showAllIncidents ? 'Histórico completo de incidentes' : 'Incidentes activos y pendientes' }}
          </p>
        </div>
        <div class="q-gutter-sm">
          <q-btn
            outline
            :color="showAllIncidents ? 'primary' : 'grey-7'"
            :label="showAllIncidents ? 'Ver Actuales' : 'Ver Todos'"
            @click="toggleIncidentsView"
          />
          <q-btn
            outline
            color="primary"
            icon="refresh"
            label="Actualizar"
            @click="refreshIncidents"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Nuevo Incidente"
            @click="router.push('incidents/create')"
          />
        </div>
      </div>

      <q-card flat bordered>
        <q-table
          :rows="incidents"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #no-data>
            <div class="full-width row flex-center q-py-xl text-grey-6">
              <div class="text-center">
                <q-icon name="info" size="48px" color="grey-4" class="q-mb-md" />
                <div class="text-h6">No hay incidentes registrados</div>
                <div class="text-subtitle2">
                  {{ showAllIncidents ? 'No existen incidentes en el histórico' : 'No hay incidentes activos actualmente' }}
                </div>
              </div>
            </div>
          </template>

          <template #body-cell-description="{ row }">
            <q-td>
              <div class="ellipsis" style="max-width: 300px;">
                {{ row.description || 'Sin descripción' }}
              </div>
            </q-td>
          </template>

          <template #body-cell-status="{ row }">
            <q-td>
              <q-badge
                :color="getStatusColor(row.status)"
                :label="getStatusLabel(row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-actions="{ row }">
            <q-td class="text-right">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="router.push(`incidents/edit/${row.id}`)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                @click="viewIncidentDetail(row)"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>

      <div v-if="incidents.length > 0" class="q-mt-md">
        <q-card flat bordered class="q-pa-md">
          <div class="text-subtitle2 text-grey-7 q-mb-sm">Resumen</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-center">
                <div class="text-h4 text-orange">
                  {{ incidents.filter(i => i.status === 'PENDING').length }}
                </div>
                <div class="text-caption text-grey-6">Pendientes</div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-center">
                <div class="text-h4 text-blue">
                  {{ incidents.filter(i => i.status === 'IN_PROGRESS').length }}
                </div>
                <div class="text-caption text-grey-6">En Progreso</div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-center">
                <div class="text-h4 text-green">
                  {{ incidents.filter(i => i.status === 'RESOLVED').length }}
                </div>
                <div class="text-caption text-grey-6">Resueltos</div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-center">
                <div class="text-h4 text-grey-7">
                  {{ incidents.length }}
                </div>
                <div class="text-caption text-grey-6">Total</div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<style scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
