import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, defer } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthActions } from './auth.actions';
import { User } from '@core/interfaces/user.interface';
import { AuthService } from '@core/services/auth.service';
import { SHOW_TOAST } from '../toast/toast.actions';
import { ToastSeverity } from '@core/interfaces/primeng-severity.enums';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private authService = inject(AuthService);

  private injector = inject(Injector);

  // Listen to Firebase auth state on app start
  initAuthListener$ = createEffect(() =>
    defer(() => authState(this.auth)).pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) {
          return of(AuthActions.userUnauthenticated());
        }
        return this.loadProfile(firebaseUser.uid).pipe(
          map((user) =>
            user ? AuthActions.userAuthenticated({ user }) : AuthActions.userUnauthenticated(),
          ),
        );
      }),
    ),
  );

  // Send OTP
  sendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendOtp),
      switchMap(({ phoneNumber }) =>
        this.authService.sendOtp(phoneNumber).pipe(
          map(() => {
            SHOW_TOAST({
              title: '',
              message: 'OTP sent successfully',
              severity: ToastSeverity.SUCCESS,
            });
            return AuthActions.sendOtpSuccess();
          }),
          catchError((err) =>
            of(AuthActions.sendOtpFailure({ error: this.friendlyAuthError(err) })),
          ),
        ),
      ),
    ),
  );

  // Verify OTP
  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyOtp),
      switchMap(({ code }) =>
        this.authService.verifyOtp(code).pipe(
          map((user) => {
            SHOW_TOAST({
              title: '',
              message: 'Your account is verified successfully',
              severity: ToastSeverity.SUCCESS,
            });

            return AuthActions.verifyOtpSuccess({ user });
          }),
          catchError((err) => {
            SHOW_TOAST({
              title: '',
              message: err,
              severity: ToastSeverity.ERROR,
            });
            return of(AuthActions.verifyOtpFailure({ error: this.friendlyAuthError(err) }));
          }),
        ),
      ),
    ),
  );

  resendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resendOtp),
      switchMap(({ phoneNumber }) =>
        this.authService.sendOtp(phoneNumber).pipe(
          map(() => {
            SHOW_TOAST({
              title: '',
              message: `We have successfully resent the OTP to ${phoneNumber}`,
              severity:ToastSeverity.SUCCESS,
            });
            return AuthActions.resendOtpSuccess();
          }),
          catchError((err) => {
            SHOW_TOAST({
              title:'',
              message: `failled to resent OTP to ${phoneNumber}. Please try again`,
              severity: ToastSeverity.ERROR,
            });
            return of(AuthActions.resendOtpFailure({ error: this.friendlyAuthError(err) }));
          }),
        ),
      ),
    ),
  );
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      switchMap(({ uid, name, email }) =>
        this.authService.updateProfile(uid, { name, email }).pipe(
          map(() => AuthActions.updateProfileSuccess()),
          catchError((err) => of(AuthActions.updateProfileFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfileSuccess),
      map(() =>
        SHOW_TOAST({
          title: '',
          message: 'Profile updated successfully',
          severity: ToastSeverity.SUCCESS,
        }),
      ),
    ),
  );
  // Sign out
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(() =>
        this.authService.signOut().pipe(
          map(() => AuthActions.signOutSuccess()),
          catchError(() => of(AuthActions.signOutFailure())),
        ),
      ),
    ),
  );

  signOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOutSuccess),
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

  private friendlyAuthError(err: any): string {
    const code = err?.code ?? '';
    if (code === 'auth/invalid-phone-number') return 'Invalid phone number format.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes.';
    if (code === 'auth/invalid-verification-code') return 'Incorrect code. Please try again.';
    if (code === 'auth/code-expired') return 'Code expired. Please request a new one.';
    return err?.message ?? 'Authentication failed. Please try again.';
  }
}
