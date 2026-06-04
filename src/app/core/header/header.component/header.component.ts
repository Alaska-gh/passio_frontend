import { Button } from 'primeng/button';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@core/store/auth/auth.selectors';
import { Subject, takeUntil } from 'rxjs';
import { UserRole } from '@core/interfaces';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import * as AuthActions from '@core/store/auth/auth.actions';
import { MenuItem } from 'primeng/api';
import { OPEN_CONFIRM_DIALOG } from '@core/store/dialog/confirm-dialog.actions';
import { PrimeNgSeverity } from '@core/interfaces/primeng-severity.enums';

@Component({
  selector: 'app-header',
  imports: [Button, RouterLink, RouterLinkActive, CommonModule, AvatarModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  isAuthenticated = false;
  userRole: UserRole | null = null;
  userName!: string;
  items: MenuItem[] | undefined


  private store = inject(Store);

  ngOnInit(): void {
    this.items = [
      {
        label: 'Profile Settings',
        items: [
          {
            label: 'Update Profile',
            icon: 'fas fa-user-plus'
          },
          {
             separator: true
          },
          {
            label: 'Signout',
            icon: 'fas fa-sign-out',
            shortcut: '⌘+Q',
            linkClass: '!text-red-500 dark:!text-red-400',
            command: () => {
              this.signOut()
            }
          }
        ],
    }
  ]

    this.store.select(selectIsAuthenticated).pipe(
      takeUntil(this.destroy$)).subscribe(
        (value) => (this.isAuthenticated = value));

    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$)).subscribe(
        (user) => {
          if(user){
            this.userRole = user?.role;
            if(user.name)
            this.userName = user.name
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  signOut() {
    this.store.dispatch(OPEN_CONFIRM_DIALOG({
      header: 'Confirm Logout',
      message:'Are you sure you want to log out?',
      acceptLabel: 'Signout',
      acceptAction: AuthActions.SIGNOUT(),
      confirmType: PrimeNgSeverity.CONTRAST
    }));
  }
}
