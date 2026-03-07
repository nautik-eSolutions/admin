<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMooringCategoryStore } from 'stores/mooringCategory.js'
import { useMooring } from 'stores/mooring.js'
import { usePriceConfigurationStore } from 'stores/priceConfiguration.js'
import {usePortStore} from "stores/port.js";

const PORT_ID = usePortStore().portId

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const mooringCategoryStore = useMooringCategoryStore()
const mooringStore = useMooring()
const priceConfigStore = usePriceConfigurationStore()
const editDialogOpen = ref(false)
const editForm = reactive({ number: '' })
const editingId = ref(null)
const addDialogOpen = ref(false)
const addForm = reactive({ number: '' })

const assignDialogOpen = ref(false)
const selectedPriceConfig = ref(null)
const loadingAssign = ref(false)

const numberRules = [
  (val) => !!val || 'El identificador es obligatorio.',
  (val) => val.length <= 25 || 'Máximo 25 caracteres.',
]

onMounted(async () => {
  await mooringCategoryStore.getMooringCategory(route.params.id)
  await mooringStore.getMooringsByCategory(route.params.id)
  await priceConfigStore.getAllPriceConfigurations()


  console.log(mooringCategoryStore.category)
})

const mooringsColumns = [
  { name: 'number', label: 'Número', field: 'number', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const priceConfigColumns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'startDate', label: 'Fecha inicio', field: 'startDate', align: 'left' },
  { name: 'endDate', label: 'Fecha fin', field: 'endDate', align: 'left' },
  { name: 'minPricePerDay', label: 'Precio mínimo/día', field: 'minPricePerDay', align: 'right', format: (val) => val ? `${val.toFixed(2)} €` : '—' },
  { name: 'actions', label: 'Acciones', align: 'right' },
]

const assignedPriceConfigs = computed(() => {
  return mooringCategoryStore.category?.priceConfigurations || []
})

const availablePriceConfigs = computed(() => {
  const assignedIds = assignedPriceConfigs.value.map(p => p.id)
  return priceConfigStore.priceConfigurations.filter(p => !assignedIds.includes(p.id))
})

