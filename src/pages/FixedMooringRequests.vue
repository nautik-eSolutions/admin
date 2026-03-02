<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFixedMooringRequestStore } from '../stores/fixedMooring.js';

const router = useRouter();
const requestStore = useFixedMooringRequestStore();

const loading = ref(false);
const requests = ref([]);

const columns = [
  { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
  { name: 'user', label: 'Solicitante', align: 'left', field: row => `${row.userFirstName} ${row.userLastName}`, sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'userEmail', sortable: true },
  { name: 'mooring', label: 'Amarre Solicitado', align: 'center', field: 'mooringNumber', sortable: true },
  { name: 'date', label: 'Fecha Solicitud', align: 'center', field: 'createdAt', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'right' }
];

const loadRequests = async () => {
  loading.value = true;
  try {
    requests.value = await requestStore.getPendingRequests();
  } finally {
    loading.value = false;
  }
};

const viewRequest = (requestId) => {
  router.push({ name: 'FixedMooringRequestDetail', params: { id: requestId } });
};

onMounted(() => {
  loadRequests();
});
</script>

<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">

      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-weight-bold text-grey-9">Solicitudes de Amarres Fijos</div>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">
            Gestiona las solicitudes pendientes de amarres fijos
          </div>
        </div>

        <q-btn
          icon="refresh"
          color="primary"
          flat
          round
          @click="loadRequests"
          :loading="loading"
        >
          <q-tooltip>Recargar</q-tooltip>
        </q-btn>
      </div>

      <!-- Tabla de solicitudes -->
      <q-card flat bordered class="shadow-1">
        <q-card-section class="q-pa-none">
          <q-table
            :rows="requests"
            :columns="columns"
            row-key="id"
            flat
            :loading="loading"
            :rows-per-page-options="[10, 25, 50]"
            separator="horizontal"
          >
            <template v-slot:body-cell-user="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.userFirstName }} {{ props.row.userLastName }}</div>
                <div class="text-caption text-grey-7" v-if="props.row.userIdentificationDocument">
                  DNI: {{ props.row.userIdentificationDocument }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-mooring="props">
              <q-td :props="props">
                <q-badge
                  v-if="props.row.mooringNumber"
                  color="primary"
                  outline
                  class="q-px-sm q-py-xs"
                >
                  {{ props.row.mooringNumber }}
                </q-badge>
                <span v-else class="text-grey-6">Sin especificar</span>
              </q-td>
            </template>

            <template v-slot:body-cell-date="props">
              <q-td :props="props">
                {{ props.row.createdAt }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  color="primary"
                  icon="visibility"
                  @click="viewRequest(props.row.id)"
                >
                  <q-tooltip>Ver detalles</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-xl text-grey-5">
                <q-icon size="4em" name="inbox" class="q-mb-sm" />
                <div class="text-subtitle1 full-width text-center">
                  No hay solicitudes pendientes
                </div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1400px;
}
</style>
