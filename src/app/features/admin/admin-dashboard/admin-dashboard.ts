import { Component } from '@angular/core';
import { DailySummary } from '@core/interfaces';
import { selectRecentTickets, selectRecentTicketsLoading, selectSummary } from '@core/store/tickets/tickets.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LOAD_ADMIN_SUMMARY, LOAD_RECENT_TICKET } from '@core/store/tickets/tickets.action';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, TableModule, TagModule, ButtonModule, TooltipModule, SkeletonModule, ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  todaySummary$: Observable<DailySummary | null> = this.store.select(selectSummary);
  recentTickets$ = this.store.select(selectRecentTickets);
  recentTicketsLoading$ = this.store.select(selectRecentTicketsLoading);
  today = new Date().toISOString().split('T')[0];
  


 constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(LOAD_ADMIN_SUMMARY());
    this.store.dispatch(LOAD_RECENT_TICKET());
  }
}
