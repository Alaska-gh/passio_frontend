import { PrimeNgSeverity } from '@core/interfaces/primeng-severity.enums';
import { Action, createAction, props } from '@ngrx/store';

export const OPEN_CONFIRM_DIALOG = createAction(
  '[Confirm Dialog] Opened',
  props<{
    message: string;
    header: string;
    confirmType: PrimeNgSeverity;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptAction?: Action | Action[];
    rejectAction?: Action | Action[];
    invertButtons?: boolean;
    acceptMethod?: () => void | Promise<void>;
    rejectMethod?: () => void | Promise<void>;
  }>()
);

export const CLOSE_CONFIRM_DIALOG = createAction('[Confirm Dialog] Closed');
