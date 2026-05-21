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
  orderBy,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Schedule, ScheduleStatus } from '@core/interfaces/schedule.interface';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private firestore = inject(Firestore);

  /**
   * Real-time stream of all non-cancelled schedules for a given date,
   * ordered by queue position.
   */
  getSchedulesByDate(date: string): Observable<Schedule[]> {
    return collectionData(
      query(
        collection(this.firestore, 'schedules'),
        where('date', '==', date),
        where('status', '!=', 'cancelled'),
        orderBy('queuePosition'),
      ),
      { idField: 'id' },
    ) as Observable<Schedule[]>;
  }

  /**
   * Real-time stream of schedules for a specific route and date,
   * ordered by departure time.
   */
  getSchedulesByRoute(routeId: string, date: string): Observable<Schedule[]> {
    return collectionData(
      query(
        collection(this.firestore, 'schedules'),
        where('routeId', '==', routeId),
        where('date', '==', date),
        orderBy('departureTime'),
      ),
      { idField: 'id' },
    ) as Observable<Schedule[]>;
  }

  /** Real-time stream of a single schedule */
  getById(scheduleId: string): Observable<Schedule | undefined> {
    return docData(doc(this.firestore, 'schedules', scheduleId), { idField: 'id' }) as Observable<
      Schedule | undefined
    >;
  }

  /** Create a new schedule — admin only */
  create(schedule: Omit<Schedule, 'id' | 'createdAt'>): Observable<void> {
    return from(
      addDoc(collection(this.firestore, 'schedules'), {
        ...schedule,
        seatsRemaining: schedule.seatsTotal,
        createdAt: serverTimestamp(),
      }).then(() => undefined),
    );
  }

  /** Update schedule status — admin only */
  updateStatus(id: string, status: ScheduleStatus): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'schedules', id), { status }));
  }
}
