import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TripsActions } from './trips.actions';
import { TripService } from '@core/services/trip.service';
import { SHOW_TOAST } from '../toast/toast.actions';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';

@Injectable()
export class TripsEffects {
  private actions$ = inject(Actions);
  private tripService = inject(TripService);

  loadDriverTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.loadDriverTrips),
      switchMap(({ driverId }) =>
        this.tripService.getDriverTrips(driverId).pipe(
          map((trips) => TripsActions.loadDriverTripsSuccess({ trips })),
          catchError((err) => of(TripsActions.loadDriverTripsFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  recordReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.recordReturn),
      switchMap(({ payload }) =>
        this.tripService.recordReturn(payload).pipe(
          map((result) => TripsActions.recordReturnSuccess({ result })),
          catchError((error) => {
            return of(TripsActions.recordReturnFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  recordReturnSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.recordReturnSuccess),
      map(({ result }) =>
        SHOW_TOAST({
          title: '',
          message: result.message,
          severity: ToastSeverity.SUCCESS,
        }),
      ),
    ),
  );

  recordReturnFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.recordReturnFailure),
      map(({ error }) => SHOW_TOAST
      ({ 
        title:'',
        message: error, 
        severity: ToastSeverity.ERROR })),
    ),
  );
}
