import { HttpErrorResponse } from "@angular/common/http";
import { Bus, BusRoute } from "@core/interfaces";
import { createAction, props } from "@ngrx/store";

export const GET_ACTIVE_ROUTES = createAction(
    '[Customer Routes] Get Active Routes',
)
export const GET_ACTIVE_ROUTES_SUCCESS = createAction(
    '[Customer Routes] Get Active Routes Success',
    props<{routes: BusRoute[]}>()
)

export const GET_ACTIVE_ROUTES_FAILURE= createAction(
    '[Customer Routes] Get Active RoutesFailure',
    props<{err: HttpErrorResponse}>()
)
