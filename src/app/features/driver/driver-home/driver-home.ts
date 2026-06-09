import { Component } from '@angular/core';
import { Bus, BusStatus, User } from '@core/interfaces';
import { TripService } from '@core/services/trip.service';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { LOAD_BUS_TRIP_HISTORY, LOAD_BUSES } from '@core/store/buses/buses.actions';
import { selectAllBuses, selectBusesLoading, selectHistoryLoading, selectQueuedBuses, selectSelectedBusTripHistory } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { SignOffModal } from '../sign-off-modal/sign-off-modal';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { StatusSeverity } from '@core/interfaces/status-severity';
import { BusService } from '@core/services/bus.service';
import { SignOnModal } from '../sign-on-modal/sign-on-modal';

@Component({
  selector: 'app-driver-home',
  imports: [CommonModule, ButtonModule, TagModule, SkeletonModule, DynamicDialogModule],
  templateUrl: './driver-home.html',
  styleUrl: './driver-home.css',
})
export class DriverHome {
 busLoading$ = this.store.select(selectBusesLoading);
 allBuses$ = this.store.select(selectAllBuses);
 assignedBus$!: Observable<Bus | null>;
 reportingReturn = false;
 currentUser: User | null = null;
 today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
pendingRequest$ = this.store.select(selectCurrentUser).pipe(
  filter((u): u is User => u !== null),
  switchMap(user => this.busService.getDriverPendingRequest(user.uid))
);
 private destroy$ = new Subject<void>();
 private ref!: DynamicDialogRef | null;

  constructor(
    private store: Store,
    private tripService: TripService,
    private dialogService: DialogService,
    private busService: BusService
  ) {}


  ngOnInit(): void {
    this.store.dispatch(LOAD_BUSES());

    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is User => user !== null),
      tap(user => this.currentUser = user)
    ).subscribe();

    //Derive assigned bus from store — no separate state needed
    this.assignedBus$ = this.allBuses$.pipe(
      map(buses => buses.find(b => b.driverId === this.currentUser?.uid) ?? null)
    );
  }

  reportReturn(bus: Bus): void {
    this.reportingReturn = true;
    this.tripService.reportReturn(bus.id).subscribe({
      next: () => {
        this.reportingReturn = false;
        this.store.dispatch(LOAD_BUSES());
      },
      error: () => { this.reportingReturn = false; }
    });
  }

  openSignOffModal(bus: Bus): void {
    this.ref = this.dialogService.open(SignOffModal, {
      header: 'Sign Off From Bus',
      width: '92vw',
      style: { 'max-width': '420px' },
      data: { bus },
    });
    this.ref?.onClose.pipe(takeUntil(this.destroy$)).subscribe((newDriver) => {
      if (newDriver) this.store.dispatch(LOAD_BUSES());
    });
  }

  openSignOnModal(): void {
  this.ref = this.dialogService.open(SignOnModal, {
    header: 'Sign on to bus',
    width: '92vw',
    style: { 'max-width': '480px' },
  });
  this.ref?.onClose.pipe(takeUntil(this.destroy$)).subscribe((signed) => {
    if (signed) this.store.dispatch(LOAD_BUSES());
  });
}

  getStatusSeverity(status: BusStatus): StatusSeverity {
    const map: Record<BusStatus, StatusSeverity> = {
      active: 'success',
      'on-trip': 'warn',
      inactive: 'secondary',
      maintenance: 'info'
    };
    return map[status] ?? 'secondary';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
