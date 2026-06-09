import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { UserRole } from '@core/interfaces/user.interface';
import { selectAuthInitialized, selectCurrentUser } from '@core/store/auth/auth.selectors';

export const redirectGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const destinations: Record<UserRole, string> = {
    customer: '/customer/routes',
    admin: '/admin/dashboard',
    driver: '/driver/home',
    conductor: '/conductor/scanner',
    cashier: '/cashier/dashboard',
  };

  return store.select(selectAuthInitialized).pipe(
    filter((initialized) => initialized), // wait for Firebase
    take(1),
    switchMap(() => store.select(selectCurrentUser).pipe(take(1))),
    map((user) => {
      if (user) {
        // Logged in — send to their dashboard
        return router.createUrlTree([destinations[user.role]]);
      }
      // Not logged in — send to login
      return router.createUrlTree(['/auth/login']);
    }),
  );
};