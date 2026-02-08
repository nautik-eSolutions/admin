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
      boats: []
    }
  },
  async mounted() {
    this.boats = await BoatService.getBoats();
  }
});


</script>
