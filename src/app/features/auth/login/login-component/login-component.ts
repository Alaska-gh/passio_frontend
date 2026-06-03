import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AuthActions from '@core/store/auth/auth.actions';
import { selectAuthError, selectAuthLoading, selectOtpSent } from '@core/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, SelectButtonModule, ButtonModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loading$!: Observable<boolean>;
  error!: string | null;
  otpSent!: boolean;

  @ViewChild('otpBtn', { read: ElementRef })
  otpBtn!: ElementRef<HTMLElement>;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  form = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
  });

  ngOnInit(): void {
    this.loading$ = this.store.select(selectAuthLoading);
    this.store.select(selectAuthError).pipe(
        takeUntil(this.destroy$),
        tap((err) => (this.error = err)),
      ).subscribe();

    this.store.select(selectOtpSent).pipe(
      takeUntil(this.destroy$)).subscribe(
        (sent) => {
        if (sent) {
          this.router.navigate(['/auth/verify']);
        }
      });
  }

  get phoneControl(): AbstractControl {
    return this.form.get('phone')!;
  }

  get phoneInvalid(): boolean {
    return this.phoneControl.touched && this.phoneControl.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value.phone!.replace(/\s/g, '');
    const normalized = raw.startsWith('0') ? raw.slice(1) : raw;
    const phoneNumber = `+233${normalized}`;

    this.store.dispatch(AuthActions.SEND_OTP({ phoneNumber }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
