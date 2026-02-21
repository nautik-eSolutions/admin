<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import {ZoneService} from "src/service/ZoneService.js";
const MASTER_SERVICES_CATALOG = [
  { id: 101, name: 'Suministro Eléctrico (32A)', price: 0.45, unit: 'kWh', category: 'Suministros', description: 'Conexión monofásica estándar' },
  { id: 102, name: 'Suministro Eléctrico (64A)', price: 0.85, unit: 'kWh', category: 'Suministros', description: 'Conexión trifásica para grandes esloras' },
  { id: 103, name: 'Agua Potable', price: 3.50, unit: 'm³', category: 'Suministros', description: 'Agua tratada con presión constante' },
  { id: 104, name: 'WiFi Premium', price: 15.00, unit: 'Mes', category: 'Conectividad', description: 'Banda ancha simétrica' },
  { id: 105, name: 'Recogida de Residuos', price: 0.00, unit: 'Fijo', category: 'Limpieza', description: 'Gestión de residuos urbanos' },
  { id: 106, name: 'Vigilancia 24h', price: 50.00, unit: 'Mes', category: 'Seguridad', description: 'Cámaras y personal de seguridad' }
];
const $q = useQuasar();
const route = useRoute();
const zoneId = route.params.id;
const zone = ref({
  name: 'Muelle de Ribera - Zona A',
  description: 'Zona destinada a embarcaciones de recreo de hasta 15 metros.'
});
const assignedServices = ref([]);
const loading = ref(true);
const serviceDialog = ref(false);
const savingZone = ref(false);
const selectedServiceToAdd = ref(null);
const columns = [
  { name: 'name', label: 'Servicio', align: 'left', field: 'name', sortable: true },
  { name: 'category', label: 'Categoría', align: 'left', field: 'category', sortable: true },
  { name: 'price', label: 'Tarifa', align: 'center', field: row => `${row.price}€ / ${row.unit}` },
  { name: 'actions', label: 'Acciones', align: 'right' }
];
onMounted(async () => {
  zone.value = await ZoneService.getZoneById(zoneId);
  setTimeout(() => {
    // Simulamos que la zona ya tiene los dos primeros servicios asignados
    assignedServices.value = [MASTER_SERVICES_CATALOG[0], MASTER_SERVICES_CATALOG[2]];
    loading.value = false;
  }, 800);
});
const updateZone = async () => {
  savingZone.value = true;
  await ZoneService.updateZone(zone.value.name, zone.value.description, zone.value.id);

  //Pasar esto al store
  setTimeout(() => {
    savingZone.value = false;
    $q.notify({
      color: 'positive',
      message: 'Información de zona actualizada',
      icon: 'done',
      position: 'bottom-right'
    });
  }, 500);
};




const openServiceDialog = () => {
  selectedServiceToAdd.value = null;
  serviceDialog.value = true;
};




const addServiceToZone = () => {
  if (!selectedServiceToAdd.value) return;
  const exists = assignedServices.value.some(s => s.id === selectedServiceToAdd.value.id);
  if (exists) {
    $q.notify({ color: 'warning', message: 'Este servicio ya está asignado a la zona' });
  } else {
    assignedServices.value.push(selectedServiceToAdd.value);
    $q.notify({ color: 'positive', message: 'Servicio vinculado correctamente' });
  }
  serviceDialog.value = false;
};




const removeService = (service) => {
  $q.dialog({
    title: 'Desvincular Servicio',
    message: `¿Deseas quitar el servicio <strong>${service.name}</strong> de esta zona?`,
    html: true,
    cancel: true,
    persistent: true
  }).onOk(() => {
    assignedServices.value = assignedServices.value.filter(s => s.id !== service.id);
    $q.notify({ color: 'info', message: 'Servicio desvinculado' });
  });
};
const rules = {
  max45: str  => (str && str.length <= 45) || 'Máximo 45 caracteres'
};

</script>

<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">

      <q-card flat bordered class="q-mb-lg bg-white rounded-borders">
        <q-card-section v-if="zone" class="q-pa-lg">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-overline text-primary text-weight-bold">Panel de Control de Zona</div>
              <div class="text-h5 text-weight-bold text-grey-9">Configuración General</div>
            </div>
            <q-btn label="Actualizar Zona" color="primary" unelevated icon="sync" :loading="savingZone"
              @click="updateZone"
            />
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input v-model="zone.name" label="Nombre Identificativo" outlined dense bg-color="white"
                hint="Ej: Muelle Norte, Pantalán 3..."
                :rules="[rules.max45]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="zone.description"
                label="Descripción y Observaciones"
                outlined
                dense
                bg-color="white"
                type="textarea"
                rows="2"
                :rules="[rules.max45]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        :rows="assignedServices"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="loading"
        class="custom-table shadow-1"
      >
        <template v-slot:top-left>
          <div class="text-h6 text-grey-8">Servicios Activos en Zona</div>
        </template>

        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon="link"
            label="Vincular Servicio Existente"
            unelevated
            @click="openServiceDialog"
          />
        </template>

        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-badge outline color="secondary" class="q-pa-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="link_off"
              @click="removeService(props.row)"
            >
              <q-tooltip>Desvincular de zona</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-xl text-grey-5">
            <q-icon size="4em" name="layers_clear" class="q-mb-sm" />
            <div class="text-subtitle1 full-width text-center">No hay servicios vinculados a esta zona</div>
          </div>
        </template>
      </q-table>

      <q-dialog v-model="serviceDialog" position="top">
        <q-card style="width: 500px; margin-top: 50px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Añadir Servicio a Zona</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md">
            <p class="text-grey-7 q-mb-md">Selecciona un servicio del catálogo maestro para habilitarlo en esta zona.</p>

            <q-select
              v-model="selectedServiceToAdd"
              :options="MASTER_SERVICES_CATALOG"
              option-label="name"
              label="Buscar servicio..."
              outlined
              use-input
              fill-input
              hide-selected
              input-debounce="0"
              bg-color="white"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="grey-3" text-color="grey-9">
                      {{ scope.opt.price }}€/{{ scope.opt.unit }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
            <q-btn
              label="Vincular Servicio"
              color="primary"
              unelevated
              :disable="!selectedServiceToAdd"
              @click="addServiceToZone"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1100px;
}

.rounded-borders {
  border-radius: 12px;
}

.custom-table {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.q-table__card) {
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
}

:deep(.q-table thead tr) {
  background-color: #fcfcfc;
}
</style>
