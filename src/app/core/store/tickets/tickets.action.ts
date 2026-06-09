import { DailySummary, Ticket } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const ISSUE_TICKET = createAction(
  '[Tickets] Issue ticket',
  props<{ 
    ticket: Ticket; 
    tripId: string; busId: string; queueOrder: number; 
    route: string; origin: string; 
    destination: string; date: string; pricePerSeat: number 
  }>()
)

export const ISSUE_TICKET_SUCCESS = createAction(
  '[Tickets] Issue Ticket Success',
   props<{ ticket: Ticket & { id: string }; rotated: boolean }>()
)

export const ISSUE_TICKET_FAILURE = createAction(
  '[Tickets] Issue Ticket Failure',
   props<{ error: string }>()
)

export const LOAD_TODAY_SUMMARY= createAction(
  '[Tickets] Load Today Summary',
)

export const LOAD_TODAY_SUMMARY_SUCCESS = createAction(
  '[Tickets] Load Today Summary Success',
   props<{ summary: DailySummary }>()
)

export const LOAD_TODAY_SUMMARY_FAILURE = createAction(
  '[Tickets] Load Today Summary Failue',
   props<{ error: string }>()
)
export const LOAD_ADMIN_SUMMARY = createAction('[Tickets] Load Admin Summary');

export const LOAD_ADMIN_SUMMARY_SUCCESS = createAction('[Tickets] Load Admin Summary Success',
  props<{ summary: DailySummary }>());
  
export const LOAD_ADMIN_SUMMARY_FAILURE = createAction('[Tickets] Load Admin Summary Failure',
  props<{ error: string }>());

export const LOAD_RECENT_TICKET = createAction(
  '[Tickets] Load Recent Ticket',
)

export const LOAD_RECENT_TICKET_SUCCESS = createAction(
  '[Tickets] Load Recent Ticket Success',
   props<{ tickets: Ticket[] }>()
)

export const LOAD_RECENT_TICKET_FAILURE = createAction(
  '[Tickets] Load Recent Ticket Failure',
   props<{ error: string }>()
)

export const RESET_TICKET = createAction(
  '[Tickets] Rset Ticket',
)