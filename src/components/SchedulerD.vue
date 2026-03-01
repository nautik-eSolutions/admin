<template>
  <template v-if="props.moorings && events">
    <DayPilotScheduler
      :timeHeaders="[{groupBy: 'Month'},{groupBy: 'Day', format: 'd'}]"
      scale="Day"
      :startDate="schedulerStartDate"
      :days="schedulerDays"
      :resources="props.moorings.map(mooring=>{return{name: mooring.number, id: mooring.id}})"
      :events="events"
      height="100vh"
    />
  </template>
</template>

<script setup>
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-vue'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  moorings: Array,
  bookings: Array,
  startDate: String,
  endDate: String
})

const resources = ref([])
const events = ref([])

const schedulerStartDate = computed(() => {
  if (props.startDate) {
    const [year, month, day] = props.startDate.split('-')
    return new DayPilot.Date(`${year}-${month}-${day}`)
  }
  return DayPilot.Date.today().firstDayOfMonth()
})

const schedulerDays = computed(() => {
  if (props.startDate && props.endDate) {
    const start = new Date(props.startDate)
    const end = new Date(props.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }
  return schedulerStartDate.value.daysInYear()
})
function formatDateForScheduler(dateStr) {
  if (!dateStr) return null
  const [day, month, year] = dateStr.split('-')
  return `${year}-${month}-${day}`
}

onMounted(() => {
  events.value = props.bookings.map(booking => {
    return {
      id: booking.id,
      start: formatDateForScheduler(booking.startDate),
      end: formatDateForScheduler(booking.endDate),
      resource: booking.mooringId,
      text: `Reserva ${booking.id}`
    }
  })
})
</script>
