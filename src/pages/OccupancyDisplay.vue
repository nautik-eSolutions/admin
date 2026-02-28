<script setup>
import {useBookingStore} from "stores/booking.js";
const portStore = usePortStore()


const PORT_ID = portStore.portId;

const mooringStore = useMooring();
const bookingStore = useBookingStore();
import SchedulerD from "components/SchedulerD.vue";
import {onMounted, ref} from "vue";
import {useMooring} from "stores/mooring.js";
import {usePortStore} from "stores/port.js";
import {useRoute} from "vue-router";

const route = useRoute();
const bookings= ref()
const moorings= ref();

const startDate = route.params.startDate;
const endDate = route.params.endDate;
const mooringCategoryId = route.params.id;
onMounted(async()=>{



  moorings.value = await mooringStore.getMoorings(PORT_ID)
  bookings.value = await bookingStore.getAllBookings(PORT_ID);
  console.log(bookings)
})

</script>



<template>
  <div>
    <template v-if="bookings && moorings">
      <SchedulerD :bookings="bookings" :moorings="moorings"/>
    </template>
  </div>
</template>

<style scoped>

</style>
