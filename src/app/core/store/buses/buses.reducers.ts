import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Bus } from '@core/interfaces/bus.interface';
import { BusesActions } from './buses.actions';

export interface BusesState extends EntityState<Bus> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Bus> = createEntityAdapter<Bus>();

const initialState: BusesState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const busesReducer = createReducer(
  initialState,

  on(BusesActions.loadBuses, (state) => ({ ...state, loading: true, error: null })),
  on(BusesActions.loadBusesSuccess, (state, { buses }) =>
    adapter.setAll(buses, { ...state, loading: false }),
  ),
  on(BusesActions.loadBusesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(BusesActions.createBus, (state) => ({ ...state, loading: true })),
  on(BusesActions.createBusSuccess, (state) => ({ ...state, loading: false })),
  on(BusesActions.createBusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(BusesActions.updateBus, (state) => ({ ...state, loading: true })),
  on(BusesActions.updateBusSuccess, (state) => ({ ...state, loading: false })),
  on(BusesActions.updateBusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export const { selectAll } = adapter.getSelectors();
