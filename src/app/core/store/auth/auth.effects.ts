import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from, fromEventPattern } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import {
  Auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { AuthActions } from './auth.actions';
import { User, UserRole } from '@core/interfaces/user.interface';
import { UiActions } from '../ui/ui.actions';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private authService = inject(AuthService);

  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // ── Listen to Firebase auth state on app start ──────────
  initAuthListener$ = createEffect(() =>
    fromEventPattern(
      (handler) => onAuthStateChanged(this.auth, handler),
      (_, unsubscribe) => unsubscribe,
    ).pipe(
      switchMap(async (firebaseUser: any) => {
        if (!firebaseUser) {
          return AuthActions.userUnauthenticated();
        }

        const user = await this.loadProfile(firebaseUser.uid);

        return user ? AuthActions.userAuthenticated({ user }) : AuthActions.userUnauthenticated();
      }),
    ),
  );

  // ── Send OTP ─────────────────────────────────────────────
  sendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendOtp),
      switchMap(({ phoneNumber }) =>
        this.authService.sendOtp(phoneNumber).pipe(
          map((res) => {
            console.log(res);

            return AuthActions.sendOtpSuccess();
          }),
          catchError((err) =>
            of(AuthActions.sendOtpFailure({ error: this.friendlyAuthError(err) })),
          ),
        ),
      ),
    ),
  );

  sendOtpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sendOtpSuccess),
        tap(() => this.router.navigate(['/auth/verify'])),
      ),
    { dispatch: false },
  );

  sendOtpFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendOtpFailure),
      map(({ error }) => UiActions.showToast({ message: error, toastType: 'error' })),
    ),
  );

  // ── Verify OTP ───────────────────────────────────────────
  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyOtp),
      switchMap(({ code }) =>
        from(this.doVerifyOtp(code)).pipe(
          map((user) => AuthActions.verifyOtpSuccess({ user })),
          catchError((err) =>
            of(AuthActions.verifyOtpFailure({ error: this.friendlyAuthError(err) })),
          ),
        ),
      ),
    ),
  );

  verifyOtpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyOtpSuccess),
      tap(({ user }) => {
        sessionStorage.removeItem('rgh_pending_phone');
        this.redirectByRole(user.role);
      }),
      map(() => UiActions.showToast({ message: 'Welcome to RouteGH!', toastType: 'success' })),
    ),
  );

  verifyOtpFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyOtpFailure),
      map(({ error }) => UiActions.showToast({ message: error, toastType: 'error' })),
    ),
  );

  // ── Sign out ─────────────────────────────────────────────
  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(() =>
        from(signOut(this.auth)).pipe(
          map(() => AuthActions.signOutSuccess()),
          catchError(() => of(AuthActions.signOutSuccess())),
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

  // ── Private helpers ──────────────────────────────────────
  // private async doSendOtp(phoneNumber: string): Promise<void> {
  //   this.recaptchaVerifier?.clear();
  //   const btn = document.getElementById('otp-btn') as HTMLElement;
  //   this.recaptchaVerifier = new RecaptchaVerifier(this.auth, btn, {
  //     size: 'invisible',
  //     callback: () => {},
  //   });
  //   this.confirmationResult = await signInWithPhoneNumber(
  //     this.auth,
  //     phoneNumber,
  //     this.recaptchaVerifier,
  //   );
  //   sessionStorage.setItem('rgh_pending_phone', phoneNumber);
  //   console.log(this.confirmationResult);
  //   console.log(this.recaptchaVerifier);
  //   console.log(phoneNumber);
  // }

  private async doVerifyOtp(code: string): Promise<User> {
    if (!this.confirmationResult) {
      throw new Error('No active OTP session.');
    }
    const credential = await this.confirmationResult.confirm(code);
    const uid = credential.user.uid;
    const phone = credential.user.phoneNumber ?? '';

    // Create profile if first login
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        phone,
        role: 'customer' as UserRole,
        createdAt: serverTimestamp(),
      });
    }

    const profile = await this.loadProfile(uid);
    if (!profile) throw new Error('Could not load user profile.');
    return profile;
  }

  private async loadProfile(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    if (!snap.exists()) return null;
    return { uid, ...snap.data() } as User;
  }

  private redirectByRole(role: UserRole): void {
    const destinations: Record<UserRole, string> = {
      customer: '/customer/routes',
      admin: '/admin/dashboard',
      driver: '/driver/schedule',
      conductor: '/conductor/scanner',
    };
    this.router.navigate([destinations[role]]);
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
