import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TripService } from '@core/services/trip.service';
import { LOAD_CURRENT_TRIP, LOAD_CURRENT_TRIP_FAILURE, LOAD_CURRENT_TRIP_SUCCESS } from './trips.actions';
import { SHOW_TOAST } from '../toast/toast.actions';
import { Store } from '@ngrx/store';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';

@Injectable()
export class TripsEffects {

  private actions$ = inject(Actions);
  private tripService = inject(TripService);
  private store = inject(Store)

  loadCurrentTrip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_CURRENT_TRIP),
      switchMap(({ route, origin, destination, date, pricePerSeat }) =>
        this.tripService.getCurrentTrip(route, origin, destination, date, pricePerSeat).pipe(
          map((trip) => {            
            return trip ? LOAD_CURRENT_TRIP_SUCCESS({ trip })
              : LOAD_CURRENT_TRIP_FAILURE({ error: 'No active bus found' })
          }
          ),
          catchError((error) =>{
          
            this.store.dispatch(
              SHOW_TOAST({
                title: 'No Bus Available',
                message: error.message,
                severity: ToastSeverity.WARN
              })
            )
            console.log(error.message);
            
           return of(LOAD_CURRENT_TRIP_FAILURE({ error: error.message }))}
          )
        )
      )
    )
  );

}