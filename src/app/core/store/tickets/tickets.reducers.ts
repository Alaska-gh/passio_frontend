import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Ticket } from '@core/interfaces/ticket.interface';
import { VerifyResult } from '@core/services/ticket.service';
import { TicketsActions } from './tickets.action';

export interface TicketsState extends EntityState<Ticket> {
  selectedId: string | null;
  purchasing: boolean;
  verifying: boolean;
  verifyResult: VerifyResult | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Ticket> = createEntityAdapter<Ticket>();

const initialState: TicketsState = adapter.getInitialState({
  selectedId: null,
  purchasing: false,
  verifying: false,
  verifyResult: null,
  loading: false,
  error: null,
});

export const ticketsReducer = createReducer(
  initialState,

  on(TicketsActions.loadMyTickets, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TicketsActions.loadMyTicketsSuccess, (state, { tickets }) =>
    adapter.setAll(tickets, { ...state, loading: false }),
  ),
  on(TicketsActions.loadMyTicketsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TicketsActions.purchaseTicket, (state) => ({
    ...state,
    purchasing: true,
    error: null,
  })),
  on(TicketsActions.purchaseTicketSuccess, (state) => ({
    ...state,
    purchasing: false,
  })),
  on(TicketsActions.purchaseTicketFailure, (state, { error }) => ({
    ...state,
    purchasing: false,
    error,
  })),

  on(TicketsActions.verifyTicket, (state) => ({
    ...state,
    verifying: true,
    verifyResult: null,
  })),
  on(TicketsActions.verifyTicketSuccess, (state, { result }) => ({
    ...state,
    verifying: false,
    verifyResult: result,
  })),
  on(TicketsActions.verifyTicketFailure, (state, { error }) => ({
    ...state,
    verifying: false,
    error,
  })),

  on(TicketsActions.selectTicket, (state, { ticketId }) => ({
    ...state,
    selectedId: ticketId,
  })),
  on(TicketsActions.clearVerifyResult, (state) => ({
    ...state,
    verifyResult: null,
  })),
);

export const { selectAll, selectEntities } = adapter.getSelectors();
