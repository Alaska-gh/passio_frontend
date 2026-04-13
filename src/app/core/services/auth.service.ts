import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { User, UserRole } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userRole = computed(() => this.currentUser()?.role ?? null);

  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor() {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.loadUserProfile(firebaseUser.uid);
        this.currentUser.set(user);
      } else {
        this.currentUser.set(null);
      }
      this.loading.set(false);
    });
  }

  async sendOtp(phoneNumber: string, buttonEl: HTMLElement): Promise<void> {
    this.recaptchaVerifier?.clear();
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, buttonEl, {
      size: 'invisible',
      callback: () => {},
    });
    try {
      this.confirmationResult = await signInWithPhoneNumber(
        this.auth,
        phoneNumber,
        this.recaptchaVerifier,
      );
    } catch (err) {
      this.recaptchaVerifier?.clear();
      this.recaptchaVerifier = null;
      throw err;
    }
  }

  async verifyOtp(code: string): Promise<void> {
    if (!this.confirmationResult) {
      throw new Error('No active OTP session. Please request a new code.');
    }
    const credential = await this.confirmationResult.confirm(code);
    await this.ensureUserProfile(credential.user);
    const profile = await this.loadUserProfile(credential.user.uid);
    this.currentUser.set(profile);
    this.redirectByRole(profile?.role);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getIdToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() ?? Promise.resolve(null);
  }

  private async loadUserProfile(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    if (!snap.exists()) return null;
    return { uid, ...snap.data() } as User;
  }

  private async ensureUserProfile(firebaseUser: FirebaseUser): Promise<void> {
    const ref = doc(this.firestore, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber ?? '',
        role: 'customer' as UserRole,
        createdAt: serverTimestamp(),
      });
    }
  }

  private redirectByRole(role?: UserRole | null): void {
    if (!role) return;
    const destinations: Record<UserRole, string> = {
      customer: '/customer/routes',
      admin: '/admin/dashboard',
      driver: '/driver/schedule',
      conductor: '/conductor/scanner',
    };
    this.router.navigate([destinations[role]]);
  }
}
