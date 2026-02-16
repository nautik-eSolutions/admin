<template>
  <DayPilotScheduler
  :timeHeaders="[{groupBy: 'Month'},{groupBy: 'Day', format: 'd'}]"
  scale="Day"
  :startDate="startDate"
  :days="days"
  :resources="resources"
  :events="events"
  />
</template>

<script setup>
import {DayPilot, DayPilotScheduler} from '@daypilot/daypilot-lite-vue';
import {computed, onMounted, ref} from "vue";
const startDate = ref(DayPilot.Date.today().firstDayOfMonth())
const days = computed(() => startDate.value.daysInYear())


const resources = ref([])
const events = ref([])

onMounted(()=>{
  resources.value=[
    {name:'196',id:"m3"},
    {name:'193',id:"m2"},
    {name:'239',id:"m1"}
  ]

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

})




</script>
