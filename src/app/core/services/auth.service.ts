import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
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
import {
  Firestore,
  doc,
  docData,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, from, switchMap, of, tap, throwError, map, defer, catchError, take } from 'rxjs';
import { User, UserRole } from '@core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);

  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  readonly firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

  readonly currentUser$: Observable<User | null> = this.firebaseUser$.pipe(
    switchMap((firebaseUser) => {
      if (!firebaseUser) return of(null);
      return this.userDoc$(firebaseUser.uid);
    }),
  );

  sendOtp(phoneNumber: string): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        this.clearRecaptcha();

        this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
          size: 'invisible',
        });

        return from(signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)).pipe(
          tap((confirmationResult) => {
            this.confirmationResult = confirmationResult;
            sessionStorage.setItem('rgh_pending_phone', phoneNumber);
          }),
          map(() => void 0),
        );
      }),
    );
  }

  verifyOtp(code: string): Observable<User> {
    if (!this.confirmationResult) {
      return throwError(() => new Error('No active OTP session. Please resend'));
    }

    return defer(() =>
      runInInjectionContext(this.injector, () =>
        from(this.confirmationResult!.confirm(code)).pipe(
          switchMap((credential) => {
            const isNewUser = credential.user.metadata.creationTime === credential.user.metadata.lastSignInTime;
            return this.ensureUserProfile$(credential.user).pipe(
              switchMap(() => this.userDoc$(credential.user.uid)),
              map((user) => ({ ...user, isNewUser })),
            );
          }),
          tap((user) => {
            sessionStorage.removeItem('rgh_pending_phone');
            localStorage.setItem('passio_logedin_user', JSON.stringify(user))
            this.redirectByRole(user.role);
          })),
      ),
    );
  }

  updateProfile(uid: string, data: { name?: string; email?: string }): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', uid);
        return from(
          updateDoc(ref, {
            ...(data.name && { name: data.name.trim() }),
            ...(data.email && { email: data.email.trim() }),
            updatedAt: serverTimestamp(),
          }),
        );
      }),
    );
  }

  signOut(): Observable<void> {
    localStorage.removeItem('passio_logedin_user')
    return from(signOut(this.auth));
  }

  getIdToken(): Observable<string | null> {
    return defer(async () => {
      const user = this.auth.currentUser;
      return user ? await user.getIdToken() : null;
    });
  }

  private userDoc$(uid: string): Observable<User> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', uid);
        return (docData(ref, { idField: 'uid' }) as Observable<User>).pipe(
          take(1)
        );
      }),
    );
  }

  private ensureUserProfile$(firebaseUser: FirebaseUser): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const ref = doc(this.firestore, 'users', firebaseUser.uid);

        return from(getDoc(ref)).pipe(
          switchMap((snap) => {
            if (snap.exists()) {
              return of(void 0)
            };

            const data = {
                uid: firebaseUser.uid,
                phone: firebaseUser.phoneNumber ?? '',
                role: 'customer',
                name: firebaseUser.displayName,
                createdAt: serverTimestamp(),
              }

            return from(
              setDoc(ref, data))
          }),
        );
      }),
    );
  }

  private redirectByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      customer: '/customer/home',
      admin: '/admin/dashboard',
      driver: '/driver/schedule',
      conductor: '/conductor/scanner',
      cashier: '/cashier',
    };

    this.router.navigate([routes[role]]);
  }

  private clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}
