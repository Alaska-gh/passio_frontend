import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
      {
        path: 'buses',
        loadComponent: () =>
          import('./bus-management/bus-management').then(
            (m) => m.BusManagement
          ),
      },
    //   {
    //     path: 'tickets',
    //     loadComponent: () =>
    //       import('./components/admin-tickets/admin-tickets.component').then(
    //         (m) => m.AdminTicketsComponent
    //       ),
    //   },
    //   {
    //     path: 'routes',
    //     loadComponent: () =>
    //       import('./components/admin-routes/admin-routes.component').then(
    //         (m) => m.AdminRoutesComponent
    //       ),
    //   },
    ],
  },
];