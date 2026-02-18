<script setup>
import {onMounted, ref} from "vue";
import {PortService} from "src/service/PortService.js";

const ports = ref();
const port = ref()
const usersByPort = ref();


onMounted(async () => {
  ports.value = await PortService.getAll();

  console.log(ports)
})

async function getUsers() {

}


</script>

<template>
  <div class="q-ma-xl">

    <q-toolbar-title>
      Gestión de usuarios
    </q-toolbar-title>
    <template v-if="ports">
      <div class="row ">
        <q-select style="width: 10rem"
                  v-model="port"
                  @update:modelValue="getUsers"
                  :options="ports.map(port=>port.name)"/>
      </div>
    </template>

    <template v-if="!usersByPort">
      <div><p>{{ usersByPort }}</p></div>
    </template>
  </div>
</template>

<style>

</style>
