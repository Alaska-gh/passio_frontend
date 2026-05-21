import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { selectIsAuthenticated } from '@core/store/auth/auth.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    switchMap((isAuthenticated) => {
      // No user signed in — pass request through unchanged
      if (!isAuthenticated) return next(req);

      // Get a fresh ID token and attach it
      return authService.getIdToken().pipe(
        take(1),
        switchMap((token) => {
          if (!token) return next(req);
          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            }),
          );
        }),
      );
    }),
  );
};
