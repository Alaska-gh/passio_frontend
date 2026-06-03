import { DailySummary, Ticket } from "@core/interfaces";
import { createReducer, on } from "@ngrx/store";
import {
  ISSUE_TICKET,
  ISSUE_TICKET_FAILURE, 
  ISSUE_TICKET_SUCCESS,
  LOAD_TODAY_SUMMARY, 
  LOAD_TODAY_SUMMARY_FAILURE, 
  LOAD_TODAY_SUMMARY_SUCCESS, 
  RESET_TICKET } from "./tickets.action";

export interface TicketState {
  issuedTicket: Ticket | null;
  summary: DailySummary | null;        // 👈 add
  summaryLoading: boolean; 
  loading: boolean;
  error: string | null;
}

export const initialTicketState: TicketState = {
  issuedTicket: null,
  summary: null,                       // 👈 add
  summaryLoading: false, 
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

  on(RESET_TICKET, () => initialTicketState),

  on(LOAD_TODAY_SUMMARY, (state) => ({
  ...state,
  summaryLoading: true,
  error: null,
})),

on(LOAD_TODAY_SUMMARY_SUCCESS, (state, { summary }) => ({
  ...state,
  summaryLoading: false,
  summary,
})),

on(LOAD_TODAY_SUMMARY_FAILURE, (state, { error }) => ({
  ...state,
  summaryLoading: false,
  error,
})),
)

