import { createActionGroup, props } from '@ngrx/store';
import { ToastType } from '@core/services/toast.service';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Show Toast': props<{ message: string; toastType: ToastType }>(),
    'Dismiss Toast': props<{ id: number }>(),
  },
});
