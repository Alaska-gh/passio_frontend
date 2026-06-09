import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BusState } from './buses.reducers';

export const selectBusesState = createFeatureSelector<BusState>('buses');

export const selectAllBuses = createSelector(selectBusesState, (s) => s.buses);
export const selectBusesLoading = createSelector(selectBusesState, (s) => s.loading);
export const selectBusesError = createSelector(selectBusesState, (s) => s.error);
export const selectSelectedBusTripHistory = createSelector(selectBusesState, (s) => s.selectedBusTripHistory);
export const selectHistoryLoading = createSelector(selectBusesState, (s) => s.historyLoading);
export const selectActiveBuses = createSelector(selectAllBuses, (buses) =>
  buses.filter((b) => b.status === 'active'),
);
export const selectQueuedBuses = createSelector(
  selectAllBuses,
  (buses) => buses
    .filter(bus => bus)
    .sort((a, b) => (a.queueOrder ?? 999) - (b.queueOrder ?? 999))
    .slice(0, 10)
);
