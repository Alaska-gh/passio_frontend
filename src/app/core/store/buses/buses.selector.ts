import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BusesState, selectAll } from './buses.reducers';

export const selectBusesState = createFeatureSelector<BusesState>('buses');
export const selectAllBuses = createSelector(selectBusesState, selectAll);
export const selectBusesLoading = createSelector(selectBusesState, (s) => s.loading);
export const selectBusesError = createSelector(selectBusesState, (s) => s.error);
export const selectActiveBuses = createSelector(selectAllBuses, (buses) =>
  buses.filter((b) => b.status === 'active'),
);
