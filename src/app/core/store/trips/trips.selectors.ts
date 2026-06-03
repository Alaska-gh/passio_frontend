import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TripState } from './trips.reducers';

export const selectTripState = createFeatureSelector<TripState>('trips');

export const selectCurrentTrip = createSelector(selectTripState, s => s.currentTrip);
export const selectTicketLoading = createSelector(selectTripState, s => s.loading);
export const selectTripLoading = createSelector(selectTripState, s => s.tripLoading);
export const selectTicketError = createSelector(selectTripState, s => s.error);