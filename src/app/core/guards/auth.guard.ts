import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { selectAuthInitialized, selectIsAuthenticated } from '@core/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  // Wait until Firebase has resolved the auth state (initialized = true)
  // before deciding whether to allow or redirect.
  return store.select(selectAuthInitialized).pipe(
    filter((initialized) => initialized), // hold until Firebase responds
    take(1), // only need one emission
    switchMap(() =>
      store.select(selectIsAuthenticated).pipe(
        take(1),
        map((isAuthenticated) => {
          if (isAuthenticated) return true;
          return router.createUrlTree(['/auth/login']);
        }),
      ),
    ),
  );
};
