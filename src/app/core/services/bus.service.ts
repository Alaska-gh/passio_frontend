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
import { Bus, BusStatus } from '@core/interfaces/bus.interface';

@Injectable({ providedIn: 'root' })
export class BusService {
  private firestore = inject(Firestore);

  /** Real-time stream of all buses */
  getAllBuses(): Observable<Bus[]> {
    return collectionData(collection(this.firestore, 'buses'), { idField: 'id' }) as Observable<
      Bus[]
    >;
  }

  /** Real-time stream of active buses only */
  getActiveBuses(): Observable<Bus[]> {
    return collectionData(
      query(collection(this.firestore, 'buses'), where('status', '==', 'active')),
      { idField: 'id' },
    ) as Observable<Bus[]>;
  }

  /** Real-time stream of a single bus */
  getBusById(id: string): Observable<Bus | undefined> {
    return docData(doc(this.firestore, 'buses', id), { idField: 'id' }) as Observable<
      Bus | undefined
    >;
  }

  /** Create a new bus */
  createBus(bus: Omit<Bus, 'id' | 'createdAt'>): Observable<void> {
    return from(
      addDoc(collection(this.firestore, 'buses'), {
        ...bus,
        createdAt: serverTimestamp(),
      }).then(() => undefined),
    );
  }

  /** Update bus fields */
  updateBus(id: string, changes: Partial<Bus>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'buses', id), changes as Record<string, Bus>));
  }

  /** Update bus status only */
  updateStatus(id: string, status: BusStatus): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'buses', id), { status }));
  }
}
