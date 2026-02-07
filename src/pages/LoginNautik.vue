<script setup>
import { ref } from 'vue'
import useAuth from '../stores/auth.js'


const username = ref('')
const password = ref('')
const auth = useAuth();



const usernameRules = [
  val => (val && val.length > 0) || 'El usuario es requerido'
]

const passwordRules = [
  val => (val && val.length > 0) || 'La contraseña es requerida'
]


const onSubmit = () => {

    auth.loginUser(username.value, password.value)
}
console.log(auth)

</script>

<template>
    <div class="flex flex-center w-full">

      <div class="w-full">

        <div class="text-center">
          <h1 class="text-3xl font-bold text-grey-9 mb-2">
            NAUTIK
          </h1>
          <p class="text-grey-6">
            Inicia sesión en tu cuenta
          </p>
        </div>

        <!-- Formulario -->
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >

          <!-- Campo de usuario -->
          <q-input
            v-model="username"
            type="text"
            label="Usuario"
            :rules="usernameRules"
            bg-color="grey-2"
            rounded standout
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <!-- Campo de contraseña -->
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
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>
          <div class="q-mt-lg space-y-3">

            <q-btn
              type="submit"
              label="Iniciar Sesión"
              color="primary"
              class="full-width rounded-lg py-3 text-base font-semibold"
              unelevated
              size="lg"
            >
            </q-btn>
          </div>

        </q-form>


      </div>

    </div>
</template>

<style scoped>

</style>
