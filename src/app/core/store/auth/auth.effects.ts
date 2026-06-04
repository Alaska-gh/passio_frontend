import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, defer } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import * as AuthActions from './auth.actions';
import { User } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';
import { SHOW_TOAST } from '../toast/toast.actions';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private authService = inject(AuthService);

  private injector = inject(Injector);
  private store = inject(Store);

  // Listen to Firebase auth state on app start
  initAuthListener$ = createEffect(() =>
    defer(() =>
    runInInjectionContext(this.injector, () => authState(this.auth))
    ).pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) {
          return of(AuthActions.USER_UNAUTHENTICATED());
        }
        return this.loadProfile(firebaseUser.uid).pipe(
          map((user) =>
            user ? AuthActions.USER_AUTHENTICATED({ user }) : AuthActions.USER_UNAUTHENTICATED(),
          ),
        );
      }),
    ),
  );

  // Send OTP
  sendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SEND_OTP),
      switchMap(({ phoneNumber }) =>
        this.authService.sendOtp(phoneNumber).pipe(
          map(() => {
           this.store.dispatch(
             SHOW_TOAST({
              title: 'OTP Sent',
              message: 'OTP sent successfully',
              severity: ToastSeverity.SUCCESS,
            })
           )
            return AuthActions.SEND_OTP_SUCCESS();
          }),
          catchError((err) =>
            of(AuthActions.SEND_OTP_FAILURE({ error: this.friendlyAuthError(err) })),
          ),
        ),
      ),
    ),
  );

  // Verify OTP
  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.VERIFY_OTP),
      switchMap(({ code }) =>
        this.authService.verifyOtp(code).pipe(
          map((user) => {            
           this.store.dispatch(
             SHOW_TOAST({
              title: 'OTP Verified',
              message: 'Your account is verified successfully',
              severity: ToastSeverity.SUCCESS,
            }))

            return AuthActions.VERIFY_OTP_SUCCESS({ user });
          }),
          catchError((err) => {
            SHOW_TOAST({
              title: 'Failed To Verify OTP',
              message: err,
              severity: ToastSeverity.ERROR,
            });
            return of(AuthActions.VERIFY_OTP_FAILURE({ error: this.friendlyAuthError(err) }));
          }),
        ),
      ),
    ),
  );

  resendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.RESEND_OTP),
      switchMap(({ phoneNumber }) =>
        this.authService.sendOtp(phoneNumber).pipe(
          map(() => {            
           this.store.dispatch(
             SHOW_TOAST({
              title: 'Resent OTP',
              message: `We have successfully resent the OTP to ${phoneNumber}`,
              severity:ToastSeverity.SUCCESS,
            }))
            return AuthActions.RESEND_OTP_SUCCESS();
          }),
          catchError((err) => {
           this.store.dispatch(
             SHOW_TOAST({
              title:'Failed To Resend',
              message: `failled to resent OTP to ${phoneNumber}. Please try again`,
              severity: ToastSeverity.ERROR,
            })
           )
            return of(AuthActions.RESEND_OTP_FAILURE({ error: this.friendlyAuthError(err) }));
          }),
        ),
      ),
    ),
  );
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UPDATE_USER_PROFILE),
      switchMap(({ uid, name, email }) =>
        this.authService.updateProfile(uid, { name, email }).pipe(
          map(() => AuthActions.UPDATE_USER_PROFILE_SUCCESS()),
          catchError((err) => of(AuthActions.UPDATE_USER_PROFILE_FAILURE({ error: err.message }))),
        ),
      ),
    ),
  );

  // updateProfileSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.updateProfileSuccess),
  //     map(() =>
  //      this.store.dispatch(
  //        SHOW_TOAST({
  //         title: '',
  //         message: 'Profile updated successfully',
  //         severity: ToastSeverity.SUCCESS,
  //       }))
  //     ),
  //   ),
  // );
  // Sign out
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNOUT),
      switchMap(() =>
        this.authService.signOut().pipe(
          map(() => {
           this.store.dispatch(
             SHOW_TOAST({
              title: 'Signed Out',
              message: `We have successfully Signed Out`,
              severity:ToastSeverity.SUCCESS,
            }))
            return AuthActions.SIGNOUT_SUCCESS();
          }),
          catchError(() => of(AuthActions.SIGNOUT_FAILURE())),
        ),
      ),
    ),
  );

  signOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SIGNOUT_SUCCESS),
        tap(() => this.router.navigate(['/auth/login'])),
      ),
    { dispatch: false },
  );

  private loadProfile(uid: string): Observable<User | null> {
    return defer(() =>
      runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, 'users', uid))),
    ).pipe(
      map((snap) => {
        if (!snap.exists()) return null;
        return { uid, ...snap.data() } as User;
      }),
    );
  }

  navigateToVerify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SEND_OTP_SUCCESS),
        tap(() => this.router.navigate(['/auth/verify']))
      ),
    { dispatch: false }
  );

  private friendlyAuthError(err: any): string {
    const code = err?.code ?? '';
    if (code === 'auth/invalid-phone-number') return 'Invalid phone number format.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes.';
    if (code === 'auth/invalid-verification-code') return 'Incorrect code. Please try again.';
    if (code === 'auth/code-expired') return 'Code expired. Please request a new one.';
    return err?.message ?? 'Authentication failed. Please try again.';
  }
}
