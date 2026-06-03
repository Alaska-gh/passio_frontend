import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TicketService } from '../../services/ticket.service';
import { ISSUE_TICKET, ISSUE_TICKET_FAILURE, ISSUE_TICKET_SUCCESS, LOAD_TODAY_SUMMARY, LOAD_TODAY_SUMMARY_FAILURE, LOAD_TODAY_SUMMARY_SUCCESS } from './tickets.action';
import { selectCurrentUser } from '../auth/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class TicketEffects {
  private actions$ = inject(Actions);
  private ticketService = inject(TicketService);
  private store = inject(Store)


  issueTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ISSUE_TICKET),
      switchMap(({ ticket, tripId }) =>
        from(this.ticketService.issueTicket(ticket, tripId)).pipe(
          map((id) => ISSUE_TICKET_SUCCESS({ ticket: { ...ticket, tripId } })),
          catchError((error) => of(ISSUE_TICKET_FAILURE({ error: error.message })))
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
}