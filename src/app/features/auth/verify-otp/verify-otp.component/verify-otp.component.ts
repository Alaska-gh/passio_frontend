import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthActions } from '@core/store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';

type OtpForm = {
  d1: FormControl<string | null>;
  d2: FormControl<string | null>;
  d3: FormControl<string | null>;
  d4: FormControl<string | null>;
  d5: FormControl<string | null>;
  d6: FormControl<string | null>;
};

@Component({
  selector: 'app-verify-otp.component',
  imports: [Button, ReactiveFormsModule, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css',
})
export class VerifyOtpComponent implements OnInit {
  loading = false;
  countdown = 30;
  resendDisabled = true;

  constructor(private store: Store) {}

  otpForm = new FormGroup<OtpForm>({
    d1: new FormControl('', [Validators.required]),
    d2: new FormControl('', [Validators.required]),
    d3: new FormControl('', [Validators.required]),
    d4: new FormControl('', [Validators.required]),
    d5: new FormControl('', [Validators.required]),
    d6: new FormControl('', [Validators.required]),
  });

  get otpControls() {
    return Object.values(this.otpForm.controls);
  }

  ngOnInit() {
    this.startCountdown();
  }

  verifyOtp() {
    const otp = Object.values(this.otpForm.value).join('');
    console.log('OTP:', otp);
    this.store.dispatch(AuthActions.verifyOtp({ code: otp }));
  }

  resendOtp() {
    console.log('Resending OTP...');
    this.startCountdown();
  }

  startCountdown() {
    this.resendDisabled = true;
    this.countdown = 30;

    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(interval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    const controlName = `d${index + 1}` as keyof OtpForm;
    this.otpForm.get(controlName)?.setValue(input.value);

    if (input.value && index < 5) {
      const inputs = input.parentElement?.querySelectorAll('input');
      (inputs?.[index + 1] as HTMLInputElement)?.focus();
    }
  }

  onBackspace(event: Event, index: number) {
    if (index > 0) {
      const inputs = (event.target as HTMLElement).parentElement!.querySelectorAll('input');

      if (!(event.target as HTMLInputElement).value) {
        inputs[index - 1].focus();
      }
    }
  }
}
