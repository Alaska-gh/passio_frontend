import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
   LOAD_TRIP,
   LOAD_TRIPS_FAILURE,
   LOAD_TRIPS_SUCCESS } from './trips.actions';
import { TripService } from '@core/services/trip.service';

@Injectable()
export class TripsEffects {
  private actions$ = inject(Actions);
  private tripService = inject(TripService);

  loadTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_TRIP),
      switchMap(({ route, origion, destination, date, time, pricePerSeat}) =>
        from(this.tripService.getOrCreateTrip(route, origion, destination, date, time, pricePerSeat)).pipe(
          map((trip) => {
            console.log(trip);
            
            return LOAD_TRIPS_SUCCESS({ trip })
          }),
          catchError((error) => {
            console.log(error);
            
            return of(LOAD_TRIPS_FAILURE({ error: error.message }))})
        )
      )
    )
  );

}