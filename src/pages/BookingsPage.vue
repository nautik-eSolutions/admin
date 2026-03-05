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

</script>
<template>

</template>
