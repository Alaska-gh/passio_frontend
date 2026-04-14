import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Auth } from '@angular/fire/auth';
import { Observable, from, switchMap, of } from 'rxjs';
import { Ticket } from '@core/interfaces/ticket.interface';
import { PaymentProvider } from '@core/interfaces/payment.interface';

export interface PurchasePayload {
  scheduleId: string;
  passengerCount: number;
  paymentProvider: PaymentProvider;
  mobileNumber?: string;
}

export interface PurchaseResult {
  ticketId: string;
  paymentReference: string;
  qrPayload: string;
  status: 'success' | 'pending';
}

export interface VerifyResult {
  valid: boolean;
  reason?: 'already_used' | 'expired' | 'wrong_route' | 'invalid_signature' | 'not_found';
  ticket?: Pick<Ticket, 'id' | 'routeId' | 'scheduleId' | 'passengerCount'>;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private functions = inject(Functions);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /**
   * Calls the purchaseTicket Cloud Function.
   * Returns an Observable that emits the result once.
   */
  purchaseTicket(payload: PurchasePayload): Observable<PurchaseResult> {
    const fn = httpsCallable<PurchasePayload, PurchaseResult>(this.functions, 'purchaseTicket');
    return from(fn(payload)).pipe(switchMap((result) => of(result.data)));
  }

  /**
   * Calls the verifyTicket Cloud Function.
   * Used by conductors to validate a QR code.
   */
  verifyTicket(qrPayload: string): Observable<VerifyResult> {
    const fn = httpsCallable<{ qrPayload: string }, VerifyResult>(this.functions, 'verifyTicket');
    return from(fn({ qrPayload })).pipe(switchMap((result) => of(result.data)));
  }

  /**
   * Real-time stream of the current customer's tickets,
   * ordered by purchase date descending.
   */
  getMyTickets(): Observable<Ticket[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return of([]);
    return collectionData(
      query(
        collection(this.firestore, 'tickets'),
        where('customerId', '==', uid),
        orderBy('purchasedAt', 'desc'),
      ),
      { idField: 'id' },
    ) as Observable<Ticket[]>;
  }

  /** Real-time stream of a single ticket by ID */
  getTicketById(id: string): Observable<Ticket | undefined> {
    return docData(doc(this.firestore, 'tickets', id), { idField: 'id' }) as Observable<
      Ticket | undefined
    >;
  }
}
