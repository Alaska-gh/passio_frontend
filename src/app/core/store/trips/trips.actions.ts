import { Trip } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const LOAD_CURRENT_TRIP = createAction(
  '[Trips] Load Trip',
   props<{ route: string; origin: string; destination: string; date: string; pricePerSeat: number }>()
)

export const LOAD_CURRENT_TRIP_SUCCESS = createAction(
  '[Trips] Load Trips Success',
  props<{ trip: Trip }>()
)

export const LOAD_CURRENT_TRIP_FAILURE = createAction(
  '[Trips] Load Trips Failure',
   props<{ error: string }>()
)

export const RESET_TRIP = createAction('[Trips] Reset Trip');

