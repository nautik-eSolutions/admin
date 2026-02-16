<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          NAUTIK enterprise
        </q-toolbar-title>

        <q-btn push color="red" label="Logout"  @click="onSubmit"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Reservas entrantes',
    icon: '',
    link: '/reservas/entrantes'
  },
  {
    title: 'Ocupación',
    icon: '',
    link: '/ocupacion'
  },
  {
    title: 'Barcos',
    icon: '',
    link: '/barcos'
  },
  {
    title: 'Estados amarres',
    icon: '',
    link: '/estados'
  },
  {
    title: 'Modificar reservas',
    icon: '',
    link: '/reservas/modificar'
  },
  {
    title: 'Puertos',
    icon: '',
    link: '/ports'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)



    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
<script setup>

import {useRouter} from "vue-router";
import useAuth from '../stores/auth.js'

const router = useRouter();
const auth = useAuth();

if(!auth.isAuthenticated){
   router.push('/login')
}



const onSubmit = () => {

   auth.logout()
    router.push('/login')

}
</script>
