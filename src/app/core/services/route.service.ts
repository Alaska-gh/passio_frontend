import { Injectable, inject } from '@angular/core';
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
import { Observable, from } from 'rxjs';
import { BusRoute } from '@core/interfaces/route.interface';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private firestore = inject(Firestore);

  /** Real-time stream of all active routes */
  getActiveRoutes(): Observable<BusRoute[]> {
    return collectionData(
      query(collection(this.firestore, 'routes'), where('active', '==', true)),
      { idField: 'id' },
    ) as Observable<BusRoute[]>;
  }

  /** Real-time stream of a single route */
  getRouteById(id: string): Observable<BusRoute | undefined> {
    return docData(doc(this.firestore, 'routes', id), { idField: 'id' }) as Observable<
      BusRoute | undefined
    >;
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
    return from(updateDoc(doc(this.firestore, 'routes', id), changes as Record<string, BusRoute>));
  }
}
