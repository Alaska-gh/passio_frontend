import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(selectAuthState, (s) => s.user);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.loading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
export const selectOtpSent = createSelector(selectAuthState, (s) => s.otpSent);
export const selectAuthInitialized = createSelector(selectAuthState, (s) => s.initialized);
export const selectIsAuthenticated = createSelector(selectCurrentUser, (user) => !!user);
export const selectUserRole = createSelector(selectCurrentUser, (user) => user?.role ?? null);
export const selectUserName = createSelector(selectCurrentUser, (user) => user?.name ?? null);
