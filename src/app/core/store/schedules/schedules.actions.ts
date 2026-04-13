import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schedule } from '@core/interfaces/schedule.interface';

export const SchedulesActions = createActionGroup({
  source: 'Schedules',
  events: {
    'Load Schedules': props<{ date: string; routeId?: string }>(),
    'Load Schedules Success': props<{ schedules: Schedule[] }>(),
    'Load Schedules Failure': props<{ error: string }>(),

    'Select Schedule': props<{ scheduleId: string }>(),
    'Clear Selected': emptyProps(),
  },
});
