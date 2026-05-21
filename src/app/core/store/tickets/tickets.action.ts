import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Ticket } from '@core/interfaces/ticket.interface';
import { PurchasePayload, PurchaseResult, VerifyResult } from '@core/services/ticket.service';

export const TicketsActions = createActionGroup({
  source: 'Tickets',
  events: {
    'Load My Tickets': emptyProps(),
    'Load My Tickets Success': props<{ tickets: Ticket[] }>(),
    'Load My Tickets Failure': props<{ error: string }>(),

    'Purchase Ticket': props<{ payload: PurchasePayload }>(),
    'Purchase Ticket Success': props<{ result: PurchaseResult }>(),
    'Purchase Ticket Failure': props<{ error: string }>(),

    'Verify Ticket': props<{ qrPayload: string }>(),
    'Verify Ticket Success': props<{ result: VerifyResult }>(),
    'Verify Ticket Failure': props<{ error: string }>(),

    'Select Ticket': props<{ ticketId: string }>(),
    'Clear Verify Result': emptyProps(),
  },
});
