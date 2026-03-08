const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }
      }
      ,

      {
        path: '/boats', component: () => import('pages/developer/BoatList.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }
      },
      {
        path: '/ports/create', component: () => import('pages/company-admin/CreatePort.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/ports/:id/edit', component: () => import('pages/company-admin/CreatePort.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/ports-dev', component: () => import('pages/developer/PortsList.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/ports-dev/:portId', component: () => import('pages/developer/PortInfo.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/administrator-management', component: () => import('pages/company-admin/PortAdminsPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/zones', component: () => import('pages/port-admin/ZonesPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/zones/:id', component: () => import('pages/port-admin/ZonePage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/moorings/:id', component: () => import('pages/port-admin/MooringEditPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/moorings/incidents', component: () => import('pages/port-admin/MooringsStatusPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/moorings/incidents/create', component: () => import('pages/port-admin/MooringIncidentCreatePage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/moorings/incidents/edit/:id', component: () => import('pages/port-admin/MooringIncidentEditPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/moorings/incidents/:id', component: () => import('pages/port-admin/MooringIncidentPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/dimensions', component: () => import('pages/port-admin/DimensionsPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/price-configurations', component: () => import('pages/port-admin/PriceConfiguration.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/mooring-categories', component: () => import('pages/port-admin/MooringCategories.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/mooring-categories/:id', component: () => import('pages/port-admin/MooringCategoryPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/ports-company', component: () => import('pages/company-admin/PortsPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/ports/:id?', component: () => import('pages/ports/PortPageCoAdmin.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/occupancy', component: () => import('pages/port-admin/OccupancySearchPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/occupancy/mooring-category/:id/:startDate/:endDate',
        component: () => import('pages/port-admin/OccupancyDisplay.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/checkin', component: () => import('pages/port-admin/CheckInPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/checkout', component: () => import('pages/port-admin/CheckOutPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/bookings', component: () => import('pages/port-admin/BookingsPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }

      },

      {
        path: '/bookings/:id', component: () => import('pages/port-admin/BookingPage.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['ADMIN_PORT', 'ADMIN_COMPANY', 'DEVELOPER']
        }
      }
    ],

    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginNautik.vue'),
  }
  ,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }

]


export default routes
