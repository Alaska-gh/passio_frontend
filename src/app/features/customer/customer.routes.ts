import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./customer-home.componet/customer-home.componet').then(
        (m) => m.CustomerHomeComponet
      ),
    title: 'Passio — Home',
  },

  {
    path: 'routes',
    loadComponent: () =>
      import('./routes/customer-routes.component/customer-routes.component').then(
        (m) => m.CustomerRoutesComponent
      ),
    title: 'Passio — Browse Routes',
  },

  {
    path: 'tickets',
    loadComponent: () =>
      import('./tickets/customer-ticket.component/customer-ticket.component').then(
        (m) => m.CustomerTicketComponent
      ),
    title: 'Passio — My Tickets',
  },

  {
    path: 'account',
    loadComponent: () =>
      import('./accounts/customer-account.component/customer-account.component').then(
        (m) => m.CustomerAccountComponent
      ),
  },

  {
    path: 'schedules/:routeId',
    loadComponent: () =>
      import('./schedules/schedules-list.component/schedules-list.component').then(
        (m) => m.SchedulesListComponent
      ),
  },

  {
    path: 'checkout/:scheduleId',
    loadComponent: () =>
      import('./checkout/checkout.component/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },

  {
    path: 'ticket/:ticketId',
    loadComponent: () =>
      import('./tickets/ticket-detail.component/ticket-detail.component').then(
        (m) => m.TicketDetailComponent
      ),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];