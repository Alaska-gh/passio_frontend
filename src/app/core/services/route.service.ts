import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable, delay, from, of } from 'rxjs';
import { BusRoute, RouteStop } from '@core/interfaces/route.interface';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  /** Real-time stream of all active routes */
  getActiveRoutes(): Observable<BusRoute[]> {
    const useMock = true;

  if (useMock) {
    return of([
      {
        id: '1',
        origin: 'Accra',
        destination: 'Kumasi',
        stops: [
          { name: 'Nsawam' },
          { name: 'Nkawkaw' }
        ] as RouteStop[],
        distanceKm: 250,
        estimatedDurationMin: 240,
        fareGHS: 120,
        active: true,
        destinationLat: 6.6885,
        destinationLng: -1.6244,
        times: ['05:00 AM', '07:00 AM', '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],

      },
      {
        id: '2',
        origin: 'Accra',
        destination: 'Takoradi',
        stops: [],
        distanceKm: 220,
        estimatedDurationMin: 210,
        fareGHS: 100,
            times: ['05:00 AM', '07:00 AM', '09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],

        active: true
      }
    ]).pipe(delay(500));
   }
    return runInInjectionContext(this.injector, () => {
      const routesRef = collection(this.firestore, 'routes');
      const q = query(routesRef, where('active', '==', true));
      return collectionData(q, { idField: 'id' }) as Observable<BusRoute[]>;
    });
  }

  /** Real-time stream of a single route */
  getRouteById(id: string): Observable<BusRoute | undefined> {
    return runInInjectionContext(this.injector, () => {
      return docData(doc(this.firestore, 'routes', id), { idField: 'id' }) as Observable<
        BusRoute | undefined
      >;
    });
  }

  /** Create a new route — admin only */
  createRoute(route: Omit<BusRoute, 'id'>): Observable<void> {
    return from(
      addDoc(collection(this.firestore, 'routes'), {
        ...route,
        createdAt: serverTimestamp(),
      }).then(() => undefined),
    );
  }

  /** Update route fields — admin only */
  updateRoute(id: string, changes: Partial<BusRoute>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'routes', id), changes));
  }
}
