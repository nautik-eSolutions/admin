<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking.js'
import { date } from 'quasar'

const router = useRouter()
const store = useBookingStore()

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'client', label: 'Client', field: row => row.clientName, align: 'left', sortable: false },
  { name: 'boat', label: 'Boat', field: row => `${row.boatName} (${row.boatRegistryNumber})`, align: 'left', sortable: false },
  { name: 'startDate', label: 'Start', field: 'startDate', align: 'left', sortable: true, format: val => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'endDate', label: 'End', field: 'endDate', align: 'left', sortable: true, format: val => date.formatDate(val, 'DD/MM/YYYY') },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center', sortable: false }
]

function getStatusColor(status) {
  const colors = {
    PENDING: 'orange',
    PAID: 'green',
    FAILED: 'red',
    CANCELLED: 'grey',
    NO_SHOW: 'purple'
  }
  return colors[status] || 'primary'
}

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const params = {
    page: page - 1,
    size: rowsPerPage,
    sort: sortBy ? (descending ? `-${sortBy}` : sortBy) : undefined
  }
  store.getAllBookings(params)
}

function goToDetail(id) {
  router.push(`/bookings/${id}`)
}

onMounted(() => {
  store.getAllBookings({ page: 0, size: 10, sort: '-startDate' })
})
</script>
<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <h5 class="q-my-none">Bookings</h5>
      </div>
    </div>

    <q-table
      :rows="store.Bookings"
      :columns="columns"
      row-key="id"
      :pagination="store.pagination"
      :loading="false"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.value)">
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            icon="remove_red_eye"
            @click="goToDetail(props.row.id)"
          >
            <q-tooltip>View details</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>


