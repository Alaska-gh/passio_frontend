import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';
import { schedulesReducer, SchedulesState } from './schedules/schedules.reducers';
import { busesReducer, BusesState } from './buses/buses.reducers';
import { activeRoutesReducer, activeRouteState } from './routes/route.reducer';
import { ticketsReducer, TicketState } from './tickets/tickets.reducers';
import { tripsReducer, TripState } from './trips/trips.reducers';

export interface AppState {
  auth: AuthState;
  schedules: SchedulesState;
  tickets: TicketState
  buses: BusesState;
  trips: TripState;
  routes: activeRouteState
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  schedules: schedulesReducer,
  tickets: ticketsReducer,
  buses: busesReducer,
  trips: tripsReducer,
  routes: activeRoutesReducer
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
