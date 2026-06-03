import { createFeatureSelector, createSelector } from "@ngrx/store";
import { activeRouteState } from "./route.reducer";

export const selectActiveRouteState = createFeatureSelector<activeRouteState>('routes');

export const selectActiveRoutes = createSelector(
    selectActiveRouteState, (state) =>  state.routes
)

export const selectActiveRoutesLoading = createSelector(
    selectActiveRouteState, (state) =>  state.loadingRoutes
)

export const selectActiveRoutesErrors = createSelector(
    selectActiveRouteState, (state) =>  state.err
)