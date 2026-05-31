import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RouteService } from "@core/services/route.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { GET_ACTIVE_ROUTES, GET_ACTIVE_ROUTES_FAILURE, GET_ACTIVE_ROUTES_SUCCESS } from "./route.actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";

@Injectable()
export class ActiveRouteEffects{
    private store = inject(Store);
    private http = inject(HttpClient);
    private routeService = inject(RouteService)
    private actions = inject(Actions)


    getActiveRoutes$ = createEffect(() =>{
       return this.actions.pipe(
            ofType(GET_ACTIVE_ROUTES),
            switchMap(() => this.routeService.getActiveRoutes().pipe(
                map((routes) => GET_ACTIVE_ROUTES_SUCCESS({routes})),
                catchError((err) => of(GET_ACTIVE_ROUTES_FAILURE({err})))
            ))
        )
    })
}