import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SchedulesActions } from './schedules.actions';
import { ScheduleService } from '@core/services/schedule.service';

@Injectable()
export class SchedulesEffects {
  private actions$ = inject(Actions);
  private scheduleService = inject(ScheduleService);

  loadSchedules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SchedulesActions.loadSchedules),
      switchMap(({ date, routeId }) => {
        const obs$ = routeId
          ? this.scheduleService.getSchedulesByRoute(routeId, date)
          : this.scheduleService.getSchedulesByDate(date);

        return obs$.pipe(
          map((schedules) => SchedulesActions.loadSchedulesSuccess({ schedules })),
          catchError((err) => of(SchedulesActions.loadSchedulesFailure({ error: err.message }))),
        );
      }),
    ),
  );
}
