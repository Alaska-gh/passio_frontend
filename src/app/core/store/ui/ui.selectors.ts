import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.reducers';

export const selectUiState = createFeatureSelector<UiState>('ui');
export const selectToasts = createSelector(selectUiState, (s) => s.toasts);
