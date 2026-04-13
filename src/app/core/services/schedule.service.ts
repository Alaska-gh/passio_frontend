import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Schedule, ScheduleStatus } from '@core/interfaces/schedule.interface';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private firestore = inject(Firestore);

  getSchedulesByDate(date: string): Observable<Schedule[]> {
    const q = query(
      collection(this.firestore, 'schedules'),
      where('date', '==', date),
      where('status', '!=', 'cancelled'),
      orderBy('queuePosition'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Schedule[]>;
  }

  getSchedulesByRoute(routeId: string, date: string): Observable<Schedule[]> {
    const q = query(
      collection(this.firestore, 'schedules'),
      where('routeId', '==', routeId),
      where('date', '==', date),
      orderBy('departureTime'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Schedule[]>;
  }

  getById(scheduleId: string): Observable<Schedule | undefined> {
    return docData(doc(this.firestore, 'schedules', scheduleId), { idField: 'id' }) as Observable<
      Schedule | undefined
    >;
  }

  create(schedule: Omit<Schedule, 'id' | 'createdAt'>): Promise<void> {
    return addDoc(collection(this.firestore, 'schedules'), {
      ...schedule,
      seatsRemaining: schedule.seatsTotal,
      createdAt: serverTimestamp(),
    }).then(() => undefined);
  }

  updateStatus(id: string, status: ScheduleStatus): Promise<void> {
    return updateDoc(doc(this.firestore, 'schedules', id), { status });
  }
}
