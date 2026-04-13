import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TripsActions } from './trips.actions';
import { UiActions } from '../ui/ui.actions';
import { TripService } from '@core/services/trip.service';

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
        this.tripService
          .recordReturn(payload)
          .then((result) => TripsActions.recordReturnSuccess({ result }))
          .catch((err) => TripsActions.recordReturnFailure({ error: err.message })),
      ),
    ),
  );

  recordReturnSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.recordReturnSuccess),
      map(({ result }) =>
        UiActions.showToast({
          message: result.message,
          toastType: 'success',
        }),
      ),
    ),
  );

  recordReturnFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TripsActions.recordReturnFailure),
      map(({ error }) => UiActions.showToast({ message: error, toastType: 'error' })),
    ),
  );
}
