import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Trip } from '@core/interfaces/trip.interface';
import { Ticket } from '@core/interfaces';
import { LOAD_CURRENT_TRIP, LOAD_CURRENT_TRIP_FAILURE, LOAD_CURRENT_TRIP_SUCCESS, RESET_TRIP } from './trips.actions';
export interface TripState {
  currentTrip: Trip | null;
  issuedTicket: Ticket | null;
  loading: boolean;
  tripLoading: boolean;
  error: string | null;
}

export const initialTicketState: TripState = {
  currentTrip: null,
  issuedTicket: null,
  loading: false,
  tripLoading: false,
  error: null,
};

export const tripsReducer = createReducer(
  initialTicketState,

  on(LOAD_CURRENT_TRIP, (state) => ({
    ...state, tripLoading: true, error: null, currentTrip: null
  })),

  on(LOAD_CURRENT_TRIP_SUCCESS, (state, { trip }) => ({
    ...state, tripLoading: false, currentTrip: trip
  })),

  on(LOAD_CURRENT_TRIP_FAILURE, (state, { error }) => ({
    ...state, tripLoading: false, error
  })),

  on(RESET_TRIP, (state) => ({
  ...state, currentTrip: null, tripLoading: false, tripError: null,
}))
);
