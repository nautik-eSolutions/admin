<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMooringCategoryStore } from '../stores/mooringCategory'
import { useMooring } from '../stores/mooring'

const PORT_ID = 1

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const mooringCategoryStore = useMooringCategoryStore()
const mooringStore = useMooring()

onMounted(async () => {
  await mooringCategoryStore.getMooringCategory(PORT_ID, route.params.id)
  await mooringStore.getMooringsByCategory(route.params.id)
})

const mooringsColumns = [
  { name: 'number', label: 'Número', field: 'number', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

function goToMooring(id) {
  router.push(`/moorings/${id}`)
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
                <q-badge outline color="primary" label="Categoría Activa" />
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
                {{ mooringCategoryStore.category.dimensionsMaxLength + ` m x ` + mooringCategoryStore.category.dimensionsMaxBeam + ` m x ` + mooringCategoryStore.category.dimensionsMaxDraft + ` m` ?? '—' }}
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
        class="sticky-header-table shadow-1"
      >
        <template #no-data>
          <div class="full-width row flex-center q-py-xl text-grey-6">
            No hay amarres registrados en esta categoría.
          </div>
        </template>

        <template #top-right>
          <q-btn color="primary" icon="add" label="Nuevo amarre" dense unelevated class="q-px-md" />
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-right">
            <q-btn flat round dense icon="visibility" @click="goToMooring(row.id)" />
          </q-td>
        </template>
      </q-table>

    </div>
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
