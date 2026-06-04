import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Bus } from '@core/interfaces/bus.interface';

export const GET_ALL_BUSSES = createAction(
  '[Busses] Get All Busses'
)
export const GET_ALL_BUSSES_SUCCESS = createAction(
  '[Busses] Get All Busses Success',
  props<{ buses: Bus[] }>()
)
export const GET_ALL_BUSSES_FAILURE = createAction(
  '[Busses] Get All Busses Failure',
  props<{ error: string }>()
)
export const CREATE_BUSS = createAction(
  '[Busses] Create Buss',
  props<{ bus: Omit<Bus, 'id' | 'createdAt'> }>()
)
export const CREATE_BUSS_SUCCESS = createAction(
  '[Busses] Create Buss Success'
)
export const CREATE_BUSS_FAILURE = createAction(
  '[Busses] Create Buss Failure',
  props<{ error: string }>()
)