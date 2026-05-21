import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SchedulesState, selectAll, selectEntities } from './schedules.reducers';

export const selectSchedulesState = createFeatureSelector<SchedulesState>('schedules');

export const selectAllSchedules = createSelector(selectSchedulesState, selectAll);
export const selectSchedulesLoading = createSelector(selectSchedulesState, (s) => s.loading);
export const selectSchedulesError = createSelector(selectSchedulesState, (s) => s.error);
export const selectSelectedScheduleId = createSelector(selectSchedulesState, (s) => s.selectedId);
export const selectSelectedSchedule = createSelector(
  selectSchedulesState,
  selectEntities,
  selectSelectedScheduleId,
  (_, entities, id) => (id ? entities[id] : null),
);
export const selectAvailableSchedules = createSelector(selectAllSchedules, (schedules) =>
  schedules.filter((s) => s.seatsRemaining > 0),
);
