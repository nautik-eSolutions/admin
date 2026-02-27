<script setup>
import {ref} from 'vue'
import {useAuthStore} from '../stores/auth.js'
import {usePortStore} from '../stores/port.js'
import {useRouter} from 'vue-router'
import {PortService} from '../service/PortService.js'

const username = ref('')
const password = ref('')
const auth = useAuthStore()
const portStore = usePortStore()
const router = useRouter()
const portDialogOpen = ref(false)
const ports = ref([])
const selectedPort = ref(null)

const usernameRules = [
  val => (val && val.length > 0) || 'El usuario es requerido'
]
const passwordRules = [
  val => (val && val.length > 0) || 'La contraseña es requerida'
]
const portRules = [
  val => !!val || 'Debes seleccionar un puerto'
]

const onSubmit = async () => {
  await auth.loginUser(username.value, password.value)

  if (auth.isAuthenticated) {
    if (auth.isCompanyAdmin) {
      const rawPorts = await PortService.getAllByCompanyAdmin()
      ports.value = rawPorts.map(p => ({label: p.name, value: p.id}))
      portDialogOpen.value = true
    } else {
      router.push('/')
    }
  }
}

function confirmPort() {
  if (!selectedPort.value) return
  portStore.setPort(selectedPort.value.value)
  portDialogOpen.value = false
  router.push('/')
}
</script>

<template>
  <div class="flex flex-center w-full">
    <div class="w-full">

      <div class="text-center">
        <h1 class="text-3xl font-bold text-grey-9 mb-2">NAUTIK</h1>
        <p class="text-grey-6">Inicia sesión en tu cuenta</p>
      </div>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="username"
          type="text"
          label="Usuario"
          :rules="usernameRules"
          bg-color="grey-2"
          rounded standout
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary"/>
          </template>
        </q-input>

        <q-input
          v-model="password"
          type="password"
          label="Contraseña"
          lazy-rules
          :rules="passwordRules"
          bg-color="grey-2"
          rounded standout
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary"/>
          </template>
        </q-input>

        <div class="q-mt-lg">
          <q-btn
            type="submit"
            label="Iniciar Sesión"
            color="primary"
            class="full-width"
            unelevated
            size="lg"
          />
        </div>
      </q-form>

    </div>
  </div>

  <q-dialog v-model="portDialogOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Selecciona el puerto a administrar</div>
        <div class="text-caption text-grey-6 q-mt-xs">
          Podrás cambiarlo más adelante desde el menú.
        </div>
      </q-card-section>

      <q-form @submit="confirmPort">
        <q-card-section>
          <q-select
            v-model="selectedPort"
            :options="ports"
            label="Puerto"
            outlined
            dense
            :rules="portRules"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Confirmar" type="submit" unelevated/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>
</style>
