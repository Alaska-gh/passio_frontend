import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { BusesActions } from './buses.actions';
import { BusService } from '@core/services/bus.service';

@Injectable()
export class BusesEffects {
  private actions$ = inject(Actions);
  private busService = inject(BusService);

  loadBuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusesActions.loadBuses),
      switchMap(() =>
        this.busService.getAllBuses().pipe(
          map((buses) => BusesActions.loadBusesSuccess({ buses })),
          catchError((err) => of(BusesActions.loadBusesFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  createBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusesActions.createBus),
      switchMap(({ bus }) =>
        this.busService
          .createBus(bus)
          .pipe(map(() => BusesActions.createBusSuccess()),
            catchError((err) => {
              return of(BusesActions.createBusFailure({ error: err.message }));
            })
          )
      ),
    ),
  );

  updateBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusesActions.updateBus),
      switchMap(({ id, changes }) =>
        this.busService.updateBus(id, changes).pipe(
          map(() => BusesActions.updateBusSuccess()),
          catchError((err) => {
            return of(BusesActions.updateBusFailure({ error: err.message }));
          }),
        ),
      ),
    ),
  );
}
