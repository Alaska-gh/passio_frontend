import { Component } from '@angular/core';
import { Bus, BusRequest, BusStatus, User } from '@core/interfaces';
import { LOAD_BUS_TRIP_HISTORY, LOAD_BUSES, SET_BUS_ACTIVE, SET_BUS_INACTIVE } from '@core/store/buses/buses.actions';
import { selectAllBuses, selectBusesLoading, selectHistoryLoading, selectSelectedBusTripHistory } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, Subject, switchMap, take, takeUntil } from 'rxjs';
import { AddEditBusModal } from '../add-edit-bus-modal/add-edit-bus-modal';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { StatusSeverity } from '@core/interfaces/status-severity';
import { BusService } from '@core/services/bus.service';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';

@Component({
  selector: 'app-bus-management',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule, 
    TooltipModule, 
    DynamicDialogModule,
    DatePipe
  ],
  templateUrl: './bus-management.html',
  styleUrl: './bus-management.css',
})
export class BusManagement {
  buses$ = this.store.select(selectAllBuses);
  busesLoading$ = this.store.select(selectBusesLoading);
  tripHistory$ = this.store.select(selectSelectedBusTripHistory);
  historyLoading$ = this.store.select(selectHistoryLoading);
  pendingRequests$ = this.busService.getPendingBusRequests();
  showHistory = false;
  selectedBus: Bus | null = null;

  private destroy$ = new Subject<void>();
  private ref!: DynamicDialogRef | null;

  constructor(private store: Store, private dialogService: DialogService,private busService: BusService) {}

  ngOnInit(): void {
    this.store.dispatch(LOAD_BUSES());
    this.pendingRequests$.subscribe((request) => console.log(request)
    )
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddBusModal(): void {
    this.ref = this.dialogService.open(AddEditBusModal, {
      header: 'Add new bus',
      width: '55rem',
    });
    this.ref?.onClose.pipe(takeUntil(this.destroy$)).subscribe((saved) => {
      if (saved) this.store.dispatch(LOAD_BUSES());
    });
  }


  openEditBusModal(bus: Bus): void {
    this.ref = this.dialogService.open(AddEditBusModal, {
      header: 'Edit bus',
      width: '55rem',
      data: bus,
    });
    this.ref?.onClose.pipe(takeUntil(this.destroy$)).subscribe((saved) => {
      if (saved) this.store.dispatch(LOAD_BUSES());
    });
  }

  viewHistory(bus: Bus): void {
    this.selectedBus = bus;
    this.showHistory = true;    
    this.store.dispatch(LOAD_BUS_TRIP_HISTORY({ busId: bus.id }));
  }

    closeHistory(): void {
    this.showHistory = false;
    this.selectedBus = null;
  }

  setBusActive(bus: Bus): void {
    this.store.dispatch(SET_BUS_ACTIVE({ busId: bus.id }));
  }

  setBusInactive(bus: Bus): void {
    this.store.dispatch(SET_BUS_INACTIVE({ busId: bus.id }));
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

  approveRequest(request: BusRequest): void {
    this.store.select(selectCurrentUser).pipe(
      filter((u): u is User => u !== null),
      take(1),
      switchMap(user => this.busService.approveBusRequest(request, user.uid))
    ).subscribe(() => {
      this.store.dispatch(LOAD_BUSES());
      this.pendingRequests$ = this.busService.getPendingBusRequests();
    });
  }

  rejectRequest(request: BusRequest): void {
    this.store.select(selectCurrentUser).pipe(
      filter((u): u is User => u !== null),
      take(1),
      switchMap(user => this.busService.rejectBusRequest(request.id!, user.uid))
    ).subscribe(() => {
      this.pendingRequests$ = this.busService.getPendingBusRequests();
    });
  }

}
