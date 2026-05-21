import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer-home.componet/customer-home.componet').then((m) => m.CustomerHomeComponet),
    children: [
      {
        path: 'routes',
        loadComponent: () =>
          import('./routes/customer-routes.component/customer-routes.component').then(
            (m) => m.CustomerRoutesComponent,
          ),
        title: 'RouteGH — Browse Routes',
      },
      {
        path: 'schedules/:routeId',
        loadComponent: () =>
          import('./schedules/schedules-list.component/schedules-list.component').then(
            (m) => m.SchedulesListComponent,
          ),
        title: 'RouteGH — Schedules',
      },
      {
        path: 'checkout/:scheduleId',
        loadComponent: () =>
          import('./checkout/checkout.component/checkout.component').then(
            (m) => m.CheckoutComponent,
          ),
        title: 'RouteGH — Checkout',
      },
      {
        path: 'ticket/:ticketId',
        loadComponent: () =>
          import('./tickets/ticket-detail.component/ticket-detail.component').then(
            (m) => m.TicketDetailComponent,
          ),
        title: 'RouteGH — My Ticket',
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./tickets/customer-ticket.component/customer-ticket.component').then(
            (m) => m.CustomerTicketComponent,
          ),
        title: 'RouteGH — My Tickets',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./accounts/customer-account.component/customer-account.component').then(
            (m) => m.CustomerAccountComponent,
          ),
        title: 'RouteGH — Account',
      },

      // ✅ FIXED REDIRECT (important)
      { path: '', redirectTo: 'routes', pathMatch: 'full' },
    ],
  },
];
