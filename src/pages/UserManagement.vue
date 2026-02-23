<script setup>
import {onMounted, ref} from "vue";
import {PortService} from "src/service/PortService.js";
import {useUserStore} from "stores/user.js";

const ports = ref();
const port = ref()
const users = ref();
const userStore = useUserStore();
onMounted(async () => {
  ports.value = await PortService.getAll();

})

 function handleSubmit(){

}

async function getUsers(select) {
  users.value = await  userStore.getAllUsersByPort(select.value)
  console.log(users)
}
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'firstName', label: 'Nombre', field: 'firstName', align: 'left' },
  { name: 'lastName', label: 'Apellido', field: 'lastName', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' }
]
const formData= ref({
  fistName:'',
  lastName:'',
  userName:'',
  bithDate:'',
  email:'',
  password:''
})

</script>

<template>
  <div class="q-ma-xl">

    <q-toolbar-title>
      Gestión de usuarios
    </q-toolbar-title>
    <section class="row justify-around" style="gap:10rem">
    <template v-if="ports">
      <div class="row" >
        <q-select style="width: 20rem"
                  v-model="port"
                  @update:modelValue="getUsers"
                  :options="ports.map(port=> {return {label:port.name, value:port.id}})"

          />
      </div>
    </template>

      <q-form @submit="handleSubmit"  class="column " style="width: 40% ; gap:0.12rem;">
        <q-input label="First Name" v-model="formData.fistName"/>
        <q-input label="Last Name" v-model="formData.lastName"/>
        <q-input label="User Name" v-model="formData.userName"/>
        <q-input type="date" label="Birth Date" v-model="formData.bithDate"/>
        <q-input type="email" label="Email" v-model="formData.email"/>
        <q-input type="password" label="Password" v-model="formData.password"/>
      <q-btn class="text-white bg-primary">Crear usuario</q-btn>
      </q-form>
    </section>
    <template v-if="users">
      <q-table
        class="q-mt-lg"
        title="Lista de usuarios"
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        bordered
      />
    </template>

  </div>
</template>

<style>

</style>
