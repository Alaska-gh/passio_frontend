import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Trip } from '@core/interfaces/trip.interface';
import { RecordReturnPayload, RecordReturnResult } from '@core/services/trip.service';

export const TripsActions = createActionGroup({
  source: 'Trips',
  events: {
    'Load Driver Trips': props<{ driverId: string }>(),
    'Load Driver Trips Success': props<{ trips: Trip[] }>(),
    'Load Driver Trips Failure': props<{ error: string }>(),

    'Record Return': props<{ payload: RecordReturnPayload }>(),
    'Record Return Success': props<{ result: RecordReturnResult }>(),
    'Record Return Failure': props<{ error: string }>(),
  },
});
