const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    component: () => import('pages/LoginNautik.vue'),
  },
  {
    path: '/boats',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/BoatList.vue') }
    ],
    meta: {requiresAuth: true}
  },  {
    path: '/ports',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PortsList.vue') }
    ],
    meta: {requiresAuth: true}
  },{
    path: `/ports/:portId`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PortInfo.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/occupancy`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OccupancyDisplay.vue') }
    ],
    meta: {requiresAuth: true}
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]



export default routes
