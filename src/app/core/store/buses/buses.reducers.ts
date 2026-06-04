import { Bus, Trip } from "@core/interfaces";
import { createReducer, on } from "@ngrx/store";
import { ADD_BUS, ADD_BUS_FAILURE, ADD_BUS_SUCCESS, LOAD_BUS_TRIP_HISTORY, LOAD_BUS_TRIP_HISTORY_FAILURE, LOAD_BUS_TRIP_HISTORY_SUCCESS, LOAD_BUSES, LOAD_BUSES_FAILURE, LOAD_BUSES_SUCCESS, SET_BUS_STATUS_FAILURE, SET_BUS_STATUS_SUCCESS, UPDATE_BUS_SUCCESS } from "./buses.actions";

// buses.reducer.ts
export interface BusState {
  buses: Bus[];
  selectedBusTripHistory: Trip[];
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
}

export const initialBusState: BusState = {
  buses: [],
  selectedBusTripHistory: [],
  loading: false,
  historyLoading: false,
  error: null,
};

export const busesReducer = createReducer(
  initialBusState,

  on(LOAD_BUSES, (state) => ({ ...state, loading: true, error: null })),

  on(LOAD_BUSES_SUCCESS, (state, { buses }) => ({ ...state, loading: false, buses })),

  on(LOAD_BUSES_FAILURE, (state, { error }) => ({ ...state, loading: false, error })),

  on(ADD_BUS, (state) => ({ ...state, loading: true })),

  on(ADD_BUS_SUCCESS, (state, { bus }) => ({
    ...state, loading: false,
    buses: [...state.buses, bus].sort((a, b) => (a.queueOrder ?? 0) - (b.queueOrder ?? 0))
  })),

  on(ADD_BUS_FAILURE, (state, { error }) => ({ ...state, loading: false, error })),

  on(UPDATE_BUS_SUCCESS, (state, { busId, updates }) => ({
    ...state,
    buses: state.buses.map(b => b.id === busId ? { ...b, ...updates } : b)
  })),

  on(SET_BUS_STATUS_SUCCESS, (state) => ({ ...state, loading: false })),

  on(SET_BUS_STATUS_FAILURE, (state, { error }) => ({ ...state, loading: false, error })),

  on(LOAD_BUS_TRIP_HISTORY, (state) => ({ ...state, historyLoading: true })),

  on(LOAD_BUS_TRIP_HISTORY_SUCCESS, (state, { trips }) => ({
    ...state, historyLoading: false, selectedBusTripHistory: trips
  })),
  
  on(LOAD_BUS_TRIP_HISTORY_FAILURE, (state, { error }) => ({
    ...state, historyLoading: false, error
  })),
);