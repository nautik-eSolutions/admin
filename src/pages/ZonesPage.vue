<script setup xmlns:q-input="http://www.w3.org/1999/html">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { PortService } from "src/service/PortService.js";
import { ZoneService } from "src/service/ZoneService.js";

const $q = useQuasar();
const router = useRouter();

const port = ref();
const ports = ref();
const zones = ref([]);
const loading = ref();

const addDialog = ref(false);
const newZone = ref({
  name:'',
  description:''
})

const rules = {
  max20 : str => (str && str.length < 20) || 'Máximo 20 caracteres',
  max45 : str => (str && str.length < 45) || 'Máximo 45 caracteres'
}
const columns = [
  {name: 'name', required: true, label: 'Nombre de la Zona', align: 'left', field: 'name', sortable: true},
  {name: 'actions', label: 'Acciones', align: 'right', field: 'actions'}
];
onMounted(async () => {
  const rawPorts = await PortService.getAll();
  ports.value = rawPorts.map(p => ({ label: p.name, value: p.id }));

});

async function getZones(selectedPort) {

  if (!selectedPort) {
    zones.value = null;
    return;
  }
  zones.value = await ZoneService.getAllZonesFromAPort(selectedPort.value);
}

function navigateToZone(zone) {
  router.push('/zones/' + zone.id);
}
const openAddDialog = () => {
  newZone.value.name = '';
  newZone.value.description = '';
  addDialog.value = true;
};

async function createZone () {
  if (!newZone.value && !port.value) return;
  $q.loading.show();
  await ZoneService.addZone(newZone.value.name, newZone.value.description,port.value.value)
  $q.loading.hide()
};

function confirmDelete(zone) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Deseas eliminar definitivamente la zona ${zone.name}?`,
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(async () => {
    try {
      await ZoneService.delete(zone.id)
      zones.value = zones.value.filter(z => z.id !== zone.id);
    }catch (error){

    }
    });
}
</script>

<template>
  <q-page padding class="bg-white">
    <div class="main-container">

      <div class="row items-end q-mb-xl q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="text-subtitle2 q-mb-xs text-grey-8 text-weight-bold">Puerto de gestión</div>
          <q-select v-model="port" :options="ports" label="Seleccionar puerto" outlined dense
                    @update:model-value="getZones" bg-color="white"/>
        </div>
        <q-space />
        <div class="col-auto" v-if="port">
          <q-btn color="primary" icon="add" label="Añadir Zona" unelevated @click="openAddDialog"
          />
        </div>
      </div>

      <div v-if="zones">
        <q-table :rows="zones" :columns="columns" row-key="id" :loading="loading" flat bordered binary-state-sort
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <span class="cursor-pointer text-primary text-weight-medium" >
                {{ props.row.name }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn flat dense size="sm" color="grey-8" @click="navigateToZone(props.row)" icon="edit" label="Editar"/>
              <q-btn flat dense size="sm" color="negative" icon="delete" label="Eliminar"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-lg text-grey-6">
              No hay zonas registradas para este puerto.
            </div>
          </template>
        </q-table>
      </div>

      <div v-else-if="!port" class="q-pa-xl text-center text-grey-6 border-dashed">
        Seleccione un puerto para listar y gestionar sus zonas.
      </div>

      <q-dialog v-model="addDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Nueva Zona</div>
          </q-card-section>

          <q-card-section class="q-pt-none column-sm">
            <q-input v-model="newZone.name" label="Nombre de la zona" outlined dense
              autofocus
              @keyup.enter="createZone"
                     :rules="[rules.max20]"
            />
            <q-input v-model="newZone.description" type="textarea" label="Nombre de la zona" outlined
                     class="q-mt-lg" :rules="[rules.max45]"
              dense
              autofocus
              @keyup.enter="createZone"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancelar" v-close-popup color="grey-7" />
            <q-btn label="Guardar" color="primary" unelevated @click="createZone" :disable="!createZone" />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<style scoped>
.main-container {
  max-width: 1000px;
  margin: 0 auto;
}

.border-dashed {
  border: 1px dashed #e0e0e0;
  border-radius: 4px;
}

:deep(.q-table thead th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

:deep(.q-table__card) {
  box-shadow: none;
}
</style>
