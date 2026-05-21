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
import { Observable, from, switchMap, of } from 'rxjs';
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

  /**
   * Calls the recordDriverReturn Cloud Function.
   * The server sets the timestamp and checks GPS —
   * the client only supplies the schedule ID and coordinates.
   */
  recordReturn(payload: RecordReturnPayload): Observable<RecordReturnResult> {
    const fn = httpsCallable<RecordReturnPayload, RecordReturnResult>(
      this.functions,
      'recordDriverReturn',
    );
    return from(fn(payload)).pipe(switchMap((result) => of(result.data)));
  }

  /**
   * Real-time stream of all trips for a given driver,
   * most recent first.
   */
  getDriverTrips(driverId: string): Observable<Trip[]> {
    return collectionData(
      query(
        collection(this.firestore, 'trips'),
        where('driverId', '==', driverId),
        orderBy('departedAt', 'desc'),
      ),
      { idField: 'id' },
    ) as Observable<Trip[]>;
  }

  /** Real-time stream of a single trip */
  getTripById(tripId: string): Observable<Trip | undefined> {
    return docData(doc(this.firestore, 'trips', tripId), { idField: 'id' }) as Observable<
      Trip | undefined
    >;
  }

  /**
   * Real-time stream of the currently active trip for a driver.
   * Emits null if no active trip exists.
   */
  getActiveTrip(driverId: string): Observable<Trip[]> {
    return collectionData(
      query(
        collection(this.firestore, 'trips'),
        where('driverId', '==', driverId),
        where('status', '==', 'in_progress'),
      ),
      { idField: 'id' },
    ) as Observable<Trip[]>;
  }
}
