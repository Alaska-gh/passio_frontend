import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Bus, User } from '@core/interfaces';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { LOAD_BUSES } from '@core/store/buses/buses.actions';
import { selectAllBuses, selectQueuedBuses } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-driver-queue',
  imports: [CommonModule],
  templateUrl: './driver-queue.html',
  styleUrl: './driver-queue.css',
})
export class DriverQueue {
  queuedBuses$ = this.store.select(selectQueuedBuses);
  assignedBus$!: Observable<Bus | null>;

  private currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LOAD_BUSES());

    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is User => user !== null),
      tap(user => this.currentUser = user)
    ).subscribe();

    this.assignedBus$ = this.store.select(selectAllBuses).pipe(
      map(buses => buses.find(b => b.driverId === this.currentUser?.uid) ?? null)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
