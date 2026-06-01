import { Ticket } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const ISSUE_TICKET = createAction(
  '[TRIPS] Issue ticket',
   props<{ ticket: Ticket; tripId: string }>()
)
export const ISSUE_TICKET_SUCCESS = createAction(
  '[TRIPS] Issue Ticket Success',
   props<{ ticket: Ticket }>()
)
export const ISSUE_TICKET_FAILURE = createAction(
  '[TRIPS] Issue Ticket Failure',
   props<{ error: string }>()
)
export const RESET_TICKET = createAction(
  '[TRIPS] Rset Ticket',
)