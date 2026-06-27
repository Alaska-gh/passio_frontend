import { Component } from '@angular/core';
import { Bus, BusStatus, Trip, User } from '@core/interfaces';
import { TripService } from '@core/services/trip.service';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import {  LOAD_BUSES } from '@core/store/buses/buses.actions';
import { selectAllBuses, selectBusesLoading } from '@core/store/buses/buses.selector';
import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, map, Observable, of, Subject, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs';
import { SignOffModal } from '../sign-off-modal/sign-off-modal';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { StatusSeverity } from '@core/interfaces/status-severity';
import { BusService } from '@core/services/bus.service';
import { SignOnModal } from '../sign-on-modal/sign-on-modal';
import { selectCurrentTrip } from '@core/store/trips/trips.selectors';
import { TrackingService } from '@core/services/tracking.service';
import { GhanaPostGpsService } from '@core/services/geolocation.service';
import { selectActiveRoutes } from '@core/store/routes/route.selectors';
import { GET_ACTIVE_ROUTES } from '@core/store/routes/route.actions';

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
  currentTrip$ = this.store.select(selectCurrentTrip);
  reportingReturn = false;
  currentUser: User | null = null;
  today = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  pendingRequest$ = this.store.select(selectCurrentUser).pipe(
    filter((u): u is User => u !== null),
    switchMap(user => this.busService.getDriverPendingRequest(user.uid))
  );
  distanceToDestination: number | null = null;
  locationError: string | null = null;
  currentLocation!: string
  originLocation!: string
  trackingConnected$ = this.trackingService.connected;
  private destroy$ = new Subject<void>();
  private ref!: DynamicDialogRef | null;

  constructor(
    private store: Store,
    private tripService: TripService,
    private dialogService: DialogService,
    private geoService: GhanaPostGpsService,
    private busService: BusService,
    private trackingService: TrackingService
  ) {}


  ngOnInit(): void {    
    this.store.dispatch(LOAD_BUSES());
    this.store.dispatch(GET_ACTIVE_ROUTES())

    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is User => user !== null),
      tap(user => this.currentUser = user)
    ).subscribe();

    //Derive assigned bus from store — no separate state needed
    this.assignedBus$ = this.allBuses$.pipe(
      map(buses => buses.find(b => b.driverId === this.currentUser?.uid) ?? null)
    );

    // Auto-start tracking when bus is on-trip and session exists
    this.assignedBus$.pipe(
      takeUntil(this.destroy$),
      filter((bus): bus is Bus => bus !== null),
      filter(bus => bus.status === 'on-trip' && !!bus.trackingSessionId),
      tap(bus => {        
        console.log(bus.trackingSessionId);
        
        if (this.currentUser) {
          this.trackingService.startTracking(
            bus.trackingSessionId!,
            bus.trackingJoinToken!,
            `${this.currentUser.name}`
          );
          this.updateDistanceToDestination(bus);
        }
      })
    ).subscribe();
  }

  private updateDistanceToDestination(bus: Bus): void {
    this.store.select(selectActiveRoutes).pipe(
      take(1),
      switchMap(routes => {
        const route = routes.find(r =>
          `${r.origin} → ${r.destination}` === bus.currentRoute
        );
        if (!route) return of(null);

        return this.geoService.getCurrentPosition().pipe(
          tap((cord) => console.log(cord)
          ),
          switchMap(coords =>
            this.geoService.getRoute(coords, {
              lat: route.destinationLat,
              lng: route.destinationLng,
            })
          ),
          map(result => {            
            return result.distance_m / 1000})
        );
      })
    ).subscribe(distance => {      
      this.distanceToDestination = distance;
    });
  }
  
  
  reportReturn(bus: Bus): void {
    this.reportingReturn = true;
    this.locationError = null;

    this.geoService.getCurrentPosition().pipe(
      switchMap(coords =>
        this.store.select(selectActiveRoutes).pipe(
          take(1),
          map(routes => routes.find(r =>
            `${r.origin} → ${r.destination}` === bus.currentRoute
          )),
          switchMap(route => {            
            if (!route) {
              throw new Error(
                `No route for this trip.`
              );
            };

            const originCenter = { lat: route.originLat, lng: route.originLng };
            const distanceKm = this.geoService.haversineKm(coords, originCenter);
            const isAtStation = distanceKm <= route.originRadiusKm;

             this.geoService.reverseGeocode(originCenter).subscribe((originName) =>{              
                 if(originName){
                    this.originLocation = originName
                 }
             })
            this.geoService.reverseGeocode(coords).subscribe((positionName) =>{              
              if(positionName){
                this.currentLocation = positionName
              }
            })           
            if (!isAtStation) {
              throw new Error(
                `You are at ${this.currentLocation} ${distanceKm.toFixed(1)}km from the ${this.originLocation}. 
                 You can only report when you are 2km from ${this.originLocation}.`
              );
            }

            // Stop tracking and report return
            this.trackingService.stopTracking();
            return this.tripService.reportReturn(bus.id).pipe(
              switchMap(() =>
                // Clear tracking session from bus document
                this.busService.updateBusTracking(bus.id, {
                  trackingSessionId: '',
                  trackingJoinToken: '',
                })
              )
            );
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.reportingReturn = false;
        this.store.dispatch(LOAD_BUSES());
      },
      error: (err) => {
        this.reportingReturn = false;
        this.locationError = err.message;
      }
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
    this.trackingService.stopTracking()
    this.destroy$.next();
    this.destroy$.complete();
  }
}
