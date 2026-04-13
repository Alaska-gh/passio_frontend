import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Schedule } from '@core/interfaces/schedule.interface';
import { SchedulesActions } from './schedules.actions';

export interface SchedulesState extends EntityState<Schedule> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Schedule> = createEntityAdapter<Schedule>();

const initialState: SchedulesState = adapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
});

export const schedulesReducer = createReducer(
  initialState,

  on(SchedulesActions.loadSchedules, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SchedulesActions.loadSchedulesSuccess, (state, { schedules }) =>
    adapter.setAll(schedules, { ...state, loading: false, error: null }),
  ),
  on(SchedulesActions.loadSchedulesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(SchedulesActions.selectSchedule, (state, { scheduleId }) => ({
    ...state,
    selectedId: scheduleId,
  })),
  on(SchedulesActions.clearSelected, (state) => ({
    ...state,
    selectedId: null,
  })),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
