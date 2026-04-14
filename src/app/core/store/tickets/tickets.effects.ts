import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { UiActions } from '../ui/ui.actions';
import { TicketsActions } from './tickets.action';
import { TicketService } from '@core/services/ticket.service';

@Injectable()
export class TicketsEffects {
  private actions$ = inject(Actions);
  private ticketService = inject(TicketService);
  private router = inject(Router);

  loadMyTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.loadMyTickets),
      switchMap(() =>
        this.ticketService.getMyTickets().pipe(
          map((tickets) => TicketsActions.loadMyTicketsSuccess({ tickets })),
          catchError((err) => of(TicketsActions.loadMyTicketsFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  purchaseTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.purchaseTicket),
      switchMap(({ payload }) =>
        this.ticketService
          .purchaseTicket(payload)
          .pipe(map((result) => TicketsActions.purchaseTicketSuccess({ result })),
            catchError((err) => {
            return of(TicketsActions.purchaseTicketFailure({ error: err.message }));
          })
        )
      ),
    ),
  );

  purchaseTicketSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.purchaseTicketSuccess),
      tap(({ result }) => this.router.navigate(['/customer/ticket', result.ticketId])),
      map(() => UiActions.showToast({ message: 'Ticket purchased!', toastType: 'success' })),
    ),
  );

  purchaseTicketFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.purchaseTicketFailure),
      map(({ error }) => UiActions.showToast({ message: error, toastType: 'error' })),
    ),
  );

  verifyTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketsActions.verifyTicket),
      switchMap(({ qrPayload }) =>
        this.ticketService.verifyTicket(qrPayload).pipe(
          map((result) => TicketsActions.verifyTicketSuccess({ result })),
          catchError((err) => {
            return of(TicketsActions.verifyTicketFailure({ error: err.message }));
          }),
        ),
      ),
    ),
  );
}
