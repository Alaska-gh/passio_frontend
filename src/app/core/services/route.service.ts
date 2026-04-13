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
import { Observable } from 'rxjs';
import { BusRoute } from '@core/interfaces/route.interface';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private firestore = inject(Firestore);

  getActiveRoutes(): Observable<BusRoute[]> {
    return collectionData(
      query(collection(this.firestore, 'routes'), where('active', '==', true)),
      { idField: 'id' },
    ) as Observable<BusRoute[]>;
  }

  getRouteById(id: string): Observable<BusRoute | undefined> {
    return docData(doc(this.firestore, 'routes', id), { idField: 'id' }) as Observable<
      BusRoute | undefined
    >;
  }

  createRoute(route: Omit<BusRoute, 'id'>): Promise<void> {
    return addDoc(collection(this.firestore, 'routes'), {
      ...route,
      createdAt: serverTimestamp(),
    }).then(() => undefined);
  }

  updateRoute(id: string, changes: Partial<BusRoute>): Promise<void> {
    return updateDoc(doc(this.firestore, 'routes', id), changes as Record<string, BusRoute>);
  }
}
