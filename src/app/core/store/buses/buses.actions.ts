import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Bus } from '@core/interfaces/bus.interface';

export const BusesActions = createActionGroup({
  source: 'Buses',
  events: {
    'Load Buses': emptyProps(),
    'Load Buses Success': props<{ buses: Bus[] }>(),
    'Load Buses Failure': props<{ error: string }>(),

    'Create Bus': props<{ bus: Omit<Bus, 'id' | 'createdAt'> }>(),
    'Create Bus Success': emptyProps(),
    'Create Bus Failure': props<{ error: string }>(),

    'Update Bus': props<{ id: string; changes: Partial<Bus> }>(),
    'Update Bus Success': emptyProps(),
    'Update Bus Failure': props<{ error: string }>(),
  },
});
