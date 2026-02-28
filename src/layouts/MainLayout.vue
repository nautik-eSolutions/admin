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

        <q-btn push color="red" label="Logout" @click="onSubmit"/>
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
          Menú
        </q-item-label>

        <template v-if="linklist">
          <EssentialLink
            v-for="link in linklist"
            :key="link.title"
            v-bind="link"
          />
        </template>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {


    return {}
  }
})
</script>
<script setup>

import {useRouter} from "vue-router";
import {useAuthStore} from '../stores/auth.js'

const router = useRouter();
const auth = useAuthStore();
const leftDrawerOpen = ref(false)

const PortAdminLinkList = ref([
  {
    title: 'Reservas entrantes',
    icon: '',
    link: '/bookings/incoming'
  },
  {
    title: 'Ocupación',
    icon: '',
    link: '/occupancy'
  },
  {
    title: 'Estado amarres',
    icon: '',
    link: '/states/moorings'
  },
  {
    title: 'Modificar reservas',
    icon: '',
    link: '/bookings/edit'
  },
  {
    title: 'Gestión de puerto',
    icon: '',
    link: '/ports'
  },
  {
    title: 'Gestión de zonas',
    icon: '',
    link: '/zones'
  },
  {
    title: 'Gestión de dimensiones',
    icon: '',
    link: '/dimensions'
  },
  {
    title: 'Gestión de precios',
    icon: '',
    link: '/price-configurations'
  }
  ,
  {
    title: 'Gestión de categorias',
    icon: '',
    link: '/mooring-categories'
  }
])
const AdminCompanyLinkList = ref([
  {
    title: 'Reservas entrantes',
    icon: '',
    link: '/bookings/incoming'
  },
  {
    title: 'Ocupación',
    icon: '',
    link: '/occupancy'
  },
  {
    title: 'Estado amarres',
    icon: '',
    link: '/states/moorings'
  },
  {
    title: 'Modificar reservas',
    icon: '',
    link: '/bookings/edit'
  }
])

const linklist = getLinksList();

function getLinksList() {
  console.log(auth.role)
  if (auth.role === 'ADMIN_COMPANY') {
    return AdminCompanyLinkList
  } else if (auth.role === 'ADMIN_PORT') {
    return PortAdminLinkList;

  }
}


if (!auth.isAuthenticated) {
  router.push('/login')
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const onSubmit = () => {

  auth.logout()
  router.push('/login')

}
</script>
