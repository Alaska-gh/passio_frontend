import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TicketState } from './tickets.reducers';

export const selectTicketState = createFeatureSelector<TicketState>('tickets');

export const selectIssuedTicket = createSelector(selectTicketState, s => s.issuedTicket);
export const selectTicketLoading = createSelector(selectTicketState, s => s.loading);
export const selectTicketError = createSelector(selectTicketState, s => s.error);
export const selectSummary = createSelector(selectTicketState, s => s.summary);
export const selectSummaryLoading = createSelector(selectTicketState, s => s.summaryLoading);