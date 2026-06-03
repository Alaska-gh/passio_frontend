import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { BusRoute } from '@core/interfaces';
import { Subject, takeUntil, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectActiveRoutes } from '@core/store/routes/route.selectors';
import { GET_ACTIVE_ROUTES } from '@core/store/routes/route.actions';

@Component({
  selector: 'app-customer-routes.component',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    ButtonModule,
    SkeletonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    TagModule,
    AutoCompleteModule,
  ],
  templateUrl: './customer-routes.component.html',
  styleUrl: './customer-routes.component.css',
})
export class CustomerRoutesComponent implements OnInit {
  filteredSources: string[] = [];
  filteredDestinations: string[] = [];
  filteredRoutes: BusRoute[] = [];
  from: string | undefined;
  to: string | undefined;
  destroy$ = new Subject<void>
  routes!: BusRoute[];
  today = new Date().toISOString().slice(0, 10);

  private router = inject(Router);
  private store = inject(Store)

  ngOnInit(): void {    
    this.store.dispatch(GET_ACTIVE_ROUTES())
    this.store.select(selectActiveRoutes).pipe(
      takeUntil(this.destroy$),
      tap((routes) => {
        this.routes = routes
        this.filteredRoutes = routes
      })
    ).subscribe();

  }

  getFilterSources(event: any) {
    const query = event.query.toLowerCase();
     this.filteredSources = this.routes.flatMap(route => route.origin).filter(
      (route) => route.toLowerCase().includes(query)) 
  }

  getFilterDestinations(event: any) {
    const query = event.query.toLowerCase();

   this.filteredDestinations = this.routes.flatMap(route => route.destination).filter(
    route => route.toLowerCase().includes(query))
  }

  findRoute(): void {
  const from = this.from?.trim().toLowerCase();
  const to = this.to?.trim().toLowerCase();

  if (!from && !to) {
    this.filteredRoutes = [...this.routes];
    return;
  }

  this.filteredRoutes = this.routes.filter(route => {
    const matchesOrigin = !from ||
      route.origin.toLowerCase().includes(from);

    const matchesDestination = !to ||
      route.destination.toLowerCase().includes(to)
    return matchesOrigin && matchesDestination;
  });
}

  selectRoute(routeId: string): void {
    this.router.navigate(['/customer/schedules', routeId]);
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
}
