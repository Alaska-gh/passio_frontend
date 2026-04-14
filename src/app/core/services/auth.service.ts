import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, switchMap, of, tap, catchError, throwError } from 'rxjs';
import { User, UserRole } from '@core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  /**
   * Emits the current Firebase user on every auth state change.
   * Null means signed out.
   */
  readonly firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

  /**
   * Emits the full Firestore user profile whenever auth state changes.
   * Null when signed out or profile not yet created.
   */
  readonly currentUser$: Observable<User | null> = this.firebaseUser$.pipe(
    switchMap((firebaseUser) => {
      if (!firebaseUser) return of(null);
      return docData(doc(this.firestore, 'users', firebaseUser.uid), {
        idField: 'uid',
      }) as Observable<User | null>;
    }),
  );

  /**
   * Step 1 — request an OTP.
   * Returns an Observable that completes when the SMS is dispatched.
   */
  sendOtp(phoneNumber: string, buttonEl: HTMLElement): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.recaptchaVerifier?.clear();

      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, buttonEl, {
        size: 'invisible',
        callback: () => {},
      });

      signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
        .then((result) => {
          this.confirmationResult = result;
          sessionStorage.setItem('rgh_pending_phone', phoneNumber);
          subscriber.next();
          subscriber.complete();
        })
        .catch((err) => {
          this.recaptchaVerifier?.clear();
          this.recaptchaVerifier = null;
          subscriber.error(err);
        });
    });
  }

  /**
   * Step 2 — verify the OTP code.
   * Returns an Observable that emits the User profile on success.
   */
  verifyOtp(code: string): Observable<User> {
    if (!this.confirmationResult) {
      return throwError(() => new Error('No active OTP session. Please request a new code.'));
    }

    return from(this.confirmationResult.confirm(code)).pipe(
      switchMap((credential) =>
        this.ensureUserProfile(credential.user).pipe(
          switchMap(
            () =>
              docData(doc(this.firestore, 'users', credential.user.uid), {
                idField: 'uid',
              }) as Observable<User>,
          ),
        ),
      ),
      tap((user) => {
        sessionStorage.removeItem('rgh_pending_phone');
        this.redirectByRole(user.role);
      }),
      catchError((err) => throwError(() => err)),
    );
  }

  /**
   * Sign the current user out.
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(tap(() => this.router.navigate(['/auth/login'])));
  }

  /**
   * Get a fresh Firebase ID token for HTTP calls.
   */
  getIdToken(): Observable<string | null> {
    return new Observable<string | null>((subscriber) => {
      const user = this.auth.currentUser;
      if (!user) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }
      user
        .getIdToken()
        .then((token) => {
          subscriber.next(token);
          subscriber.complete();
        })
        .catch((err) => subscriber.error(err));
    });
  }

  // ── Private helpers ───────────────────────────────────────
  private ensureUserProfile(firebaseUser: FirebaseUser): Observable<void> {
    const ref = doc(this.firestore, 'users', firebaseUser.uid);
    return (docData(ref) as Observable<User | undefined>).pipe(
      switchMap((existing) => {
        if (existing) return of(undefined);
        return from(
          setDoc(ref, {
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber ?? '',
            role: 'customer' as UserRole,
            createdAt: serverTimestamp(),
          }),
        );
      }),
    );
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
}
