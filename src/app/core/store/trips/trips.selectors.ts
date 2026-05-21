import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TripsState, selectAll } from './trips.reducers';

export const selectTripsState = createFeatureSelector<TripsState>('trips');
export const selectAllTrips = createSelector(selectTripsState, selectAll);
export const selectTripsLoading = createSelector(selectTripsState, (s) => s.loading);
export const selectTripsRecording = createSelector(selectTripsState, (s) => s.recording);
export const selectReturnResult = createSelector(selectTripsState, (s) => s.returnResult);
export const selectTripsError = createSelector(selectTripsState, (s) => s.error);
export const selectActiveTrip = createSelector(
  selectAllTrips,
  (trips) => trips.find((t) => t.status === 'in_progress') ?? null,
);
