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
          <td><q-input model-value="" name="name"></q-input></td>
          <td><q-input model-value="" name="registryNumber"></q-input></td>
          <td><q-input model-value="" type="number" name="length"></q-input></td>
          <td><q-input model-value="" type="number" name="beam"></q-input></td>
          <td><q-input model-value="" type="number" name="draft"></q-input></td>
          <td><q-select model-value=""
          :options="boatTypesMap"></q-select></td>
          <td></td>
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

<script>

import { defineComponent } from 'vue';
import {BoatService} from "src/service/BoatService.js";




export default defineComponent({
  name: 'BoatList',

  data() {
    return {
      boats: [],
      boatTypes:[]
    }
  },
  async mounted() {
   await this.loadBoats();
  },

  computed: {
     boatTypesMap() {
      return this.boatTypes.map(botType => ({
        value: botType.id,
        label: botType.name,
      }))
    }

  },

  methods: {
    async deleteBoat(boatId) {
      console.log("Eliminar barco con id:", boatId);
      await BoatService.delete(boatId)
      await this.loadBoats()
    },
    addBoat() {

    },

    async loadBoats() {
      this.boats = await BoatService.getBoats();
      this.boatTypes = await BoatService.getBoatsTypes();
      console.log(this.boatTypes);


    }
  }
});


</script>
