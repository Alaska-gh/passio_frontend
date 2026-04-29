import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthActions } from '@core/store/auth/auth.actions';
import { selectAuthLoading, selectCurrentUser } from '@core/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { filter, map, Observable, take } from 'rxjs';

@Component({
  selector: 'app-onboarding.component',
  imports: [
    CardModule,
    CommonModule,
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
})
export class OnboardingComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // user$!: Observable<User | null>;
  loading$!: Observable<boolean>;
  visible$!: Observable<boolean>;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]], // optional
  });

  ngOnInit(): void {
    this.visible$ = this.store.select(selectCurrentUser).pipe(map((user) => !!user?.isNewUser));
    this.loading$ = this.store.select(selectAuthLoading);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Get the uid from the store and dispatch
    this.store
      .select(selectCurrentUser)
      .pipe(
        filter((user) => !!user),
        take(1),
      )
      .subscribe((user) => {
        this.store.dispatch(
          AuthActions.updateProfile({
            uid: user!.uid,
            name: this.form.value.name ?? undefined,
            email: this.form.value.email ?? undefined,
          }),
        );
      });
  }

  skip(): void {
    this.router.navigate(['/customer/routes']);
  }
}
