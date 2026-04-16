import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./customer-home.componet/customer-home.componet').then((m) => m.CustomerHomeComponet),
  },
  {
    path: 'account',
    canActivate: [authGuard, roleGuard(['customer'])],
    loadComponent: () =>
      import('./customer-account.component/customer-account.component').then(
        (m) => m.CustomerAccountComponent,
      ),
  },
  {
    path: 'ticket',
    // canActivate: [authGuard, roleGuard(['customer'])],
    loadComponent: () =>
      import('./customer-ticket.component/customer-ticket.component').then(
        (m) => m.CustomerTicketComponent,
      ),
  },
  {
    path: 'route',
    // canActivate: [authGuard, roleGuard(['customer'])],
    loadComponent: () =>
      import('./customer-routes.component/customer-routes.component').then(
        (m) => m.CustomerRoutesComponent,
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
