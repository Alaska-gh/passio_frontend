import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DailySummary, Ticket } from '@core/interfaces';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { LOAD_TODAY_SUMMARY } from '@core/store/tickets/tickets.action';
import { selectSummary, selectSummaryLoading } from '@core/store/tickets/tickets.selectors';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cashier-dashboard.component',
  imports: [CommonModule, CardModule, SkeletonModule, ButtonModule],
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.css',
})
export class CashierDashboardComponent {

  private store = inject(Store);
  private router = inject(Router);

  currentUser$ = this.store.select(selectCurrentUser);
  summary$: Observable<DailySummary | null> = this.store.select(selectSummary);
  summaryLoading$: Observable<boolean> = this.store.select(selectSummaryLoading);

  today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  ngOnInit() {
   this.store.dispatch(LOAD_TODAY_SUMMARY())
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
  
  goToIssueTicket() {
    this.router.navigate(['/cashier/issue-ticket']);
  }
}
