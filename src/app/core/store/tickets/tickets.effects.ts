import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TicketService } from '../../services/ticket.service';
import { ISSUE_TICKET, ISSUE_TICKET_FAILURE, ISSUE_TICKET_SUCCESS } from './tickets.action';

@Injectable()
export class TicketEffects {
  private actions$ = inject(Actions);
  private ticketService = inject(TicketService);


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
}