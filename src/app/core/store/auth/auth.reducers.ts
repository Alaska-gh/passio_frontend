import { createReducer, on } from '@ngrx/store';
import { User } from '@core/interfaces/user.interface';
import { AuthActions } from './auth.actions';

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

  // Send OTP
  on(AuthActions.sendOtp, (state) => ({
    ...state,
    loading: true,
    error: null,
    otpSent: false,
  })),
  on(AuthActions.sendOtpSuccess, (state) => {
    console.log('otp sent');

    return {
      ...state,
      loading: false,
      otpSent: true,
    };
  }),
  on(AuthActions.sendOtpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    otpSent: false,
  })),

  // Verify OTP
  on(AuthActions.verifyOtp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.verifyOtpSuccess, (state, { user }) => {
    console.log(user);

    return {
      ...state,
      loading: false,
      user,
      error: null,
    };
  }),
  on(AuthActions.verifyOtpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Firebase auth state listener
  on(AuthActions.userAuthenticated, (state, { user }) => ({
    ...state,
    user,
    initialized: true,
    loading: false,
  })),
  on(AuthActions.userUnauthenticated, (state) => ({
    ...state,
    user: null,
    initialized: true,
    loading: false,
  })),

  on(AuthActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.updateProfileSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Sign out
  on(AuthActions.signOut, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.signOutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    otpSent: false,
  })),

  // Load profile
  on(AuthActions.loadProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
