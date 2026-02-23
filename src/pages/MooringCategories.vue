<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMooringCategoryStore } from '../stores/mooringCategory'
import {ZoneService} from '../service/ZoneService'
import {getDimensionsByPort} from '../service/MooringDimensionsService'

const PORT_ID = 1

const router = useRouter()
const $q = useQuasar()
const mooringCategoryStore = useMooringCategoryStore()

const zoneOptions = ref([])
const dimensionOptions = ref([])
const dialogOpen = ref(false)

const form = reactive({
  name: '',
  zoneId: null,
  dimensionsId: null,
  basePricePerDay: null,
})

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'minPricePerDay', label: 'Precio base / día', field: 'minPricePerDay', align: 'left', sortable: true,
    format: (val) => `${val.toFixed(2)} €` },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

onMounted(async () => {
  await mooringCategoryStore.getMooringCategories(PORT_ID)
  const [zonesRes, dimensionsRes] = await Promise.all([
    ZoneService.getZonesByPort(PORT_ID),
    getDimensionsByPort(PORT_ID),
  ])
  zoneOptions.value = zonesRes
  dimensionOptions.value = dimensionsRes
})

function goToCategory(id) {
  router.push(`mooring-categories/${id}`)
}

function openCreateDialog() {
  form.name = ''
  form.zoneId = null
  form.dimensionsId = null
  form.basePricePerDay = null
  dialogOpen.value = true
}

async function handleCreate() {
  await mooringCategoryStore.createMooringCategory(PORT_ID,{ ...form })
  dialogOpen.value = false
}

function confirmDelete(category) {
  $q.dialog({
    title: 'Eliminar categoría',
    message: `¿Desea eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await mooringCategoryStore.deleteMooringCategory(PORT_ID,category.id)
  })
}
</script>
<template>
  <q-page padding>

    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Categorías de Amarres</div>
      <q-btn
        color="primary"
        icon="add"
        label="Nueva categoría"
        @click="openCreateDialog"
      />
    </div>

    <q-table
      :rows="mooringCategoryStore.categories"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template #no-data>
        <div class="full-width row flex-center q-py-xl text-grey-6">
          No hay categorías registradas.
        </div>
      </template>

      <template #body-cell-actions="{ row }">
        <q-td class="text-right">
          <q-btn flat round dense icon="visibility" @click="goToCategory(row.id)" />
          <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Nueva categoría</div>
        </q-card-section>

        <q-card-section class="q-gutter-md" >
          <q-input v-model="form.name" label="Nombre" outlined dense />
          <q-select
            v-model="form.zoneId"
            :options="zoneOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Zona"
            outlined
            dense
          />

          <q-select
            v-model="form.dimensionsId"
            :options="dimensionOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Dimensiones"
            outlined
            dense
          />

          <q-input
            v-model.number="form.basePricePerDay"
            label="Precio base / día (€)"
            type="number"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Crear" @click="handleCreate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

