import { createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UiState {
  toasts: ToastMessage[];
}

const initialState: UiState = { toasts: [] };

let nextId = 0;

export const uiReducer = createReducer(
  initialState,

  on(UiActions.showToast, (state, { message, toastType }) => ({
    ...state,
    toasts: [...state.toasts, { id: nextId++, message, type: toastType }],
  })),

  on(UiActions.dismissToast, (state, { id }) => ({
    ...state,
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
);
