import { DailySummary, Ticket } from "@core/interfaces";
import { createReducer, on } from "@ngrx/store";
import {
  ISSUE_TICKET,
  ISSUE_TICKET_FAILURE, 
  ISSUE_TICKET_SUCCESS,
  LOAD_ADMIN_SUMMARY,
  LOAD_ADMIN_SUMMARY_FAILURE,
  LOAD_ADMIN_SUMMARY_SUCCESS,
  LOAD_RECENT_TICKET,
  LOAD_RECENT_TICKET_FAILURE,
  LOAD_RECENT_TICKET_SUCCESS,
  LOAD_TODAY_SUMMARY, 
  LOAD_TODAY_SUMMARY_FAILURE, 
  LOAD_TODAY_SUMMARY_SUCCESS, 
  RESET_TICKET } from "./tickets.action";

export interface TicketState {
  tickets: Ticket[]
  issuedTicket: Ticket | null;
  summary: DailySummary | null;
  summaryLoading: boolean; 
  ticketsLoading: boolean
  loading: boolean;
  error: string | null;
}

export const initialTicketState: TicketState = {
  tickets: [],
  issuedTicket: null,
  summary: null,
  summaryLoading: false, 
  ticketsLoading: false,
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
on(LOAD_ADMIN_SUMMARY, (state) => ({ ...state, summaryLoading: true })),

on(LOAD_ADMIN_SUMMARY_SUCCESS, (state, { summary }) => ({
  ...state, summaryLoading: false, summary
})),
on(LOAD_ADMIN_SUMMARY_FAILURE, (state, { error }) => ({
  ...state, summaryLoading: false, error
})), 

on(LOAD_RECENT_TICKET, (state) => ({
  ...state,
  ticketsLoading: true,
})),

on(LOAD_RECENT_TICKET_SUCCESS, (state, { tickets }) => ({
  ...state,
  ticketsLoading: false,
  tickets,
})),

on(LOAD_RECENT_TICKET_FAILURE, (state, { error }) => ({
  ...state,
  ticketsLoading: false,
  error,
})),
)

