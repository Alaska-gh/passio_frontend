import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, from, switchMap, of, defer, map, tap } from 'rxjs';
import { Trip } from '@core/interfaces/trip.interface';
import { Bus } from '@core/interfaces';

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
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  getOrCreateTrip(
    route: string,
    origin: string,
    destination: string,
    date: string,
    time: string,
    pricePerSeat: number,
  ): Observable<Trip> {
    console.log('getOrCreateTrip called');
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        console.log('inside injection context');
        const tripsRef = collection(this.firestore, 'trips');
        const q = query(
          tripsRef,
          where('route', '==', route),
          where('date', '==', date),
          where('time', '==', time)
        );

        return from(getDocs(q)).pipe(
          tap((trip) => console.log('Loaded trip', trip)
          ),
          switchMap((snapshot) => {
            if (!snapshot.empty) {
              const docSnap = snapshot.docs[0];
              const trip: Trip = { id: docSnap.id, ...docSnap.data() } as Trip;
              return of(trip); // wrap in array so it emits as observable
            }

            const newTrip: Omit<Trip, 'id'> = {
              route,
              origin,
              destination,
              date,
              time,
              totalSeats: 14,
              bookedSeats: 0,
              availableSeats: 14,
              pricePerSeat,
              // buss
            };

            return from(addDoc(tripsRef, newTrip)).pipe(
              tap((trip) => console.log('New trip created', trip)
              ),
              map((docRef) => ({ id: docRef.id, ...newTrip } as Trip))
            );
          })
        );
      })
    );
  }
}
