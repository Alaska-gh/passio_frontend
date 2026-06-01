import { Bus, Ticket, Trip } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const LOAD_TRIP = createAction(
  '[TRIPS] Load Trip',
   props<{ route: string; origion: string; destination: string; date: string; time: string; pricePerSeat: number }>()
)
export const LOAD_TRIPS_SUCCESS = createAction(
  '[TRIPS] Load Trips Success',
  props<{ trip: Trip }>()
)
export const LOAD_TRIPS_FAILURE = createAction(
  '[TRIPS] Load Trips Failure',
   props<{ error: string }>()
)

