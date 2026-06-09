import { Store } from '@ngrx/store';
import { Component, signal, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '@core/header/header.component/header.component';
import {  selectIsAuthenticated, selectUserRole } from '@core/store/auth/auth.selectors';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { selectSidenavOpened } from '@core/store/app-config/app-config.selectors';
import { setSidenavOpened } from '@core/store/app-config/app-config.actions';
import { SidenavComponent } from '@shared/components/sidenav/sidenav.component/sidenav.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    ToastModule, 
    SidenavComponent,
    ButtonModule, 
    CommonModule, 
    TooltipModule,
    ConfirmDialogModule
    ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('passio_fronten');
  sidenavOpened = false;
  isPeeking = false;
  isAuthenticated = false;
  routeLoading = false;
  isMobile = false;
  userRole!: string;
  destroy$ = new Subject<void>();
  

  readonly vm$ = combineLatest({
    userRole: this.store.select(selectUserRole).pipe(
      map(role => role ?? 'customer')
    ),
    isAuthenticated: this.store.select(selectIsAuthenticated),
  });

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {

    this.isMobile = window.innerWidth < 768;

    this.router.events.pipe(
      takeUntil(this.destroy$)
      ).subscribe(event => {
        if (event instanceof NavigationStart) {
          this.routeLoading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel || event instanceof NavigationError
        ) {
          this.routeLoading = false;
        }
      });
  

    if (this.isMobile) {
      this.sidenavOpened = false;
      this.store.dispatch(setSidenavOpened({ opened: false }));
    } else {
      this.store.select(selectSidenavOpened).pipe(
        takeUntil(this.destroy$)
      ).subscribe((sidenavOpened: boolean) => {        
        this.sidenavOpened = sidenavOpened
      });
    }

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  toggleSidenav(): void {
    this.store.dispatch(setSidenavOpened({ opened: !this.sidenavOpened }));
  }

  handleMouseEnter(): void {
    if (!this.sidenavOpened) this.isPeeking = true;
  }

  handleMouseLeave(): void {
    if (!this.sidenavOpened) this.isPeeking = false;
  }

  onCloseNav(): void {
    // Only collapse on mobile
    if (window.innerWidth < 768) {
      this.sidenavOpened = false;
      this.isPeeking = false;
      this.store.dispatch(setSidenavOpened({ opened: !this.sidenavOpened }))
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => {});
  }
}
