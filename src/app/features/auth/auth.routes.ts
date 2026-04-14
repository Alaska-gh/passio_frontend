import { Routes } from '@angular/router';
import { guestGuard } from '@core/guards/guest.guard';
import { LoginComponent } from './login/login-component/login-component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component/verify-otp.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginComponent
  },
  {
    path: 'verify',
    component: VerifyOtpComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
