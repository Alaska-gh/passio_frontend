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
import { Bus, BusStatus } from '@core/interfaces/bus.interface';

@Injectable({ providedIn: 'root' })
export class BusService {
  private firestore = inject(Firestore);

  getAllBuses(): Observable<Bus[]> {
    return collectionData(collection(this.firestore, 'buses'), { idField: 'id' }) as Observable<
      Bus[]
    >;
  }

  getActiveBuses(): Observable<Bus[]> {
    return collectionData(
      query(collection(this.firestore, 'buses'), where('status', '==', 'active')),
      { idField: 'id' },
    ) as Observable<Bus[]>;
  }

  getBusById(id: string): Observable<Bus | undefined> {
    return docData(doc(this.firestore, 'buses', id), { idField: 'id' }) as Observable<
      Bus | undefined
    >;
  }

  createBus(bus: Omit<Bus, 'id' | 'createdAt'>): Promise<void> {
    return addDoc(collection(this.firestore, 'buses'), {
      ...bus,
      createdAt: serverTimestamp(),
    }).then(() => undefined);
  }

  updateBus(id: string, changes: Partial<Bus>): Promise<void> {
    return updateDoc(doc(this.firestore, 'buses', id), changes as Record<string, Bus>);
  }

  updateStatus(id: string, status: BusStatus): Promise<void> {
    return updateDoc(doc(this.firestore, 'buses', id), { status });
  }
}
