import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Bus } from '@core/interfaces/bus.interface';
import { CREATE_BUSS, CREATE_BUSS_FAILURE, CREATE_BUSS_SUCCESS, GET_ALL_BUSSES, GET_ALL_BUSSES_FAILURE, GET_ALL_BUSSES_SUCCESS } from './buses.actions';
import { GET_ACTIVE_ROUTES_SUCCESS } from '../routes/route.actions';

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

  on(GET_ALL_BUSSES, (state) => ({ ...state, loading: true, error: null })),
  on(GET_ALL_BUSSES_SUCCESS, (state, { buses }) =>
    adapter.setAll(buses, { ...state, loading: false }),
  ),
  on(GET_ALL_BUSSES_FAILURE, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CREATE_BUSS, (state) => ({ ...state, loading: true })),
  on(CREATE_BUSS_SUCCESS, (state) => ({ ...state, loading: false })),
  on(CREATE_BUSS_FAILURE, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // on(BusesActions.updateBus, (state) => ({ ...state, loading: true })),
  // on(BusesActions.updateBusSuccess, (state) => ({ ...state, loading: false })),
  // on(BusesActions.updateBusFailure, (state, { error }) => ({
  //   ...state,
  //   loading: false,
  //   error,
  // })),
);

export const { selectAll } = adapter.getSelectors();
