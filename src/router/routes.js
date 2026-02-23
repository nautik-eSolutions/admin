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
    name:'login',
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
  {
    path: `/users`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UserManagement.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/zones`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ZonesPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/zones/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ZonePage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/moorings/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MooringEditPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/dimensions`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DimensionsPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/price-configurations`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PriceConfiguration.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/mooring-categories`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MooringCategories.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/mooring-categories/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MooringCategoryPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]



export default routes
