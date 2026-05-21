import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TicketsState, selectAll, selectEntities } from './tickets.reducers';

export const selectTicketsState = createFeatureSelector<TicketsState>('tickets');

export const selectAllTickets = createSelector(selectTicketsState, selectAll);
export const selectTicketsLoading = createSelector(selectTicketsState, (s) => s.loading);
export const selectTicketsPurchasing = createSelector(selectTicketsState, (s) => s.purchasing);
export const selectTicketsVerifying = createSelector(selectTicketsState, (s) => s.verifying);
export const selectVerifyResult = createSelector(selectTicketsState, (s) => s.verifyResult);
export const selectTicketsError = createSelector(selectTicketsState, (s) => s.error);
export const selectSelectedTicketId = createSelector(selectTicketsState, (s) => s.selectedId);
export const selectSelectedTicket = createSelector(
  selectTicketsState,
  selectEntities,
  selectSelectedTicketId,
  (_, entities, id) => (id ? entities[id] : null),
);
export const selectUpcomingTickets = createSelector(selectAllTickets, (tickets) =>
  tickets.filter((t) => t.status === 'active'),
);
export const selectPastTickets = createSelector(selectAllTickets, (tickets) =>
  tickets.filter((t) => t.status === 'used' || t.status === 'expired'),
);
