import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bus, BusRoute, Ticket, Trip } from '@core/interfaces';
import { TicketService } from '@core/services/ticket.service';
import { selectCurrentUser } from '@core/store/auth/auth.selectors';
import { GET_ACTIVE_ROUTES } from '@core/store/routes/route.actions';
import { selectActiveRoutes } from '@core/store/routes/route.selectors';
import { ISSUE_TICKET, RESET_TICKET } from '@core/store/tickets/tickets.action';
import { selectIssuedTicket, selectTicketError, selectTicketLoading } from '@core/store/tickets/tickets.selectors';
import { selectCurrentTrip, selectTripLoading } from '@core/store/trips/trips.selectors';
import { Store } from '@ngrx/store';
import { debounceTime, Observable, Subject, take, takeUntil } from 'rxjs';
import { Button } from "primeng/button";
import { LOAD_CURRENT_TRIP, RESET_TRIP } from '@core/store/trips/trips.actions';

@Component({
  selector: 'app-issue-ticket.component',
  imports: [CommonModule, FormsModule, Button],
  standalone: true,
  templateUrl: './issue-ticket.component.html',
  styleUrl: './issue-ticket.component.css',
})
export class IssueTicketComponent implements OnInit{
  routes$ = this.store.select(selectActiveRoutes);
  selectedRoute: BusRoute | null = null;
  travelDate = '';
  passengerName = '';
  passengerPhone = '';
  numberOfSeats = 1;
  paymentMethod: 'mtn' | 'telecel' = 'mtn';
  mobileMoneyNumber = '';
  today = new Date().toISOString().split('T')[0];
  currentTrip$!: Observable<Trip | null>;
  issuedTicket$!: Observable<Ticket | null>;
  loading$!: Observable<boolean>;
  tripLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  private cashierUid = '';
  private destroy$ = new Subject<void>();
  private tripTrigger$ = new Subject<void>();

 
  constructor(
    private store: Store,
    private ticketService: TicketService
  ) {
    this.currentTrip$ = this.store.select(selectCurrentTrip);
    this.issuedTicket$ = this.store.select(selectIssuedTicket);
    this.loading$ = this.store.select(selectTicketLoading);
    this.tripLoading$ = this.store.select(selectTripLoading);
    this.error$ = this.store.select(selectTicketError);
  }

    ngOnInit() {
      this.store.dispatch(GET_ACTIVE_ROUTES())
      this.store.dispatch(RESET_TICKET());
      this.store.select(selectCurrentUser).pipe(
        takeUntil(this.destroy$))
        .subscribe(user => { if (user) this.cashierUid = user.uid; });

      // Debounce trip loading so it only fires when all 3 fields are set
      this.tripTrigger$.pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      ).subscribe(() => this.loadTrip());
      this.travelDate = this.today
  }

  get totalAmount(): number {
    return (this.selectedRoute?.fareGHS ?? 0) * this.numberOfSeats;
  }

  get isFormValid(): boolean {
    const phoneRegex = /^(?:\+233|0)(2[0-9]|5[0-9])[0-9]{7}$/;

    const isPassengerPhoneValid = phoneRegex.test(
      this.passengerPhone.trim()
    );

    const isMobileMoneyNumberValid = phoneRegex.test(
      this.mobileMoneyNumber.trim()
    );

    return !!(
      this.selectedRoute &&
      this.travelDate &&
      this.passengerName.trim() &&
      isPassengerPhoneValid &&
      isMobileMoneyNumberValid &&
      this.numberOfSeats >= 1
    );
  }


   onRouteChange(routeId: string) {
    // Use snapshot via take(1) instead of a raw subscription
    this.store.dispatch(RESET_TRIP());
    this.routes$.pipe(take(1), takeUntil(this.destroy$)).subscribe(routes => {
      this.selectedRoute = routes.find(r => r.id === routeId) || null;
    });
    this.store.dispatch(RESET_TICKET());
    this.triggerTripLoad();
  }

  onDateChange() { this.triggerTripLoad(); }
  onTimeChange() { this.triggerTripLoad(); }

  private triggerTripLoad() {
    if (this.selectedRoute && this.travelDate) {
      this.tripTrigger$.next();
    }
  }

  private loadTrip() {
    console.log('load trip method called');
    console.log('loadTrip called', new Date().getTime());
    
    if (!this.selectedRoute || !this.travelDate) return;
    console.log('dispatching load trip action');
    
    this.store.dispatch(LOAD_CURRENT_TRIP({
      route: `${this.selectedRoute.origin} → ${this.selectedRoute.destination}`,
      origin: this.selectedRoute.origin,
      destination: this.selectedRoute.destination,
      date: this.travelDate,
      pricePerSeat: this.selectedRoute.fareGHS,
    }));
  }

    onIssueTicket(trip: Trip) {
    if (!this.isFormValid || !this.selectedRoute) return;

    const ticket: Ticket = {
      ticketNumber: this.ticketService.generateTicketNumber(),
      tripId: trip.id!,
      route: `${this.selectedRoute.origin} → ${this.selectedRoute.destination}`,
      origin: this.selectedRoute.origin,
      destination: this.selectedRoute.destination,
      travelDate: this.travelDate,
      passengerName: this.passengerName.trim(),
      passengerPhone: this.passengerPhone.trim(),
      numberOfSeats: this.numberOfSeats,
      pricePerSeat: this.selectedRoute.fareGHS,
      totalAmount: this.totalAmount,
      paymentMethod: this.paymentMethod,
      mobileMoneyNumber: this.mobileMoneyNumber.trim(),
      issuedBy: this.cashierUid,
      issuedAt: new Date(),
      status: 'active',
    };

    this.store.dispatch(ISSUE_TICKET({
      ticket,
      tripId: trip.id!,
      busId: trip.busId,
      queueOrder: trip.queueOrder!,
      route: trip.route,
      origin: trip.origin,
      destination: trip.destination,
      date: trip.date,
      pricePerSeat: trip.pricePerSeat,
    }));
  }

   printTicket() { window.print(); }

    resetForm() {
    this.store.dispatch(RESET_TICKET());
    this.store.dispatch(RESET_TRIP());
    this.selectedRoute = null;
    this.travelDate = this.today;
    this.passengerName = '';
    this.passengerPhone = '';
    this.numberOfSeats = 1;
    this.mobileMoneyNumber = '';
    this.paymentMethod = 'mtn';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
