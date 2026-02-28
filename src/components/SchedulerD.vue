<template>
  <template v-if="resources && events">
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
</template>

<script setup>
import {DayPilot, DayPilotScheduler} from '@daypilot/daypilot-lite-vue';
import {computed, onMounted, ref} from "vue";

const startDate = ref(DayPilot.Date.today().firstDayOfMonth())
const days = computed(() => startDate.value.daysInYear())

const resources = ref([])
const events = ref([])
const props = defineProps({
  moorings:Array,
  bookings:Array,
  days: Array
})



onMounted( ()=> {


  resources.value= props.moorings.map(mooring=>{
    return {
      name:mooring.number,
      id:mooring.id
    }
  })

  events.value = props.bookings.map(booking=>{

    return{
      id:booking.id,
      start:booking.startDate,
      end:booking.endDate,
      resource:booking.mooringId,
      text:`Reserva ${booking.id}`
    }
  })
})


</script>
