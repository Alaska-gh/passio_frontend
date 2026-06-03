import { createAction, props } from '@ngrx/store';
import { User } from '@core/interfaces/user.interface';

export const SEND_OTP = createAction(
  '[Auth] Send OTP',
  props<{ phoneNumber: string }>()
)

export const SEND_OTP_SUCCESS = createAction(
  '[Auth] Send OTP Success'
)

export const SEND_OTP_FAILURE = createAction(
  '[Auth] Send OTP Failure',
  props<{ error: string }>()
)

export const VERIFY_OTP = createAction(
  '[Auth] Verify OTP',
  props<{ code: string }>()
)

export const VERIFY_OTP_SUCCESS = createAction(
  '[Auth] Verify OTP Success',
  props<{ user: User }>()
)

export const VERIFY_OTP_FAILURE = createAction(
  '[Auth] Verify OTP Failure',
  props<{ error: string }>()
)

export const RESEND_OTP = createAction(
  '[Auth] Resend OTP',
  props<{ phoneNumber: string }>()
)

export const RESEND_OTP_SUCCESS = createAction(
  '[Auth] Resend OTP Success'
)

export const RESEND_OTP_FAILURE = createAction(
  '[Auth] Resend OTP Failure',
  props<{ error: string }>()
)

export const USER_AUTHENTICATED = createAction(
  '[Auth] User Authenticated',
  props<{ user: User }>()
)

export const USER_UNAUTHENTICATED = createAction(
  '[Auth] User Unauthenticated',
)

export const UPDATE_USER_PROFILE = createAction(
  '[Auth] Update User Profile',
  props<{ uid: string; name?: string; email?: string }>()
)
export const UPDATE_USER_PROFILE_SUCCESS = createAction(
  '[Auth] Update User Profile Success',
)

export const UPDATE_USER_PROFILE_FAILURE = createAction(
  '[Auth] Load User Profile Failure',
  props<{ error: string }>()
)

export const LOAD_USER_PROFILE = createAction(
  '[Auth] Load User Profile',
  props<{ uid: string; name?: string; email?: string }>()
)

export const LOAD_USER_PROFILE_SUCCESS = createAction(
  '[Auth] Load User Profile Success',
  props<{user: User}>()
)

export const LOAD_USER_PROFILE_FAILURE = createAction(
  '[Auth] Update User Profile Failure',
  props<{ error: string }>()
)

export const SIGNOUT = createAction(
  '[Auth] Sign Out',
)

export const SIGNOUT_SUCCESS = createAction(
  '[Auth] Sign Out Success',
)

export const SIGNOUT_FAILURE = createAction(
  '[Auth] Sign Out Failure',
)