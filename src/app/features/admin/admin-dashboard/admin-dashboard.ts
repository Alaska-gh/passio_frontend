import { Component } from '@angular/core';
import { Bus, BusStatus, DailySummary } from '@core/interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { selectAllBuses, selectBusesLoading, selectHistoryLoading, selectSelectedBusTripHistory } from '@core/store/buses/buses.selector';
import { selectRecentTickets, selectRecentTicketsLoading, selectSummary } from '@core/store/tickets/tickets.selectors';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LOAD_BUS_TRIP_HISTORY, LOAD_BUSES, SET_BUS_ACTIVE, SET_BUS_INACTIVE } from '@core/store/buses/buses.actions';
import { LOAD_RECENT_TICKET, LOAD_TODAY_SUMMARY } from '@core/store/tickets/tickets.action';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { AddEditBusModal } from '../add-edit-bus-modal/add-edit-bus-modal';
import { StatusSeverity } from '@core/interfaces/status-severity';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule, SkeletonModule, ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  todaySummary$ = this.store.select(selectSummary);
  recentTickets$ = this.store.select(selectRecentTickets);
  recentTicketsLoading$ = this.store.select(selectRecentTicketsLoading);

 constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LOAD_TODAY_SUMMARY());
    this.store.dispatch(LOAD_RECENT_TICKET());

    this.todaySummary$.subscribe((summary) => console.log(summary))
    this.recentTickets$.subscribe((tickets) => console.log(tickets))
  }
}
