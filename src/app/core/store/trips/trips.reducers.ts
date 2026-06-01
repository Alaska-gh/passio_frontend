import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Trip } from '@core/interfaces/trip.interface';
import { Ticket } from '@core/interfaces';
import {  LOAD_TRIP, LOAD_TRIPS_FAILURE, LOAD_TRIPS_SUCCESS } from './trips.actions';
import { adapter } from '../schedules/schedules.reducers';
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

    on(LOAD_TRIP, (state) => ({
    ...state, tripLoading: true, error: null, currentTrip: null
  })),

  on(LOAD_TRIPS_SUCCESS, (state, { trip }) => {
    console.log(trip);
    
  return {
    ...state, tripLoading: false, currentTrip: trip
  }}),

  on(LOAD_TRIPS_FAILURE, (state, { error }) => ({
    ...state, tripLoading: false, error
  })),
);

export const { selectAll } = adapter.getSelectors();
