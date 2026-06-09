import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { UserRole } from '@core/interfaces/user.interface';
import { selectAuthInitialized, selectUserRole } from '@core/store/auth/auth.selectors';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
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
      filter((initialized) => initialized), // 👈 wait for Firebase to resolve
      take(1),
      switchMap(() => store.select(selectUserRole).pipe(take(1))), // 👈 then check role
      map((role) => {
        if (role && allowedRoles.includes(role)) return true;
        return router.createUrlTree([destinations[role ?? 'customer']]);
      }),
    );
  };
};