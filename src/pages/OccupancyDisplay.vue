<script setup>
import {useBookingStore} from "stores/booking.js";

const mooringStore = useMooring();
const bookingStore = useBookingStore();
import SchedulerD from "components/SchedulerD.vue";
import {onMounted, ref} from "vue";
import {useMooring} from "stores/mooring.js";

const bookings= ref()
const moorings= ref();

onMounted(async()=>{
  moorings.value = await mooringStore.getMoorings(1)
  bookings.value = await bookingStore.getAllBookings(1);
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