function goToMooring(id) {
  router.push(`/moorings/${id}`)
}
function openAddDialog() {
  addForm.number = ''
  addDialogOpen.value = true
}
async function handleCreate() {
  await mooringStore.createMooring(route.params.id, { number: addForm.number })
  addDialogOpen.value = false
}
function openEditDialog(mooring) {
  editingId.value = mooring.id
  editForm.number = mooring.number
  editDialogOpen.value = true
}
async function handleUpdate() {
  await mooringStore.updateMooring(editingId.value, { number: editForm.number })
  editDialogOpen.value = false
}
function confirmDelete(mooring) {
  $q.dialog({
    title: 'Eliminar amarre',
    message: `¿Desea eliminar el amarre "${mooring.number}"? Esta acción no se puede deshacer.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await mooringStore.deleteMooring(mooring.id)
  })
}

function openAssignDialog() {
  selectedPriceConfig.value = null
  assignDialogOpen.value = true
}

async function assignPriceConfig() {
  if (!selectedPriceConfig.value) return
  console.log(selectedPriceConfig,"dd",priceConfigStore.priceConfigurations)
  loadingAssign.value = true
  console.log("resp")
  await mooringCategoryStore.assignPriceConfiguration(
      route.params.id,
      selectedPriceConfig.value.id
  )
  await mooringCategoryStore.getMooringCategory(PORT_ID, route.params.id)
    assignDialogOpen.value = false
    $q.notify({
      type: 'positive',
      message: 'Configuración asignada correctamente',
      position: 'bottom-right',
    })
}

async function unassignPriceConfig(priceConfig) {
  $q.dialog({
    title: 'Desvincular configuración',
    message: `¿Desea quitar la configuración <strong>${priceConfig.name}</strong> de esta categoría?`,
    html: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await mooringCategoryStore.unassignPriceConfiguration(
        route.params.id,
        priceConfig.id
      )
      await mooringCategoryStore.getMooringCategory(route.params.id)
      $q.notify({
        type: 'positive',
        message: 'Configuración desvinculada',
        position: 'bottom-right',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error?.response?.data?.message || 'Error al desvincular',
        position: 'bottom-right',
      })
    }
  })
}
</script>

<template>
  <q-page padding class="bg-grey-1">
    <div class="max-width-container q-mx-auto">
      <div class="row items-center q-mb-md">
        <q-btn flat round dense icon="arrow_back" @click="router.back()" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold">Detalle de Categoría</div>
      </div>
      <q-card flat bordered class="q-mb-lg overflow-hidden">
        <q-card-section class="row items-center q-col-gutter-md q-pa-lg">
          <div class="col">
            <template v-if="mooringCategoryStore.category">
              <div class="row items-baseline q-gutter-sm">
                <span class="text-h4 text-weight-bold text-grey-9">
                  {{ mooringCategoryStore.category.name }}
                </span>
              </div>
              <div class="row q-gutter-md q-mt-xs text-subtitle1 text-grey-7">
                <div class="row items-center">
                  <q-icon name="euro" class="q-mr-xs" />
                  Precio base/día:
                  <span class="text-weight-bold text-grey-10 q-ml-xs">
                    {{ mooringCategoryStore.category.minPricePerDay?.toFixed(2) }} €
                  </span>
                </div>
              </div>
            </template>
            <q-skeleton v-else type="rect" width="300px" height="40px" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg" v-if="mooringCategoryStore.category">
          <div class="text-overline text-grey-7 q-mb-md">Detalles de la Categoría</div>
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-6 uppercase">Zona</div>
              <div class="text-subtitle1 text-weight-medium">
                {{ mooringCategoryStore.category.zoneName ?? '—' }}
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-6 uppercase">Dimensiones</div>
              <div class="text-subtitle1 text-weight-medium">
                {{ mooringCategoryStore.category.dimensionsMaxLength + ' m x ' + mooringCategoryStore.category.dimensionsMaxBeam + ' m x ' + mooringCategoryStore.category.dimensionsMaxDraft + ' m' ?? '—' }}
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-grey-6 uppercase">Precio base / día</div>
              <div class="text-subtitle1 text-weight-medium">
                {{ mooringCategoryStore.category.minPricePerDay?.toFixed(2) }} €
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        v-if="mooringCategoryStore.category"
        :rows="mooringStore.moorings"
        :columns="mooringsColumns"
        row-key="id"
        flat
        bordered
        title="Amarres de esta categoría"
        class="sticky-header-table shadow-1 q-mb-lg"
      >
        <template #no-data>
          <div class="full-width row flex-center q-py-xl text-grey-6">
            No hay amarres registrados en esta categoría.
          </div>
        </template>

        <template #top-right>
          <q-btn color="primary" icon="add" label="Nuevo amarre" dense unelevated class="q-px-md" @click="openAddDialog" />
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-right">
            <q-btn flat round dense icon="visibility" @click="goToMooring(row.id)" />
            <q-btn flat round dense icon="edit" @click="openEditDialog(row)" />
            <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(row)" />
          </q-td>
        </template>
      </q-table>

      <q-table
        v-if="mooringCategoryStore.category"
        :rows="assignedPriceConfigs"
        :columns="priceConfigColumns"
        row-key="id"
        flat
        bordered
        title="Configuraciones de precio asignadas"
        class="sticky-header-table shadow-1"
      >
        <template #no-data>
          <div class="full-width row flex-center q-py-xl text-grey-6">
            No hay configuraciones de precio asignadas a esta categoría.
          </div>
        </template>

        <template #top-right>
          <q-btn
            color="primary"
            icon="link"
            label="Vincular configuración"
            dense
            unelevated
            class="q-px-md"
            :disable="availablePriceConfigs.length === 0"
            @click="openAssignDialog"
          >
            <q-tooltip v-if="availablePriceConfigs.length === 0">
              No hay configuraciones disponibles para vincular
            </q-tooltip>
          </q-btn>
        </template>

        <template #body-cell-startDate="{ row }">
          <q-td>
            {{ row.startDate ? new Date(row.startDate).toLocaleDateString() : '—' }}
          </q-td>
        </template>
        <template #body-cell-endDate="{ row }">
          <q-td>
            {{ row.endDate ? new Date(row.endDate).toLocaleDateString() : '—' }}
          </q-td>
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-right">
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="link_off"
              @click="unassignPriceConfig(row)"
            >
              <q-tooltip>Desvincular de categoría</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

    </div>

    <q-dialog v-model="addDialogOpen">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nuevo amarre</div>
        </q-card-section>
        <q-form @submit="handleCreate">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="addForm.number"
              label="Identificador"
              outlined
              dense
              :rules="numberRules"
              maxlength="25"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn color="primary" label="Crear" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialogOpen">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar amarre</div>
        </q-card-section>
        <q-form @submit="handleUpdate">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="editForm.number"
              label="Identificador"
              outlined
              dense
              :rules="numberRules"
              maxlength="25"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn color="primary" label="Guardar" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="assignDialogOpen" position="top">
      <q-card style="width: 500px; margin-top: 50px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Vincular configuración de precio</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <p class="text-grey-7 q-mb-md">
            Selecciona una configuración de precio para asignarla a esta categoría.
          </p>

          <q-select
            v-model="selectedPriceConfig"
            :options="availablePriceConfigs"
            option-label="name"
            label="Buscar configuración..."
            outlined
            use-input
            fill-input
            hide-selected
            input-debounce="0"
            bg-color="white"
            :loading="priceConfigStore.priceConfigurations.length === 0"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>
                    {{ scope.opt.startDate ? new Date(scope.opt.startDate).toLocaleDateString() : '' }} -
                    {{ scope.opt.endDate ? new Date(scope.opt.endDate).toLocaleDateString() : '' }} |
                    {{ scope.opt.minPricePerDay?.toFixed(2) }} €
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ availablePriceConfigs.length === 0 ? 'Todas las configuraciones ya están asignadas' : 'No se encontraron configuraciones' }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            label="Vincular"
            color="primary"
            unelevated
            :disable="!selectedPriceConfig || loadingAssign"
            :loading="loadingAssign"
            @click="assignPriceConfig"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1000px;
}
.sticky-header-table {
  background: white;
  border-radius: 8px;
}
.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.q-table tbody tr:hover) {
  background-color: #f5f8ff !important;
}
</style>
