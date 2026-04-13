import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
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

  purchaseTicket(payload: PurchasePayload): Promise<PurchaseResult> {
    return httpsCallable<PurchasePayload, PurchaseResult>(
      this.functions,
      'purchaseTicket',
    )(payload).then((r) => r.data);
  }

  verifyTicket(qrPayload: string): Promise<VerifyResult> {
    return httpsCallable<{ qrPayload: string }, VerifyResult>(
      this.functions,
      'verifyTicket',
    )({ qrPayload }).then((r) => r.data);
  }

  getMyTickets(): Observable<Ticket[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return new Observable((s) => s.complete());
    const q = query(
      collection(this.firestore, 'tickets'),
      where('customerId', '==', uid),
      orderBy('purchasedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Ticket[]>;
  }

  getTicketById(id: string): Observable<Ticket | undefined> {
    return docData(doc(this.firestore, 'tickets', id), { idField: 'id' }) as Observable<
      Ticket | undefined
    >;
  }
}
