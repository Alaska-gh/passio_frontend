import { HttpErrorResponse } from "@angular/common/http";
import { BusRoute } from "@core/interfaces";
import { createReducer, on } from "@ngrx/store";
import { GET_ACTIVE_ROUTES, GET_ACTIVE_ROUTES_FAILURE, GET_ACTIVE_ROUTES_SUCCESS } from "./route.actions";

export interface activeRouteState{
    loadingRoutes: boolean,
    routes: BusRoute[]
    err: HttpErrorResponse | null
}

export const initialState: activeRouteState = {
    loadingRoutes: false,
    routes: [],
    err: null
}

export const activeRoutesReducer = createReducer(
    initialState,
    on(GET_ACTIVE_ROUTES, ((state) =>({
        ...state,
        loadingRoutes: true
    }))),

    on(GET_ACTIVE_ROUTES_SUCCESS, ((state, {routes}) => ({
        ...state,
        loadingRoutes: false,
        routes
    })
    )),
    on(GET_ACTIVE_ROUTES_FAILURE, ((state, {err}) =>({
        ...state,
        loadingRoutes: false,
        err
    })))
)