import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Bus, User } from '@core/interfaces';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { LOAD_BUS_TRIP_HISTORY, LOAD_BUSES } from '@core/store/buses/buses.actions';
import { selectAllBuses, selectHistoryLoading, selectSelectedBusTripHistory } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { TagModule } from 'primeng/tag';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-driver-history',
  imports: [CommonModule, TagModule],
  templateUrl: './driver-history.html',
  styleUrl: './driver-history.css',
})
export class DriverHistory {
  tripHistory$ = this.store.select(selectSelectedBusTripHistory);
  historyLoading$ = this.store.select(selectHistoryLoading);

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LOAD_BUSES());

    // Load history for the driver's assigned bus
    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is User => user !== null),
      switchMap(user =>
        this.store.select(selectAllBuses).pipe(
          filter(buses => buses.length > 0),
          map(buses => buses.find(b => b.driverId === user.uid) ?? null)
        )
      ),
      filter((bus): bus is Bus => bus !== null),
      tap(bus => this.store.dispatch(LOAD_BUS_TRIP_HISTORY({ busId: bus.id }))),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
