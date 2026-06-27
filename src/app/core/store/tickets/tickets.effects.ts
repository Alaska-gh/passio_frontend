import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, exhaustMap, tap, take } from 'rxjs/operators';
import { TicketService } from '../../services/ticket.service';
import { ISSUE_TICKET, ISSUE_TICKET_FAILURE, ISSUE_TICKET_SUCCESS, LOAD_ADMIN_SUMMARY, LOAD_ADMIN_SUMMARY_FAILURE, LOAD_ADMIN_SUMMARY_SUCCESS, LOAD_RECENT_TICKET, LOAD_RECENT_TICKET_FAILURE, LOAD_RECENT_TICKET_SUCCESS, LOAD_TODAY_SUMMARY, LOAD_TODAY_SUMMARY_FAILURE, LOAD_TODAY_SUMMARY_SUCCESS } from './tickets.action';
import { selectCurrentUser } from '../auth/auth.selectors';
import { Store } from '@ngrx/store';
import { TripService } from '@core/services/trip.service';
import { GhanaPostGpsService } from '@core/services/geolocation.service';
import { selectActiveRoutes } from '../routes/route.selectors';
import { BusService } from '@core/services/bus.service';
import { LOAD_BUSES } from '../buses/buses.actions';

@Injectable()
export class TicketEffects {
  private actions$ = inject(Actions);
  private ticketService = inject(TicketService);
  private geoService = inject(GhanaPostGpsService)
  private tripService = inject(TripService)
  private busService = inject(BusService)
  private store = inject(Store)

  issueTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ISSUE_TICKET),
      exhaustMap(({ ticket, tripId, busId, queueOrder, route, origin,
        destination, date, pricePerSeat }) =>
        this.tripService.issueSeatAndSaveTicket(
          ticket, tripId, busId, ticket.numberOfSeats,
          queueOrder, route, origin, destination, date, pricePerSeat
        ).pipe(
          switchMap(({ ticketId, rotated }) => {
            const successAction = ISSUE_TICKET_SUCCESS({
              ticket: { ...ticket, id: ticketId }, rotated
            });

            if (!rotated) return of(successAction);

            // Bus just filled — get destination coords from routes store
            return this.store.select(selectActiveRoutes).pipe(
              take(1),
              switchMap(routes => {
                console.log('[effects', route);
                
                const matchedRoute = routes.find(r =>
                  `${r.origin} → ${r.destination}` === route
                );
                console.log('Matched Route found', matchedRoute);
                
                if (!matchedRoute) return of(successAction);

                
                const destCoords = {
                  lat: matchedRoute.destinationLat,
                  lng: matchedRoute.destinationLng,
                };

                //  Open tracking session
                return this.geoService.createMeetSession(
                  destCoords,
                  `${route} — Bus ${busId}`
                ).pipe(
                  switchMap(session =>
                    //  Store session on bus document
                    from(this.busService.updateBusTracking(busId, {
                      trackingSessionId: session.session_id,
                      trackingJoinToken: session.join_token,
                    }))
                  ),
                  map(() => successAction),
                  catchError(() => of(successAction)) // don't fail ticket if tracking fails
                );
              })
            );
          }),
          catchError(err => of(ISSUE_TICKET_FAILURE({ error: err.message })))
        )
      )
    )
  );


  refreshBusesAfterTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ISSUE_TICKET_SUCCESS),
      map(() => LOAD_BUSES())
    )
  );

  loadRecentTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_RECENT_TICKET),
      switchMap(() =>
        this.ticketService.getRecentTickets().pipe(
          map(tickets => LOAD_RECENT_TICKET_SUCCESS({ tickets })),
          catchError(err => of(LOAD_RECENT_TICKET_FAILURE({ error: err.message })))
        )
      )
    )
  );

  loadTodaySummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_TODAY_SUMMARY),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([, user]) => {
        if (!user) return of(LOAD_TODAY_SUMMARY_FAILURE({ error: 'No user' }));
        return this.ticketService.getTodaySummary(user.uid).pipe(
          map((summary) => LOAD_TODAY_SUMMARY_SUCCESS({ summary })),
          catchError((error) =>
            of(LOAD_TODAY_SUMMARY_FAILURE({ error: error.message }))
          )
        );
      })
    )
);

loadAdminSummary$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LOAD_ADMIN_SUMMARY),
    switchMap(() =>
      this.ticketService.getAdminDailySummary().pipe(
        map(summary => LOAD_ADMIN_SUMMARY_SUCCESS({ summary })),
        catchError(err => of(LOAD_ADMIN_SUMMARY_FAILURE({ error: err.message })))
      )
    )
  )
);
}