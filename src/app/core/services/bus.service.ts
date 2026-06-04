import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { Bus, Trip } from "@core/interfaces";
import { addDoc, collection, doc, Firestore, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { defer, from, map, Observable, switchMap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BusService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  getAllBuses(): Observable<Bus[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const busesRef = collection(this.firestore, 'busses');
        const q = query(busesRef, orderBy('queueOrder', 'asc'));
        return from(getDocs(q)).pipe(
          map(snapshot =>
            snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bus))
          )
        );
      })
    );
  }

  addBus(bus: Omit<Bus, 'id' | 'queueOrder' | 'status'>): Observable<Bus> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const busesRef = collection(this.firestore, 'busses');

        // Get current max queueOrder among active buses
        const q = query(
          busesRef,
          where('status', '==', 'active'),
          orderBy('queueOrder', 'desc'),
          limit(1)
        );

        return from(getDocs(q)).pipe(
          switchMap((snapshot) => {
            const maxOrder = snapshot.empty
              ? 0
              : (snapshot.docs[0].data()['queueOrder'] as number);

            const newBus: Omit<Bus, 'id'> = {
              ...bus,
              status: 'active',
              queueOrder: maxOrder + 1,
            };

            return from(addDoc(busesRef, newBus)).pipe(
              map(ref => ({ id: ref.id, ...newBus } as Bus))
            );
          })
        );
      })
    );
  }

  updateBus(busId: string, updates: Partial<Omit<Bus, 'id'>>): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const busRef = doc(this.firestore, 'busses', busId);
        return from(updateDoc(busRef, { ...updates }));
      })
    );
  }

  // Set bus active — joins back of queue
  setBusActive(busId: string): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const busesRef = collection(this.firestore, 'busses');
        const busRef = doc(this.firestore, 'busses', busId);
        const q = query(
          busesRef,
          where('status', '==', 'active'),
          orderBy('queueOrder', 'desc'),
          limit(1)
        );
        return from(getDocs(q)).pipe(
          switchMap((snapshot) => {
            const maxOrder = snapshot.empty
              ? 0
              : (snapshot.docs[0].data()['queueOrder'] as number);
            return from(updateDoc(busRef, {
              status: 'active',
              queueOrder: maxOrder + 1,
            }));
          })
        );
      })
    );
  }

  // Set bus inactive — clear queue order
  setBusInactive(busId: string): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const busRef = doc(this.firestore, 'busses', busId);
        return from(updateDoc(busRef, {
          status: 'inactive',
          queueOrder: null,
        }));
      })
    );
  }

  getBusTripHistory(busId: string): Observable<Trip[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const tripsRef = collection(this.firestore, 'trips');
        const q = query(
          tripsRef,
          where('busId', '==', busId),
          orderBy('date', 'desc'),
          limit(20)
        );
        return from(getDocs(q)).pipe(
          map(snapshot =>
            snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Trip))
          )
        );
      })
    );
  }
}