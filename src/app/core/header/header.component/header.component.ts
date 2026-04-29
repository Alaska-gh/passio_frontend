import { Button } from 'primeng/button';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserName,
  selectUserRole,
} from '@core/store/auth/auth.selectors';
import { Subject, takeUntil } from 'rxjs';
import { UserRole } from '@core/interfaces';
import { CommonModule } from '@angular/common';
import { AuthActions } from '@core/store/auth/auth.actions';

@Component({
  selector: 'app-header',
  imports: [Button, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  isAuthenticated = false;
  userRole: UserRole | null = null;
  userName: string | null = null;
  private store = inject(Store);

  ngOnInit(): void {
    this.store
      .select(selectIsAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => (this.isAuthenticated = value));

    this.store
      .select(selectUserRole)
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => (this.userRole = role));

    this.store
      .select(selectUserName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => (this.userName = name));

    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => console.log(user));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  signOut() {
    this.store.dispatch(AuthActions.signOut());
  }
}
