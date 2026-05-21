import { Routes } from '@angular/router';
import { guestGuard } from '@core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    // canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./verify-otp/verify-otp.component/verify-otp.component').then(
        (m) => m.VerifyOtpComponent,
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
