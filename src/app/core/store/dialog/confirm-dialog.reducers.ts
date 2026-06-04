import { createReducer, on } from '@ngrx/store';
import { OPEN_CONFIRM_DIALOG, CLOSE_CONFIRM_DIALOG } from './confirm-dialog.actions';

export interface ConfirmDialogState {
  isOpen: boolean;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
};

export const confirmDialogReducer = createReducer(
  initialState,
  on(OPEN_CONFIRM_DIALOG, (state) => ({ ...state, isOpen: true })),
  on(CLOSE_CONFIRM_DIALOG, (state) => ({ ...state, isOpen: false }))
);
