<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { CompanyService } from 'src/service/CompanyService.js'

const $q = useQuasar()

const companies = ref([])
const loading = ref(false)

const addDialog = ref(false)
const newCompanyForm = ref(null)

const newCompany = ref({
  name: '',
  vat: '',
  email: '',
  phone: '',
  adminUsername: '',
  adminPassword: ''
})

const rules = {
  required: val => (val && val.length > 0) || 'Campo obligatorio',
  max45: str => (str && str.length <= 45) || 'Máximo 45 caracteres',
  max20: str => (str && str.length <= 20) || 'Máximo 20 caracteres',
  email: val => /.+@.+\..+/.test(val) || 'Email no válido'
}

const columns = [
  { name: 'name', required: true, label: 'Nombre', align: 'left', field: 'name', sortable: true },
  { name: 'vat', label: 'CIF / VAT', align: 'left', field: 'vat' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'phone', label: 'Teléfono', align: 'left', field: 'phone' },
  { name: 'actions', label: 'Acciones', align: 'right', field: 'actions' }
]

onMounted(async () => {
  loading.value = true
  companies.value = await CompanyService.getAll()
  loading.value = false
})

function openAddDialog() {
  newCompany.value = {
    name: '',
    vat: '',
    email: '',
    phone: '',
    adminUsername: '',
    adminPassword: ''
  }
  addDialog.value = true
}

async function createCompany() {
  const valid = await newCompanyForm.value.validate()
  if (!valid) return

  $q.loading.show({ message: 'Creando empresa...' })
  try {
    const companyDto = {
      name: newCompany.value.name,
      vat: newCompany.value.vat,
      email: newCompany.value.email,
      phone: newCompany.value.phone
    }
    const created = await CompanyService.create(
      companyDto,
      newCompany.value.adminUsername,
      newCompany.value.adminPassword
    )
    companies.value.push(created)
    $q.notify({ type: 'positive', message: 'Empresa creada correctamente', position: 'bottom-right' })
    addDialog.value = false
  } catch (error) {
    const message = error.response?.data?.detail || 'Error al crear la empresa'
    $q.notify({ type: 'negative', message, position: 'bottom-right' })
  } finally {
    $q.loading.hide()
  }
}

function confirmDelete(company) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Deseas eliminar definitivamente la empresa "${company.name}"?`,
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(async () => {
    try {
      console.log(companies)
      await CompanyService.delete(company.id)
      companies.value = companies.value.filter(c => c.id !== company.id)
      $q.notify({ type: 'positive', message: 'Empresa eliminada correctamente', position: 'bottom-right' })
    } catch (error) {
      if (error.response?.status === 409) {
        const message = error.response.data?.detail || 'No se puede eliminar: existen registros relacionados.'
        $q.notify({ type: 'negative', message, timeout: 5000, actions: [{ icon: 'close', color: 'white' }] })
      } else {
        $q.notify({ type: 'negative', message: 'Error inesperado al intentar eliminar la empresa.' })
        console.error('Error original:', error)
      }
    }
  })
}
</script>

<template>
  <q-page padding class="bg-white">
    <div class="main-container">

      <div class="row items-center justify-between q-mb-xl">
        <div class="text-h5 text-weight-bold">Empresas</div>
        <q-btn color="primary" icon="add" label="Añadir Empresa" unelevated @click="openAddDialog" />
      </div>

      <q-table
        :rows="companies"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
        binary-state-sort
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <span class="text-weight-medium">{{ props.row.name }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat dense size="sm"
              color="negative"
              icon="delete"
              label="Eliminar"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-6">
            No hay empresas registradas.
          </div>
        </template>
      </q-table>

      <q-dialog v-model="addDialog" persistent>
        <q-card style="min-width: 420px">
          <q-card-section>
            <div class="text-h6">Nueva Empresa</div>
            <div class="text-caption text-grey-6">Datos de la empresa y administrador inicial</div>
          </q-card-section>

          <q-form ref="newCompanyForm" @submit.prevent="createCompany">
            <q-card-section class="q-pt-none q-gutter-y-sm">

              <div class="text-subtitle2 text-grey-7 q-mt-sm">Datos de la empresa</div>

              <q-input
                v-model="newCompany.name"
                label="Nombre de la empresa"
                outlined dense autofocus
                :rules="[rules.required, rules.max45]"
              />
              <q-input
                v-model="newCompany.vat"
                label="CIF / VAT"
                outlined dense
                :rules="[rules.required, rules.max20]"
              />
              <q-input
                v-model="newCompany.email"
                label="Email"
                type="email"
                outlined dense
                :rules="[rules.required, rules.email]"
              />
              <q-input
                v-model="newCompany.phone"
                label="Teléfono"
                outlined dense
                :rules="[rules.required, rules.max20]"
              />

              <q-separator class="q-my-md" />

              <div class="text-subtitle2 text-grey-7">Administrador de la empresa</div>

              <q-input
                v-model="newCompany.adminUsername"
                label="Usuario administrador"
                outlined dense
                :rules="[rules.required, rules.max45]"
              />
              <q-input
                v-model="newCompany.adminPassword"
                label="Contraseña administrador"
                type="password"
                outlined dense
                :rules="[rules.required, rules.max20]"
              />

            </q-card-section>

            <q-card-actions align="right" class="text-primary q-px-md q-pb-md">
              <q-btn flat label="Cancelar" v-close-popup color="grey-7" />
              <q-btn label="Guardar" color="primary" unelevated type="submit" />
            </q-card-actions>
          </q-form>
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

:deep(.q-table thead th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

:deep(.q-table__card) {
  box-shadow: none;
}
</style>
