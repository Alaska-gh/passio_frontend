import { Routes } from '@angular/router';

export const CASHIER_ROUTES: Routes = [
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
          import('./cashier-dashboard/cashier-dashboard.component').then(m => m.CashierDashboardComponent),
      },
      {
        path: 'issue-ticket',
        loadComponent: () =>
          import('./issue-ticket.component/issue-ticket.component').then(m => m.IssueTicketComponent),
      },
    ],
  },
];