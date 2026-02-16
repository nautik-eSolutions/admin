<template>
  <DayPilotScheduler
  :timeHeaders="[{groupBy: 'Month'},{groupBy: 'Day', format: 'd'}]"
  scale="Day"
  :startDate="startDate"
  :days="days"
  :resources="resources"
  :events="events"
  height="100vh"
  />
</template>

<script setup>
import {DayPilot, DayPilotScheduler} from '@daypilot/daypilot-lite-vue';
import {computed, onMounted, ref} from "vue";
import {useMooring} from "stores/mooring.js";
import {useBookingStore} from "stores/booking.js";

const mooringStore = useMooring();
const bookingStore = useBookingStore();

const startDate = ref(DayPilot.Date.today().firstDayOfMonth())
const days = computed(() => startDate.value.daysInYear())

const resources = ref([])
const events = ref([])
const moorings = ref()
const bookings =  ref();
onMounted(async ()=>{
  bookings.value = await bookingStore.getAllBookings(1)
  moorings.value = await mooringStore.getMoorings(1)
  console.log(bookings)

  resources.value= moorings.value.map(mooring=>{
    return {
      name:mooring.number,
      id:mooring.id
    }
  })

  events.value = bookings.value.map(booking=>{
    return{
      id:booking.id,
      start:booking.startDate,
      end:booking.endDate,
      resource:booking.mooringId,
      text:`Reserva ${booking.id}`
    }
  })

  /*
  events.value = [
    {
      id: 1,
      start: "2026-02-02T00:00:00",
      end: "2026-02-06T00:00:00",
      text: "Event 1",
      resource: "m1",
      tags: {
        color: "#6fa8dc"
      }
    },
    {
      id: 2,
      start: "2026-02-06T01:00:00",
      end: "2026-02-08T00:00:00",
      text: "Event 1",
      resource: "m1",
      tags: {
        color: "#6fa8dc"
      }
    }]
*/
})




</script>
