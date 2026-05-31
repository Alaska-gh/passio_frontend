import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { BusService } from '@core/services/bus.service';
import { CREATE_BUSS, CREATE_BUSS_FAILURE, CREATE_BUSS_SUCCESS, GET_ALL_BUSSES, GET_ALL_BUSSES_FAILURE, GET_ALL_BUSSES_SUCCESS } from './buses.actions';

@Injectable()
export class BusesEffects {
  private actions$ = inject(Actions);
  private busService = inject(BusService);

  loadBuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ALL_BUSSES),
      switchMap(() =>
        this.busService.getAllBuses().pipe(
          map((buses) => GET_ALL_BUSSES_SUCCESS({ buses })),
          catchError((err) => of(GET_ALL_BUSSES_FAILURE({ error: err.message }))),
        ),
      ),
    ),
  );

  createBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CREATE_BUSS),
      switchMap(({ bus }) =>
        this.busService
          .createBus(bus)
          .pipe(map(() => CREATE_BUSS_SUCCESS()),
            catchError((err) => {
              return of(CREATE_BUSS_FAILURE({ error: err.message }));
            })
          )
      ),
    ),
  );

  // updateBus$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(BusesActions.updateBus),
  //     switchMap(({ id, changes }) =>
  //       this.busService.updateBus(id, changes).pipe(
  //         map(() => BusesActions.updateBusSuccess()),
  //         catchError((err) => {
  //           return of(BusesActions.updateBusFailure({ error: err.message }));
  //         }),
  //       ),
  //     ),
  //   ),
  // );
}
