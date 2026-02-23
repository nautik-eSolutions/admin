<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import {
  getDimensionsByPort,
  updateMooringDimension,
  deleteMooringDimension,
  createMooringDimension
} from '../service/MooringDimensionsService'
import {usePortStore} from "stores/port.js";
const portStore = usePortStore()


const PORT_ID = portStore.portId;

const $q = useQuasar()
const portId = PORT_ID

const dimensionsForm = ref(null)
const loading = ref(false)
const saving = ref(false)
const dimensions = ref([])
const isEditing = ref(false)

const dimensionForm = ref({
  id: null,
  name: '',
  maxLength: 0,
  maxBeam: 0,
  maxDraft: 0
})
const rules = {
  required: v => !!v || 'Campo obligatorio',
  positive: v => v > 0 || 'Debe ser mayor a 0',
  maxL: v => v <= 90 || 'Máximo 90m',
  maxB: v => v <= 20 || 'Máximo 20m'
}

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'length', label: 'Eslora (m)', field: 'maxLength', align: 'center' },
  { name: 'beam', label: 'Manga (m)', field: 'maxBeam', align: 'center' },
  { name: 'draft', label: 'Calado (m)', field: 'maxDraft', align: 'center' },
  { name: 'actions', label: '', align: 'right' }
]

onMounted(async()=>{
  await fetchDimensions()
  console.log(dimensions.value)
})


async function fetchDimensions() {
  loading.value = true
  try {
    dimensions.value = await getDimensionsByPort(portId)

  } catch (e) {
    $q.notify({ type: 'negative', message: 'Error al cargar dimensiones' })
  } finally {
    loading.value = false
  }
}

function resetForm () {
  isEditing.value = false
  dimensionForm.value = { id: null, name: '', length: 0, beam: 0, draft: 0 }
  dimensionsForm.value.resetValidation()
}

function setEdit(row){
  isEditing.value = true
  console.log(row)
  dimensionForm.value = { ...row }
}

async function onSubmit (){
  const isFormValid = await dimensionsForm.value.validate()
  if (!isFormValid) return

  saving.value = true
  try {
    if (isEditing.value) {
      await updateMooringDimension(dimensionForm.value)
      $q.notify({ type: 'positive', message: 'Actualizado correctamente' })
    } else {
      const res = await createMooringDimension(portId, dimensionForm.value)
      $q.notify({ type: 'positive', message: 'Creado correctamente' })
    }
    await fetchDimensions()
    resetForm()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Error al guardar datos' })
  } finally {
    saving.value = false
  }
}
function confirmDelete (row){
  $q.dialog({
    title: 'Eliminar Medida',
    message: `¿Borrar "${row.name}"?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', unelevated: true, label: 'Eliminar' }
  }).onOk(async () => {
    try {
      await deleteMooringDimension(row.id)
      dimensions.value = dimensions.value.filter(d => d.id !== row.id)
      $q.notify({ color: 'positive', message: 'Eliminado' })
      if (dimensionForm.value.id === row.id) resetForm()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' })
    }
  })
}

</script>

<template>
  <q-page padding class="bg-grey-2">
    <div class="row q-col-gutter-lg">

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ isEditing ? 'Editar Medida' : 'Nueva Dimensión' }}</div>
          </q-card-section>

          <q-card-section>
            <q-form ref="dimensionsForm" @submit="onSubmit" class="q-gutter-sm">
              <q-input
                v-model="dimensionForm.name"
                label="Nombre *"
                outlined dense
                :rules="[rules.required]"
              />

              <div class="row q-col-gutter-sm">
                <q-input
                  class="col-4" v-model.number="dimensionForm.maxLength"
                  label="Eslora" outlined dense type="number"
                  suffix="m" :rules="[rules.required, rules.positive, rules.maxL]"
                />
                <q-input
                  class="col-4" v-model.number="dimensionForm.maxBeam"
                  label="Manga" outlined dense type="number"
                  suffix="m" :rules="[rules.required, rules.positive, rules.maxB]"
                />
                <q-input
                  class="col-4" v-model.number="dimensionForm.maxDraft"
                  label="Calado" outlined dense type="number"
                  suffix="m" :rules="[rules.required, rules.positive]"
                />
              </div>

              <div class="row justify-end q-mt-md q-gutter-sm">
                <q-btn v-if="isEditing" flat label="Cancelar" color="grey-7" @click="resetForm" />
                <q-btn
                  unelevated
                  :label="isEditing ? 'Actualizar' : 'Guardar'"
                  color="primary"
                  type="submit"
                  :loading="saving"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-table
          :rows="dimensions"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat bordered
          @row-click="(evt, row) => setEdit(row)"
          class="dimensions-table"
        >
          <template v-slot:top-left>
            <div class="text-h6 text-grey-8">Medidas Configuradas</div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-xs">
              <q-btn flat round dense icon="edit" color="primary" @click.stop="setEdit(props.row)" />
              <q-btn flat round dense icon="delete" color="negative" @click.stop="confirmDelete(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>

    </div>
  </q-page>
</template>

<style scoped>
.dimensions-table :deep(.q-tr) {
  cursor: pointer;
  transition: background 0.3s;
}
.dimensions-table :deep(.q-tr:hover) {
  background: #e3f2fd !important;
}
</style>
