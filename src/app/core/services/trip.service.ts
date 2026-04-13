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
import { Observable } from 'rxjs';
import { Trip } from '@core/interfaces/trip.interface';

export interface RecordReturnPayload {
  scheduleId: string;
  lat: number;
  lng: number;
}

export interface RecordReturnResult {
  success: boolean;
  queuePosition: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private functions = inject(Functions);
  private firestore = inject(Firestore);

  recordReturn(payload: RecordReturnPayload): Promise<RecordReturnResult> {
    return httpsCallable<RecordReturnPayload, RecordReturnResult>(
      this.functions,
      'recordDriverReturn',
    )(payload).then((r) => r.data);
  }

  getDriverTrips(driverId: string): Observable<Trip[]> {
    const q = query(
      collection(this.firestore, 'trips'),
      where('driverId', '==', driverId),
      orderBy('departedAt', 'desc'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Trip[]>;
  }

  getTripById(tripId: string): Observable<Trip | undefined> {
    return docData(doc(this.firestore, 'trips', tripId), { idField: 'id' }) as Observable<
      Trip | undefined
    >;
  }
}
