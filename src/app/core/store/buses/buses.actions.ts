import { Bus, Trip } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const LOAD_BUSES = createAction('[Buses] Load Buses');

export const LOAD_BUSES_SUCCESS = createAction('[Buses] Load Buses Success',
  props<{ buses: Bus[] }>());
  
export const LOAD_BUSES_FAILURE = createAction('[Buses] Load Buses Failure',
  props<{ error: string }>());

export const ADD_BUS = createAction('[Buses] Add Bus',
  props<{ bus: Omit<Bus, 'id' | 'queueOrder' | 'status'> }>());

export const ADD_BUS_SUCCESS = createAction('[Buses] Add Bus Success',
  props<{ bus: Bus }>());

export const ADD_BUS_FAILURE = createAction('[Buses] Add Bus Failure',
  props<{ error: string }>());

export const UPDATE_BUS = createAction('[Buses] Update Bus',
  props<{ busId: string; updates: Partial<Omit<Bus, 'id'>> }>());

export const UPDATE_BUS_SUCCESS = createAction('[Buses] Update Bus Success',
  props<{ busId: string; updates: Partial<Omit<Bus, 'id'>> }>());

export const UPDATE_BUS_FAILURE = createAction('[Buses] Update Bus Failure',
  props<{ error: string }>());

export const SET_BUS_ACTIVE = createAction('[Buses] Set Bus Active',
  props<{ busId: string }>());

export const SET_BUS_INACTIVE = createAction('[Buses] Set Bus Inactive',
  props<{ busId: string }>());

export const SET_BUS_STATUS_SUCCESS = createAction('[Buses] Set Bus Status Success');

export const SET_BUS_STATUS_FAILURE = createAction('[Buses] Set Bus Status Failure',
  props<{ error: string }>());

export const LOAD_BUS_TRIP_HISTORY = createAction('[Buses] Load Trip History',
  props<{ busId: string }>());

export const LOAD_BUS_TRIP_HISTORY_SUCCESS = createAction('[Buses] Load Trip History Success',
  props<{ trips: Trip[] }>());
  
export const LOAD_BUS_TRIP_HISTORY_FAILURE = createAction('[Buses] Load Trip History Failure',
  props<{ error: string }>());