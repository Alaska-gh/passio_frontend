import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Trip } from '@core/interfaces/trip.interface';
import { TripsActions } from './trips.actions';
import { RecordReturnResult } from '@core/services/trip.service';

export interface TripsState extends EntityState<Trip> {
  recording: boolean;
  returnResult: RecordReturnResult | null;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Trip> = createEntityAdapter<Trip>();

const initialState: TripsState = adapter.getInitialState({
  recording: false,
  returnResult: null,
  loading: false,
  error: null,
});

export const tripsReducer = createReducer(
  initialState,

  on(TripsActions.loadDriverTrips, (state) => ({ ...state, loading: true, error: null })),
  on(TripsActions.loadDriverTripsSuccess, (state, { trips }) =>
    adapter.setAll(trips, { ...state, loading: false }),
  ),
  on(TripsActions.loadDriverTripsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TripsActions.recordReturn, (state) => ({
    ...state,
    recording: true,
    error: null,
    returnResult: null,
  })),
  on(TripsActions.recordReturnSuccess, (state, { result }) => ({
    ...state,
    recording: false,
    returnResult: result,
  })),
  on(TripsActions.recordReturnFailure, (state, { error }) => ({
    ...state,
    recording: false,
    error,
  })),
);

export const { selectAll } = adapter.getSelectors();
