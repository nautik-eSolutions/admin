<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table
        title="Boats"
        :rows="boats"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :rows-per-page-options="[5, 10, 20]"
      >
        <template v-slot:top-row>
          <q-tr>
            <q-td>

            </q-td>
            <q-td>
              <q-input v-model="nameBoat" dense />
            </q-td>

            <q-td>
              <q-input v-model="boatRegisterNumber" dense />
            </q-td>

            <q-td>
              <q-input v-model="length" type="number" dense />
            </q-td>

            <q-td>
              <q-input v-model="beam" type="number" dense />
            </q-td>

            <q-td>
              <q-input v-model="draft" type="number" dense />
            </q-td>

            <q-td>
              <q-select
                v-model="boatType"
                :options="boatTypesMap"
                dense
              />
            </q-td>

            <q-td>
              <q-select
                v-model="user"
                :options="usersMap"
                dense
              />
            </q-td>

            <q-td>
              <q-btn
                color="positive"
                label="ADD"
                @click="addBoat"
                dense
              />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn
              color="negative"
              label="DELETE"
              dense
              @click="deleteBoat(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>

    </div>

  </q-page>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { BoatService } from 'src/service/BoatService.js'
  import { UserService } from 'src/service/UserService.js'
  import {BoatCreate} from "src/model/Create/BoatCreate.js";

  const columns = [
    {name: 'id', label: 'ID', field: 'id', align: 'center'},
    { name: 'name', label: 'NAME', field: 'name', align: 'center' },
    { name: 'registryNumber', label: 'REGISTRY NUMBER', field: 'registryNumber', align: 'center' },
    { name: 'length', label: 'LENGTH', field: 'length', align: 'center' },
    { name: 'beam', label: 'BEAM', field: 'beam', align: 'center' },
    { name: 'draft', label: 'DRAFT', field: 'draft', align: 'center' },
    { name: 'boatType', label: 'BOAT TYPE', field: 'boatType', align: 'center' },
    { name: 'user', label: 'USER', field: 'user', align: 'center' },
    { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'center' }
  ]

  const pagination = ref({
    page: 1,
    rowsPerPage: 5
  })



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
      await BoatService.addBoat(new BoatCreate(nameBoat.value, boatRegisterNumber.value, length.value, beam.value, draft.value, boatType.value.label), user.value.value)

      nameBoat.value = '';
      boatRegisterNumber.value = '';
      length.value = '';
      beam.value = '';
      draft.value = '';
      boatType.value = null;
      user.value = null;
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


