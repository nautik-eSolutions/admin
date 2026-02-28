<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import {useMooringCategoryStore} from "stores/mooringCategory.js";
import {useAuthStore} from "stores/auth.js";

const router = useRouter()
const $q = useQuasar()

const selectedCategory = ref(null)
const mooringCategories = ref([])
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const mooringCategoryStore = useMooringCategoryStore()
const minStartDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minEndDate = computed(() => {
  if (!startDate.value) return minStartDate.value
  const start = new Date(startDate.value)
  start.setDate(start.getDate() + 1)
  return start.toISOString().split('T')[0]
})

function isValidEndDate(val) {
  if (!val || !startDate.value) return false
  return val > startDate.value
}



async function fetchCategories() {
  const portId = useAuthStore().portId;
  mooringCategories.value = await mooringCategoryStore.getMooringCategories(portId)
}

function onSubmit() {
  loading.value = true


  router.push({
    path: `/occupancy/mooring-category/${selectedCategory.value}/${startDate.value}/${endDate.value}`
  }).catch(() => {
    loading.value = false
  })
}

onMounted(() => {
  fetchCategories()
})


</script>

<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-2 col-md-3 col-lg-4">
        <q-card>
          <q-card-section>
            <div class="text-h5 q-mb-md">Buscar Disponibilidad</div>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-select
                v-model="selectedCategory"
                :options="mooringCategories"
                option-value="id"
                option-label="name"
                label="Categoría de Amarre"
                outlined
                :rules="[val => !!val || 'Selecciona una categoría']"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay categorías disponibles
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                v-model="startDate"
                type="date"
                label="Fecha de Entrada"
                outlined
                :min="minStartDate"
                :rules="[val => !!val || 'Selecciona una fecha']"
              />

              <q-input
                v-model="endDate"
                type="date"
                label="Fecha de Salida"
                outlined
                :min="minEndDate"
                :rules="[
                  val => !!val || 'Selecciona una fecha',
                  val => isValidEndDate(val) || 'Debe ser posterior a la fecha de entrada'
                ]"
              />

              <div class="row q-mt-md">
                <q-btn
                  label="Buscar Disponibilidad"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                  icon="search"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>



<style scoped>
.q-page {
  padding-top: 50px;
}
</style>
