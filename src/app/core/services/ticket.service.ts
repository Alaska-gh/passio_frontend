import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Bus, DailySummary, Ticket } from '@core/interfaces';
import { Observable, from, map, defer, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  generateTicketNumber(): string {
    const prefix = 'PTA';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

 getTodaySummary(cashierUid: string): Observable<DailySummary> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const today = new Date().toISOString().split('T')[0];

      const ticketsRef = collection(this.firestore, 'tickets');
      const ticketsQuery = query(
        ticketsRef,
        where('issuedBy', '==', cashierUid),
        where('travelDate', '==', today)
      );

      const busesRef = collection(this.firestore, 'busses');
      const busesQuery = query(busesRef, where('status', 'in', ['active', 'on-trip']));

      return forkJoin({
        ticketsSnap: from(getDocs(ticketsQuery)),
        busesSnap: from(getDocs(busesQuery)),
      }).pipe(
        map(({ ticketsSnap, busesSnap }) => {
          const tickets = ticketsSnap.docs.map(d => d.data() as Ticket);
          const buses = busesSnap.docs.map(d => d.data() as Bus);

          const totalTickets = tickets.length;
          const totalRevenue = tickets.reduce((sum, t) => sum + t.totalAmount, 0);
          const totalSeats = tickets.reduce((sum, t) => sum + t.numberOfSeats, 0);
          const lastTicket = tickets.length > 0
            ? tickets.reduce((latest, t) =>
                new Date(t.issuedAt) > new Date(latest.issuedAt) ? t : latest
              )
            : null;

          const activeBuses = buses.filter(b => b.status === 'active').length;
          const busesOnTrip = buses.filter(b => b.status === 'on-trip').length;

          return { totalTickets, totalRevenue, totalSeats, lastTicket, activeBuses, busesOnTrip };
        })
      );
    })
  );
}

getAdminDailySummary(): Observable<DailySummary> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const today = new Date().toISOString().split('T')[0];
      console.log(today);
      
      const ticketsRef = collection(this.firestore, 'tickets');
      const ticketsQuery = query(
        ticketsRef,
        where('travelDate', '==', today) 
      );

      const busesRef = collection(this.firestore, 'busses');
      const busesQuery = query(busesRef, where('status', 'in', ['active', 'on-trip']));

      return forkJoin({
        ticketsSnap: from(getDocs(ticketsQuery)),
        busesSnap: from(getDocs(busesQuery)),
      }).pipe(
        map(({ ticketsSnap, busesSnap }) => {
          const tickets = ticketsSnap.docs.map(d => this.mapTicket(d));
          const buses = busesSnap.docs.map(d => d.data() as Bus);

          return {
            totalTickets: tickets.length,
            totalRevenue: tickets.reduce((sum, t) => sum + t.totalAmount, 0),
            totalSeats: tickets.reduce((sum, t) => sum + t.numberOfSeats, 0),
            lastTicket: tickets.length > 0
              ? tickets.reduce((latest, t) =>
                  new Date(t.issuedAt) > new Date(latest.issuedAt) ? t : latest)
              : null,
            activeBuses: buses.filter(b => b.status === 'active').length,
            busesOnTrip: buses.filter(b => b.status === 'on-trip').length,
          } as DailySummary;
        })
      );
    })
  );
}

getRecentTickets(limitCount = 5): Observable<Ticket[]> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const ticketsRef = collection(this.firestore, 'tickets');
      const q = query(
        ticketsRef,
        orderBy('issuedAt', 'desc'),
        limit(limitCount)
      );
      return from(getDocs(q)).pipe(
        map(snapshot =>
          snapshot.docs.map(d => this.mapTicket(d))
        )
      );
    })
  );
}

private mapTicket(d: any): Ticket {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    issuedAt: data.issuedAt?.toDate ? data.issuedAt.toDate() : new Date(data.issuedAt),
  } as Ticket;
}
}