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
import { AuthActions } from '@core/store/auth/auth.actions';
import { filter, of, Subject, takeUntil, tap } from 'rxjs';

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
  // StringHelpers = StringHelpers;

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

    

    of(3)
      .pipe(
        takeUntil(this.destroy$),
        tap((count: number) => (this.unreadNotificationsCount = count))
      )
      .subscribe();
  }

  private setMenuItems() {    
    if (!this.user) return;
    if (this.user.role === 'admin') {
      this.navItems = [
        {
          label: 'Dashboard',
          icon: 'fas fa-home',
          route: '/admin/dashboard',
        },
        {
          label: 'Users & Permissions',
          icon: 'fas fa-user-shield',
          items: [
            {
              label: 'Users',
              icon: 'fas fa-user-cog',
              route: '/admin/users',
            },
            {
              label: 'Permissions',
              icon: 'fas fa-lock',
              route: '/admin/permissions'
            }
          ]
        },
        {
          label: 'Orders',
          icon: 'fas fa-box',
          items: [
            {
              label: 'All Orders',
              icon: 'fas fa-list',
              route: '/admin/orders',
            },
            // {
            //   label: 'Pending Orders',
            //   icon: 'fas fa-hourglass-half',
            //   route: '/admin/orders/pending'
            // },
            // {
            //   label: 'Completed Orders',
            //   icon: 'fas fa-check-circle',
            //   route: '/admin/orders/completed'
            // },
          ],
        },
        {
          label: 'Products',
          icon: 'fas fa-box-open',
          items: [
            {
              label: 'Products and Stocks',
              icon: 'fas fa-cubes',
              route: '/admin/products',
            },
            {
              label: 'Categories',
              icon: 'fas fa-tag',
              route: '/admin/products/categories',
            },
            {
              label: 'Sub Categories',
              icon: 'fas fa-tags',
              route: '/admin/products/sub-categories',
            }
          ]
        },
        {
          label: 'Vendors',
          icon: 'fas fa-store',
          items: [
            {
              label: 'All Vendors',
              icon: 'fas fa-list-alt',
              route: '/admin/vendors',
            },
            // {
            //   label: 'Add Vendor',
            //   icon: 'fas fa-plus-circle',
            //   route: '/admin/vendors/add'
            // }
          ],
        },
        // {
        //   label: 'Shipping',
        //   icon: 'fas fa-truck',
        //   items: [
        //     {
        //       label: 'Shipping Methods',
        //       icon: 'fas fa-shipping-fast',
        //       route: '/admin/shipping/methods'
        //     },
        //     {
        //       label: 'Shipping Fees',
        //       icon: 'fas fa-dollar-sign',
        //       route: '/admin/shipping/fees'
        //     }
        //   ]
        // },
        {
          label: 'Payments',
          icon: 'fas fa-credit-card',
          items: [
            {
              label: 'All Payments',
              icon: 'fas fa-receipt',
              route: '/admin/payments',
            },
            // {
            //   label: 'Payment Methods',
            //   icon: 'fas fa-wallet',
            //   route: '/admin/payments/methods'
            // }
          ],
        },
        {
          label: 'Distributors',
          icon: 'fas fa-truck-loading',
          items: [
            {
              label: 'All Applications',
              icon: 'fas fa-list',
              route: '/admin/distributors',
            },
          ],
        },
            //Add Audit & Logs Section Here
      {
        label: 'Audit & Logs',
        icon: 'fas fa-shield-alt',
        items: [
          {
            label: 'Admin Activities',
            icon: 'fas fa-clipboard-list',
            route: '/admin/activities',
          }
        ]
      },
        {
          label: 'Support Tickets',
          icon: 'fas fa-headphones',
          route: '/admin/support'
        },
        // {
        //   label: 'Reports',
        //   icon: 'fas fa-chart-line',
        //   items: [
        //     {
        //       label: 'Sales Reports',
        //       icon: 'fas fa-chart-bar',
        //       route: '/admin/reports/sales'
        //     },
        //     {
        //       label: 'Customer Insights',
        //       icon: 'fas fa-chart-pie',
        //       route: '/admin/reports/customers'
        //     }
        //   ]
        // },
        // {
        //   label: 'Settings',
        //   icon: 'fas fa-cog',
        //   route: '/admin/settings'
        // } 
      ];
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
      this.store.dispatch(AuthActions.signOut());
    }

     isActive(route: string): boolean {
    return this.router.url === route;
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
