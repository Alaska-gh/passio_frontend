import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full',
  },

  // Auth (public)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Customer portal
  {
    path: 'customer',
    loadChildren: () =>
      import('./features/customer/customer.routes').then((m) => m.CUSTOMER_ROUTES),
  },

  {
    path: 'cashier',
    // canActivate: ['cashier', 'admin'],
    children: [
        {
        path: 'issue-ticket',
        loadComponent: () =>
          import('./features/cashier/issue-ticket/issue-ticket.component/issue-ticket.component')
            .then(m => m.IssueTicketComponent),
      },
    ]
  },

  //  Admin dashboard
  // {
  //   path: 'admin',
  //   canActivate: [authGuard, roleGuard(['admin'])],
  //   loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  // },

  //  Driver app
  // {
  //   path: 'driver',
  //   canActivate: [authGuard, roleGuard(['driver'])],
  //   loadChildren: () => import('./features/driver/driver.routes').then((m) => m.DRIVER_ROUTES),
  // },

  //  Conductor scanner
  // {
  //   path: 'conductor',
  //   canActivate: [authGuard, roleGuard(['conductor'])],
  //   loadChildren: () =>
  //     import('./features/conductor/conductor.routes').then((m) => m.CONDUCTOR_ROUTES),
  // },

  //  404 fallback
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
