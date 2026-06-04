import { createReducer, on } from '@ngrx/store';
import { User } from '@core/interfaces/user.interface';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  otpSent: boolean;
  error: string | null;
  initialized: boolean;
  isNewUser: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  otpSent: false,
  error: null,
  initialized: false,
  isNewUser: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.SEND_OTP, (state) => ({
    ...state,
    loading: true,
    error: null,
    otpSent: false,
  })),

  on(AuthActions.SEND_OTP_SUCCESS, (state) => ({
   ...state,
      loading: false,
      otpSent: true,
  })),

  on(AuthActions.SEND_OTP_FAILURE, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    otpSent: false,
  })),

  on(AuthActions.VERIFY_OTP, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.VERIFY_OTP_SUCCESS, (state, { user }) => {
    console.log(user);
    return {
      ...state,
      loading: false,
      user,
      error: null,
    };
  }),

  on(AuthActions.VERIFY_OTP_FAILURE, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.USER_AUTHENTICATED, (state, { user }) => ({
    ...state,
    user,
    initialized: true,
    loading: false,
  })),

  on(AuthActions.USER_UNAUTHENTICATED, (state) => ({
    ...state,
    user: null,
    initialized: true,
    loading: false,
  })),

  on(AuthActions.UPDATE_USER_PROFILE, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.UPDATE_USER_PROFILE_SUCCESS, (state) => ({
    ...state,
    loading: false,
  })),

  on(AuthActions.UPDATE_USER_PROFILE_FAILURE, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.SIGNOUT, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.SIGNOUT_SUCCESS, (state) => ({
    ...state,
    user: null,
    loading: false,
    otpSent: false,
  })),

  on(AuthActions.LOAD_USER_PROFILE, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.LOAD_USER_PROFILE_SUCCESS, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  
  on(AuthActions.LOAD_USER_PROFILE_FAILURE, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
