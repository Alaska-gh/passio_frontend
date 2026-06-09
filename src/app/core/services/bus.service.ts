import { inject, Injectable, Injector, runInInjectionContext } from "@angular/core";
import { addDoc, collection, doc, Firestore, getDocs, limit, orderBy, query, runTransaction, updateDoc, where } from "@angular/fire/firestore";
import { Bus, BusRequest, Trip, User } from "@core/interfaces";
import { catchError, defer, from, map, Observable, of, switchMap, tap } from "rxjs";

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
              map(ref => ({ id: ref.id, ...newBus } as Bus)),
              catchError((err) => {
                return of(err)
              })
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
          ),
          catchError(err => {
            return of(err);
          })
        );
      })
    );
  }

  getDrivers(): Observable<User[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('role', '==', 'driver'));
        return from(getDocs(q)).pipe(
          map(snapshot =>
            snapshot.docs.map(d => {
              const data = d.data() as User

              return {
                id: d.id,
                ...data
              }
            })
          )
        );
      })
    );
  }

  // Search bus by plate number
searchBusByPlate(plateNumber: string): Observable<Bus | null> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const busesRef = collection(this.firestore, 'busses');
      const q = query(
        busesRef,
        where('plateNumber', '==', plateNumber.toUpperCase().trim()),
        limit(1)
      );
      return from(getDocs(q)).pipe(
        map(snapshot => {
          if (snapshot.empty) return null;
          const d = snapshot.docs[0];
          return { id: d.id, ...d.data() } as Bus;
        })
      );
    })
  );
}

// Sign on to existing bus
signOnToBus(busId: string, driverId: string, driverName: string): Observable<void> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const busRef = doc(this.firestore, 'busses', busId);
      return from(updateDoc(busRef, { driverId, driverName }));
    })
  );
}

// Submit request for new bus
submitBusRequest(request: Omit<BusRequest, 'id'>): Observable<string> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const requestsRef = collection(this.firestore, 'busRequests');
      return from(addDoc(requestsRef, request)).pipe(
        map(ref => ref.id),
        catchError((err) => {
          console.log(err);
          
          return of(err)
        }
        )
      );
    })
  );
}

  // Get pending request for driver
  getDriverPendingRequest(driverId: string): Observable<BusRequest | null> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const requestsRef = collection(this.firestore, 'busRequests');
        const q = query(
          requestsRef,
          where('driverId', '==', driverId),
          where('status', '==', 'pending'),
          limit(1)
        );
        return from(getDocs(q)).pipe(
          map(snapshot => {
            if (snapshot.empty) return null;
            const d = snapshot.docs[0];
            return this.mapBusRequest(d) as BusRequest;
          })
        );
      })
    );
  }

  // Admin — get all pending requests
  getPendingBusRequests(): Observable<BusRequest[]> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const requestsRef = collection(this.firestore, 'busRequests');
        const q = query(
          requestsRef,
          where('status', '==', 'pending'),
          orderBy('requestedAt', 'asc')
        );
        return from(getDocs(q)).pipe(
          map(snapshot =>
            snapshot.docs.map(d => this.mapBusRequest(d))
          )
        );
      })
    );
  }

  // Admin — approve request
  approveBusRequest(request: BusRequest, adminUid: string): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const requestRef = doc(this.firestore, 'busRequests', request.id!);
        const busesRef = collection(this.firestore, 'busses');

        // Get max queueOrder for new bus
        const q = query(
          busesRef,
          where('status', '==', 'active'),
          orderBy('queueOrder', 'desc'),
          limit(1)
        );

        return from(getDocs(q)).pipe(
          switchMap(snapshot => {
            const maxOrder = snapshot.empty
              ? 0
              : (snapshot.docs[0].data()['queueOrder'] as number);

            const newBus: Omit<Bus, 'id'> = {
              plateNumber: request.plateNumber,
              busType: request.busType,
              capacity: request.capacity,
              status: 'active',
              queueOrder: maxOrder + 1,
              driverId: request.driverId,
              driverName: request.driverName,
            };

            return from(runTransaction(this.firestore, async (transaction) => {
              const newBusRef = doc(busesRef);
              transaction.set(newBusRef, newBus);
              transaction.update(requestRef, {
                status: 'approved',
                reviewedAt: new Date(),
                reviewedBy: adminUid,
              });
            }));
          })
        );
      })
    );
  }

  // Admin — reject request
  rejectBusRequest(requestId: string, adminUid: string): Observable<void> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const requestRef = doc(this.firestore, 'busRequests', requestId);
        return from(updateDoc(requestRef, {
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedBy: adminUid,
        }));
      })
    );
  }

  private mapBusRequest(d: any): BusRequest {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    requestedAt: data.requestedAt?.toDate?.() ?? new Date(data.requestedAt),
    reviewedAt: data.reviewedAt?.toDate?.() ?? null,
  } as BusRequest;
}
}