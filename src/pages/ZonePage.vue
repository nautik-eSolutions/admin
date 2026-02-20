<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { ZoneService } from 'src/service/ZoneService.js';
import { useMooring } from 'stores/mooring.js';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const mooringStore = useMooring();

const zoneId = route.params.id;
const zone = ref(null);
const moorings = ref([]);
const loading = ref(true);

const pagination = ref({
  rowsPerPage: 10
});

const columns = [
  {
    name: 'numero',
    required: true,
    label: 'Nº Amarre',
    align: 'left',
    field: row => row.number,
    sortable: true
  },
  {
    name: 'dimensiones',
    align: 'center',
    label: 'Dimensiones (L x B)',
    field: row => `${row.length}m x ${row.beam}m`,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
    field: 'actions'
  }
];

onMounted(async () => {
    zone.value = await ZoneService.getZoneById(zoneId);
    moorings.value = await mooringStore.getMooringByZoneId(zoneId);

});



const editMooring = (mooring) => {
  router.push(`/moorings/${mooring.id}`);
};

const deleteMooring = (mooring) => {
  $q.dialog({
    title: 'Eliminar Amarre',
    message: `¿Estás seguro de que deseas eliminar el amarre
<strong>${mooring.number}</strong>?<br>Esta acción no se puede deshacer.`,
    html: true,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8'
    },
    ok: {
      label: 'Eliminar',
      unelevated: true,
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    $q.loading.show({ message: 'Eliminando amarre...' });
    try {
      moorings.value = moorings.value.filter(m => m.id !== mooring.id);
//Uep elimnar ammree aqui
      $q.notify({
        color: 'positive',
        message: 'Amarre eliminado correctamente',
        icon: 'check_circle',
        position: 'bottom-right'
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'No se pudo eliminar el amarre',
        icon: 'report_problem',
        position: 'bottom-right'
      });
    } finally {
      $q.loading.hide();
    }
  });
};
</script>

<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">

      <q-card flat bordered class="q-mb-lg bg-white rounded-borders">
        <q-card-section class="row items-center q-pa-lg q-col-gutter-md">
          <div class="col">
            <template v-if="loading && !zone">
              <q-skeleton type="text" width="40%" class="text-h4" />
              <q-skeleton type="text" width="60%" class="text-subtitle1 q-mt-sm" />
            </template>
            <template v-else-if="zone">
              <div class="text-overline text-grey-6 text-uppercase q-mb-xs tracking-wide">
                Gestión de Zona
              </div>
              <div class="text-h4 text-weight-bold text-grey-9 q-mb-xs">
                {{ zone.name }}
              </div>
              <div class="text-subtitle1 text-grey-7">
                {{ zone.description }}
              </div>
            </template>
          </div>

          <div class="col-auto row q-gutter-sm">
            <q-btn
              color="primary"
              icon="add"
              label="Añadir Amarre"
              unelevated
              class="q-px-md"
              @click="goToAddMooring"
              :disable="loading"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-table
        title="Inventario de Amarres"
        :rows="moorings || []"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="loading"
        :pagination="pagination"
        class="custom-table shadow-1"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              @click="editMooring(props.row)"
            >
              <q-tooltip class="bg-primary">Editar Amarre</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="deleteMooring(props.row)"
            >
              <q-tooltip class="bg-negative">Eliminar Amarre</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-xl text-grey-6">
            <div class="column items-center">
              <q-icon size="4em" name="sailing" class="q-mb-md text-grey-4" />
              <div class="text-h6 text-weight-medium">No hay amarres configurados</div>
              <div class="text-body2 q-mt-sm">Utiliza el botón "Añadir Amarre" para comenzar.</div>
            </div>
          </div>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>

    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1100px;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.rounded-borders {
  border-radius: 8px;
}

.custom-table {
  border-radius: 8px;
  background: white;
}

:deep(.q-table tbody tr:hover) {
  background-color: #f8faff !important;
}

:deep(.q-table__title) {
  font-weight: 600;
  color: #424242;
}
</style>
