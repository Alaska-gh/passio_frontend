import { Ticket } from "@core/interfaces";
import { createReducer, on } from "@ngrx/store";
import { ISSUE_TICKET, ISSUE_TICKET_FAILURE, ISSUE_TICKET_SUCCESS, RESET_TICKET } from "./tickets.action";

export interface TicketState {
  issuedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
}

export const initialTicketState: TicketState = {
  issuedTicket: null,
  loading: false,
  error: null,
};

export const ticketsReducer = createReducer(
  initialTicketState,
   on(ISSUE_TICKET, (state) => ({
    ...state, loading: true, error: null
  })),

  on(ISSUE_TICKET_SUCCESS, (state, { ticket }) => ({
    ...state, loading: false, issuedTicket: ticket
  })),

  on(ISSUE_TICKET_FAILURE, (state, { error }) => ({
    ...state, loading: false, error
  })),

  on(RESET_TICKET, () => initialTicketState)
)