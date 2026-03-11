<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from 'stores/booking.js'
import { date } from 'quasar'

const route = useRoute()
const router = useRouter()
const store = useBookingStore()
const selectedStatus = ref(null)

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'No Show', value: 'NO_SHOW' }
]

function formatDate(val) {
  return val ? date.formatDate(val, 'DD/MM/YYYY') : ''
}

function formatDateTime(val) {
  return val ? date.formatDate(val, 'DD/MM/YYYY HH:mm') : ''
}

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

function goBack() {
  router.push('/bookings')
}

async function onStatusChange(newStatus) {
  if (!newStatus) return
  await store.updateBookingStatus(store.Booking.id, newStatus.value)
  selectedStatus.value = null
}

async function onCancel() {
  await store.cancelBooking(store.Booking.id)
  goBack()
}

onMounted(async () => {
  const id = Number(route.params.id)
  await store.getBookingById(id)
  console.log(store.Booking)
})
</script>

<template>
  <q-page padding>
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el label="Bookings" icon="list" to="/bookings" />
      <q-breadcrumbs-el :label="`Booking #${store.Booking?.id}`" />
    </q-breadcrumbs>

    <q-card v-if="store.Booking" flat bordered>
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <div class="col">
            <h6 class="q-my-none">Booking Details</h6>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" @click="goBack" />
          </div>
        </div>

        <q-separator />

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-12 col-md-6">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID</q-item-label>
                  <q-item-label>{{ store.Booking.id }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Client</q-item-label>
                  <q-item-label>{{ store.Booking.clientName }}</q-item-label>
                  <q-item-label caption>{{ store.Booking.clientEmail }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Boat</q-item-label>
                  <q-item-label>{{ store.Booking.boatName }} ({{ store.Booking.boatRegistryNumber }})</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Start Date</q-item-label>
                  <q-item-label>{{ formatDate(store.Booking.startDate) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>End Date</q-item-label>
                  <q-item-label>{{ formatDate(store.Booking.endDate) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-6">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Total Cost</q-item-label>
                  <q-item-label>{{ store.Booking.totalCost }} €</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Status</q-item-label>
                  <q-item-label>
                    <q-badge :color="getStatusColor(store.Booking.bookingStatus)">{{ store.Booking.bookingStatus }}</q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Created At</q-item-label>
                  <q-item-label>{{ formatDateTime(store.Booking.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Updated At</q-item-label>
                  <q-item-label>{{ formatDateTime(store.Booking.updatedAt) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="store.Booking.mooring">
                <q-item-section>
                  <q-item-label caption>Mooring</q-item-label>
                  <q-item-label>#{{ store.Booking.mooring.id }} - {{ store.Booking.mooring.number }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="store.Booking.payment">
                <q-item-section>
                  <q-item-label caption>Payment</q-item-label>
                  <q-item-label>#{{ store.Booking.payment.id }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-separator spaced />

        <div class="row items-center q-gutter-sm">
          <div class="col-12 col-sm-auto">
            <q-select
              v-model="selectedStatus"
              :options="statusOptions"
              label="Change status"
              dense
              outlined
              class="full-width"
              @update:model-value="onStatusChange"
            />
          </div>
          <div class="col">
            <q-btn
              label="Cancel Booking"
              color="negative"
              outline
              @click="onCancel"
              :disable="store.Booking.status === 'CANCELLED'"
            />
          </div>
          <div class="col-auto">
            <q-btn label="Back" flat @click="goBack" />
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>


