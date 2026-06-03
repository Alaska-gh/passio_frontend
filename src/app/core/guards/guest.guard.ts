import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
  selectUserRole,
} from '../store/auth/auth.selectors';
import { UserRole } from '@core/interfaces/user.interface';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const destinations: Record<UserRole, string> = {
    customer: '/customer/routes',
    admin: '/admin/dashboard',
    driver: '/driver/schedule',
    conductor: '/conductor/scanner',
    cashier: '/cashier/dashboard'
  };

  return store.select(selectAuthInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
    switchMap(() =>
      store.select(selectIsAuthenticated).pipe(
        take(1),
        switchMap((isAuthenticated) => {
          // Not logged in — allow access to login/verify pages
          if (!isAuthenticated) return [true];

          // Already logged in — redirect to their portal
          return store.select(selectUserRole).pipe(
            take(1),
            map((role) => router.createUrlTree([destinations[role ?? 'customer']])),
          );
        }),
      ),
    ),
  );
};
