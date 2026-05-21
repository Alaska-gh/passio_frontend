import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';
import { SHOW_TOAST } from '@core/store/toast/toast.actions';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = 'Something went wrong. Please try again.';

      if (err.status === 401) message = 'Your session has expired. Please sign in again.';
      if (err.status === 403) message = 'You do not have permission to do that.';
      if (err.status === 404) message = 'The requested resource was not found.';
      if (err.status === 0) message = 'Network error. Check your connection.';

      store.dispatch(SHOW_TOAST({
        title:'',
         message, 
         severity: ToastSeverity.ERROR }));

      return throwError(() => err);
    }),
  );
};
