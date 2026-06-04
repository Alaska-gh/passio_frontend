import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { DailySummary, Ticket } from '@core/interfaces';
import { Observable, from, map, defer } from 'rxjs';

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
      const todayStr = new Date().toISOString().split('T')[0];
      const ticketsRef = collection(this.firestore, 'tickets');
      const q = query(
        ticketsRef,
        where('issuedBy', '==', cashierUid),
        where('travelDate', '==', todayStr)
      );

      return from(getDocs(q)).pipe(
        map((snapshot) => {
          if (snapshot.empty) {
            return { totalTickets: 0, totalRevenue: 0, totalSeats: 0, lastTicket: null };
          }

          const tickets = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data() as Omit<Ticket, 'id'>
          })) as Ticket[];

          return {
            totalTickets: tickets.length,
            totalRevenue: tickets.reduce((sum, t) => sum + t.totalAmount, 0),
            totalSeats: tickets.reduce((sum, t) => sum + t.numberOfSeats, 0),
            lastTicket: tickets[tickets.length - 1] ?? null,
          };
        })
      );
    })
  );
}
}