import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';
import { schedulesReducer, SchedulesState } from './schedules/schedules.reducers';
import { ticketsReducer, TicketsState } from './tickets/tickets.reducers';
import { busesReducer, BusesState } from './buses/buses.reducers';
import { tripsReducer, TripsState } from './trips/trips.reducers';
import { activeRoutesReducer, activeRouteState } from './routes/route.reducer';

export interface AppState {
  auth: AuthState;
  schedules: SchedulesState;
  tickets: TicketsState;
  buses: BusesState;
  trips: TripsState;
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
