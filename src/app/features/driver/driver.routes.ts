import { Routes } from '@angular/router';

export const DRIVER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./driver-home/driver-home').then(
        (m) => m.DriverHome
      ),
  },
  {
    path: 'queue',
    loadComponent: () =>
      import('./driver-queue/driver-queue').then(
        (m) => m.DriverQueue
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./driver-history/driver-history').then(
        (m) => m.DriverHistory
      ),
  },
];