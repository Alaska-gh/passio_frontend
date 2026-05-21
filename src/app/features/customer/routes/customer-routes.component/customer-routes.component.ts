import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { RouteService } from '@core/services/route.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { BusRoute } from '@core/interfaces';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-routes.component',
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
  sources = ['Koforidua'];
  destinations = ['Accra', 'Kasoa', 'Circle', 'Tema'];
  filteredSources: string[] = [];
  filteredDestinations: string[] = [];
  from: string | undefined;
  to: string | undefined;

  private routeService = inject(RouteService);
  private router = inject(Router);

  routes$!: Observable<BusRoute[]>;
  today = new Date().toISOString().slice(0, 10);

  ngOnInit(): void {
    this.routes$ = this.routeService.getActiveRoutes();
  }

  getFilterSources(event: any) {
    const query = event.query.toLowerCase();

    this.filteredSources = this.sources.filter((item) => item.toLowerCase().includes(query));
  }

  getFilterDestinations(event: any) {
    const query = event.query.toLowerCase();

    this.filteredDestinations = this.destinations.filter((item) =>
      item.toLowerCase().includes(query),
    );
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
