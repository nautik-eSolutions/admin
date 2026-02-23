<script setup>
import {ref, computed, onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {usePriceConfigurationStore} from '../stores/priceConfiguration.js'
import {usePortStore} from "stores/port.js";
const portStore = usePortStore()


const PORT_ID = portStore.portId;

const $q = useQuasar()
const priceConfigurationStore = usePriceConfigurationStore()

const YEAR = new Date().getFullYear()

const showForm = ref(false)
const editingIndex = ref(null)
const editingId = ref(null)
const dateRange = ref({from: '', to: ''})
const formRef = ref(null)

const form = ref({
  name: '',
  startDate: '',
  endDate: '',
  minPricePerDay: null,
})


onMounted(async () => {
  await priceConfigurationStore.getAllPriceConfigurations(PORT_ID)
})

function parseDate(d) {
  if (!d) return null
  return new Date(d)
}

function toISODate(quasarDate) {
  return quasarDate?.replace(/\//g, '-') ?? ''
}

function formatDisplay(d) {
  return parseDate(d)?.toLocaleDateString('es-ES', {day: '2-digit', month: 'short', year: 'numeric'}) ?? ''
}

function dayCount(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000) + 1
}

const sortedConfigs = computed(() =>
  [...priceConfigurationStore.priceConfigurations].sort(
    (a, b) => parseDate(a.startDate) - parseDate(b.startDate)
  )
)

const columns = [
  {name: 'name', label: 'Nombre', field: 'name', align: 'left'},
  {name: 'start', label: 'Inicio', field: (r) => formatDisplay(r.startDate), align: 'left'},
  {name: 'end', label: 'Fin', field: (r) => formatDisplay(r.endDate), align: 'left'},
  {name: 'days', label: 'Días', field: (r) => dayCount(r.startDate, r.endDate), align: 'center'},
  {name: 'price', label: 'Precio mín/día', field: (r) => `${r.minPricePerDay} €`, align: 'right'},
  {name: 'actions', label: '', field: 'actions', align: 'center'},
]

function openForm(config = null, indx = null) {
  editingIndex.value = indx
  editingId.value = config?.id ?? null
  dateRange.value = config ? {from: config.startDate, to: config.endDate} : {from: '', to: ''}
  form.value = config
    ? {...config}
    : {name: '', startDate: '', endDate: '', minPricePerDay: null}
  showForm.value = true
}

function onDateRangeUpdate(val) {
  if (val?.from && val?.to) {
    form.value.startDate = val.from
    form.value.endDate = val.to
  } else if (typeof val === 'string') {
    form.value.startDate = form.value.endDate = val
  }
}

const rules = {
  name: [(v) => !!v?.trim() || 'El nombre es obligatorio'],
  start: [(v) => !!v || 'Selecciona una fecha de inicio'],
  end: [(v) => !!v || 'Selecciona una fecha de fin'],
  price: [(v) => v > 0 || 'El precio debe ser mayor que 0'],
}

async function onSubmit() {
  const valid = await formRef.value.validate()
  if (!valid) return

  const payload = {
    name: form.value.name.trim(),
    startDate: toISODate(form.value.startDate),
    endDate: toISODate(form.value.endDate),
    minPricePerDay: form.value.minPricePerDay,
  }
  if (editingId.value !== null) {
    await priceConfigurationStore.updatePriceConfiguration(PORT_ID, editingId.value, payload)
  } else {
    await priceConfigurationStore.createPriceConfiguration(PORT_ID, payload)
  }

  showForm.value = false
}

function deleteConfig(row) {
  $q.dialog({title: 'Eliminar', message: '¿Eliminar esta configuración?', cancel: true})
    .onOk(async () => {
      await priceConfigurationStore.deletePriceConfiguration(PORT_ID, row.id)
    })
}

function findIndex(row) {
  return priceConfigurationStore.priceConfigurations.findIndex(
    (c) => c.id === row.id
  )
}
</script>

<template>
  <q-page padding>
    <div class="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
      <div>
        <p class="text-2xl font-bold text-gray-900">Configurador de Precios</p>
        <p class="text-sm text-gray-500">Año {{ YEAR }}</p>
      </div>
      <q-btn unelevated color="primary" icon="add" label="Nueva configuración" @click="openForm()"/>
    </div>

    <q-card flat bordered>
      <q-table
        :rows="sortedConfigs"
        :columns="columns"
        flat
        no-data-label="Sin configuraciones. Añade la primera."
      >
        <template #body-cell-days="props">
          <q-td :props="props">
            <q-badge color="primary" :label="`${props.value} d`"/>
          </q-td>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props">
            <span class="font-bold text-blue-700 tabular-nums">{{ props.value }}</span>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn flat round dense icon="edit" color="primary" size="sm"
                   @click="openForm(props.row, findIndex(props.row))"/>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="deleteConfig(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="width: 520px; max-width: 95vw;">
        <q-card-section class="flex items-center justify-between pb-2">
          <span class="text-lg font-bold text-gray-900">
            {{ editingId !== null ? 'Editar configuración' : 'Nueva configuración' }}
          </span>
          <q-btn flat round dense icon="close" @click="showForm = false"/>
        </q-card-section>

        <q-separator/>

        <q-form ref="formRef" @submit.prevent="onSubmit">
          <q-card-section class="q-gutter-md">

            <q-input
              v-model="form.name"
              label="Nombre *"
              outlined
              placeholder="Ej. Temporada Alta"
              :rules="rules.name"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="label"/>
              </template>
            </q-input>

            <div class="text-sm font-semibold text-gray-600 mb-1">
              <q-icon name="date_range" class="mr-1"/>
              Rango de fechas *
            </div>

            <div class="row q-gutter-sm">
              <q-input
                :model-value="formatDisplay(form.startDate)"
                label="Inicio *" outlined readonly class="col"
                :rules="rules.start" lazy-rules
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateRange" range
                              :navigation-min-year-month="`${YEAR}/01`"
                              :navigation-max-year-month="`${YEAR}/12`"
                              @update:model-value="onDateRangeUpdate"
                      >
                        <div class="row justify-end">
                          <q-btn v-close-popup label="OK" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                :model-value="formatDisplay(form.endDate)"
                label="Fin *" outlined readonly class="col"
                :rules="rules.end" lazy-rules
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateRange" range
                              :navigation-min-year-month="`${YEAR}/01`"
                              :navigation-max-year-month="`${YEAR}/12`"
                              @update:model-value="onDateRangeUpdate"
                      >
                        <div class="row justify-end">
                          <q-btn v-close-popup label="OK" color="primary" flat/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <p v-if="form.startDate && form.endDate" class="text-xs text-blue-600 font-medium">
              {{ dayCount(form.startDate, form.endDate) }} días seleccionados
            </p>

            <q-input
              v-model.number="form.minPricePerDay"
              label="Precio mínimo por día (€) *"
              outlined type="number" min="0.01" step="0.01"
              :rules="rules.price" lazy-rules
            >
              <template #prepend>
                <q-icon name="euro"/>
              </template>
            </q-input>

          </q-card-section>

          <q-card-actions align="right" class="px-4 pb-4">
            <q-btn flat label="Cancelar" @click="showForm = false"/>
            <q-btn unelevated color="primary" icon="save" type="submit"
                   :label="editingId !== null ? 'Actualizar' : 'Guardar'"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
