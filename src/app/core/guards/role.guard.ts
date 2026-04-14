import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { UserRole } from '@core/interfaces/user.interface';
import { selectUserRole } from '@core/store/auth/auth.selectors';

/**
 * Usage in routes:
 * canActivate: [authGuard, roleGuard(['admin'])]
 * canActivate: [authGuard, roleGuard(['customer'])]
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    const destinations: Record<UserRole, string> = {
      customer: '/customer/routes',
      admin: '/admin/dashboard',
      driver: '/driver/schedule',
      conductor: '/conductor/scanner',
    };

    return store.select(selectUserRole).pipe(
      take(1),
      map((role) => {
        // Role is allowed — let them through
        if (role && allowedRoles.includes(role)) return true;

        // Authenticated but wrong role — send to their own portal
        return router.createUrlTree([destinations[role ?? 'customer']]);
      }),
    );
  };
};
