import { inject, Injectable } from "@angular/core";
import { BusService } from "@core/services/bus.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ADD_BUS, ADD_BUS_FAILURE, ADD_BUS_SUCCESS, LOAD_BUS_TRIP_HISTORY, LOAD_BUS_TRIP_HISTORY_FAILURE, LOAD_BUS_TRIP_HISTORY_SUCCESS, LOAD_BUSES, LOAD_BUSES_FAILURE, LOAD_BUSES_SUCCESS, SET_BUS_ACTIVE, SET_BUS_INACTIVE, SET_BUS_STATUS_FAILURE, SET_BUS_STATUS_SUCCESS, UPDATE_BUS, UPDATE_BUS_FAILURE, UPDATE_BUS_SUCCESS } from "./buses.actions";

@Injectable()
export class BusesEffects {
  private actions$ = inject(Actions);
  private busService = inject(BusService);
  private store = inject(Store);

  loadBuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_BUSES),
      switchMap(() =>
        this.busService.getAllBuses().pipe(
          map(buses => LOAD_BUSES_SUCCESS({ buses })),
          catchError(err => of(LOAD_BUSES_FAILURE({ error: err.message })))
        )
      )
    )
  );

  addBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ADD_BUS),
      switchMap(({ bus }) =>
        this.busService.addBus(bus).pipe(
          map(newBus => ADD_BUS_SUCCESS({ bus: newBus })),
          catchError(err => of(ADD_BUS_FAILURE({ error: err.message })))
        )
      )
    )
  );

  updateBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_BUS),
      switchMap(({ busId, updates }) =>
        this.busService.updateBus(busId, updates).pipe(
          map(() => UPDATE_BUS_SUCCESS({ busId, updates })),
          catchError(err => of(UPDATE_BUS_FAILURE({ error: err.message })))
        )
      )
    )
  );

  setBusActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_BUS_ACTIVE),
      switchMap(({ busId }) =>
        this.busService.setBusActive(busId).pipe(
          map(() => SET_BUS_STATUS_SUCCESS()),
          tap(() => this.store.dispatch(LOAD_BUSES())), // refresh list
          catchError(err => of(SET_BUS_STATUS_FAILURE({ error: err.message })))
        )
      )
    )
  );

  setBusInactive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_BUS_INACTIVE),
      switchMap(({ busId }) =>
        this.busService.setBusInactive(busId).pipe(
          map(() => SET_BUS_STATUS_SUCCESS()),
          tap(() => this.store.dispatch(LOAD_BUSES())), // refresh list
          catchError(err => of(SET_BUS_STATUS_FAILURE({ error: err.message })))
        )
      )
    )
  );

  loadTripHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_BUS_TRIP_HISTORY),
      switchMap(({ busId }) =>
        this.busService.getBusTripHistory(busId).pipe(
          map(trips => LOAD_BUS_TRIP_HISTORY_SUCCESS({ trips })),
          catchError(err => of(LOAD_BUS_TRIP_HISTORY_FAILURE({ error: err.message })))
        )
      )
    )
  );
}