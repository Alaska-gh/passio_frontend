import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { LoginComponent } from './features/auth/login/login-component/login-component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: Home }
];
