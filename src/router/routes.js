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
      { path: '', component: () => import('pages/developer/BoatList.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/ports/create',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/company-admin/CreatePort.vue')}
    ]
  },
  {
    path: '/ports-dev',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/developer/PortsList.vue') }
    ],
    meta: {requiresAuth: true}
  },{
    path: `/ports-dev/:portId`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/developer/PortInfo.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/administrator-management`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/company-admin/PortAdminsPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/zones`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/ZonesPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/zones/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/ZonePage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/moorings/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/MooringEditPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/dimensions`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/DimensionsPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/price-configurations`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/PriceConfiguration.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/mooring-categories`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/MooringCategories.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/mooring-categories/:id`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/port-admin/MooringCategoryPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/ports-company`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/company-admin/PortsPage.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: `/ports/:id?`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ports/PortPageCoAdmin.vue') }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/occupancy',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/OccupancySearchPage.vue') }
    ]
  },

  {
    path: '/occupancy/mooring-category/:id/:startDate/:endDate',
    name: 'occupancy',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/OccupancyDisplay.vue') }
    ]
  },
  {
    path: '/checkin',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/CheckInPage.vue') }
    ]
  },
  {
    path: '/checkout',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/CheckOutPage.vue') }
    ]
  },
  {
    path: '/bookings',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/BookingsPage.vue') }
    ]
  },
  {
    path: '/bookings/:id',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      { path: '', component: () => import('pages/port-admin/BookingPage.vue') }
    ]
  }
  ,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]



export default routes
