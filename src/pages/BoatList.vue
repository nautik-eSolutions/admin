<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-markup-table>
        <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">NAME</th>
          <th class="text-center">REGISTRY NUMBER</th>
          <th class="text-center">LENGTH</th>
          <th class="text-center">BEAM</th>
          <th class="text-center">DRAFT</th>
          <th class="text-center">BOAT TYPE</th>
          <th class="text-center">USER</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td></td>
          <td><q-input v-model="nameBoat" name="name"></q-input></td>
          <td><q-input v-model="boatRegisterNumber" name="registryNumber"></q-input></td>
          <td><q-input v-model="length" type="number" name="length"></q-input></td>
          <td><q-input v-model="beam" type="number" name="beam"></q-input></td>
          <td><q-input v-model="draft" type="number" name="draft"></q-input></td>
          <td><q-select v-model="boatType"
          :options="boatTypesMap"></q-select></td>
          <td><q-select v-model="user"
                        :options="usersMap"></q-select></td>
          <td ><button
            @click="addBoat()"
            class="bg-green"
          >ADD</button></td>
        </tr>
        </tbody>
        <tbody v-for="boat in boats" :key="boat.id">
        <tr>
          <td>{{ boat.id }}</td>
          <td>{{boat.name}}</td>
          <td>{{boat.registryNumber}}</td>
          <td>{{boat.length}}</td>
          <td>{{boat.beam}}</td>
          <td>{{boat.draft}}</td>
          <td>{{boat.boatType}}</td>
          <td>{{boat.user}}</td>
          <td ><button
            @click="deleteBoat(boat.id)"
            class="bg-red"
          >DELETE</button></td>
        </tr>
        </tbody>
      </q-markup-table>
    </div>

  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { BoatService } from 'src/service/BoatService.js'
  import { UserService } from 'src/service/UserService.js'
  import {Boat} from "src/model/Boat.js";

  const nameBoat = ref();
  const boatType = ref();
  const boatRegisterNumber = ref();
  const user = ref();
  const length = ref();
  const beam = ref();
  const draft = ref();


  const boats = ref([])
  const boatTypes = ref([])
  const users = ref([])


  const boatTypesMap = computed(() =>
  boatTypes.value.map(boatType => ({
  value: boatType.id,
  label: boatType.name
}))
  )

  const usersMap = computed(() =>
  users.value.map(user => ({
  value: user.id,
  label: user.userName
}))
  )


  const loadBoats = async () => {
  boats.value = await BoatService.getBoats()
  boatTypes.value = await BoatService.getBoatsTypes()
  console.log(boatTypes.value)
}

  const loadUsers = async () => {
  users.value = await UserService.getAll()
}

  const deleteBoat = async (boatId) => {
  console.log('Eliminar barco con id:', boatId)
  await BoatService.delete(boatId)
  await loadBoats()
}

  const addBoat = async () => {
    try{
      await BoatService.addBoat(new Boat(nameBoat.value, boatRegisterNumber.value, length.value, beam.value, draft.value, boatType.value.label), user.value.value)
      await loadBoats()
    }catch(err){
      console.log("Error: "+ err)
    }



  }

  onMounted(async () => {
  await loadBoats()
  await loadUsers()
})
</script>


