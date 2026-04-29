import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@core/interfaces/user.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Send OTP
    'Send Otp': props<{ phoneNumber: string }>(),
    'Send Otp Success': emptyProps(),
    'Send Otp Failure': props<{ error: string }>(),

    // Verify OTP
    'Verify Otp': props<{ code: string }>(),
    'Verify Otp Success': props<{ user: User }>(),
    'Verify Otp Failure': props<{ error: string }>(),

    'Resend Otp': props<{ phoneNumber: string }>(),
    'Resend Otp Success': emptyProps(),
    'Resend Otp Failure': props<{ error: string }>(),

    // Auth state change (Firebase listener)
    'User Authenticated': props<{ user: User }>(),
    'User Unauthenticated': emptyProps(),

    'Update Profile': props<{ uid: string; name?: string; email?: string }>(),
    'Update Profile Success': emptyProps(),
    'Update Profile Failure': props<{ error: string }>(),

    // Sign out
    'Sign Out': emptyProps(),
    'Sign Out Success': emptyProps(),
    'Sign Out Failure': emptyProps(),

    // Load profile
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ user: User }>(),
    'Load Profile Failure': props<{ error: string }>(),
  },
});
