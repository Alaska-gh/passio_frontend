import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '@core/interfaces';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import * as AuthActions from '@core/store/auth/auth.actions';
import { filter, of, Subject, takeUntil, tap } from 'rxjs';
import { OPEN_CONFIRM_DIALOG } from '@core/store/dialog/confirm-dialog.actions';
import { PrimeNgSeverity } from '@core/interfaces/primeng-severity.enums';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PanelMenuModule,DividerModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  @Input() sidenavOpened!: boolean;
  @Input() isPeeking!: boolean;

  navItems: MenuItem[] = [];
  user!: User;
  unreadNotificationsCount!: number;
  destroy$ = new Subject<void>();

  private store = inject(Store)
  private router = inject(Router)

  ngOnInit() {
    this.store.select(selectCurrentUser).pipe(
      filter((user): user is User => user !== null),
      takeUntil(this.destroy$),
      tap((user: User) => {
        this.user = user;
        this.setMenuItems()
      })
    ).subscribe();
  }

  private setMenuItems() {    
    if (!this.user) return;
    if(this.user.role === 'admin'){
      this.navItems = []
    }

    if (this.user.role === 'cashier') {
      this.navItems = [
        {
          label: 'Dashboard',
          icon: 'grid',
          routerLink: '/cashier/dashboard',
        },
        {
          label: 'Issue Ticket',
          icon: 'ticket',
          routerLink: '/cashier/issue-ticket',
        },
        {
          label: 'Recieve Parcel',
          icon: 'parcel',
          routerLink: '/cashier/recieve-parcel'
        },
      ];
    }
  }

    logout() {
      console.log('logged out');
      
      this.store.dispatch(OPEN_CONFIRM_DIALOG({
        header: 'Confirm Logout',
        message:'Are you sure you want to log out?',
        acceptLabel: 'Signout',
        acceptAction: AuthActions.SIGNOUT(),
        confirmType: PrimeNgSeverity.DANGER
      }));
    }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
