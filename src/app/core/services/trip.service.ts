import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  orderBy,
  limit,
  runTransaction,
  increment,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, from, switchMap, of, defer, map, tap } from 'rxjs';
import { Trip } from '@core/interfaces/trip.interface';
import { Bus, Ticket } from '@core/interfaces';

@Injectable({ providedIn: 'root' })
export class TripService {


  private firestore = inject(Firestore);
  private injector = inject(Injector);

  private rotationRef = doc(this.firestore, 'loadingSystem', 'bussRotation');

  // Get the current moving bus
  getMovingBus(): Observable<Bus | null> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        return from(getDoc(this.rotationRef)).pipe(
          switchMap((snapshot) => {
            if (!snapshot.exists()) return of(null);

             const data = snapshot.data() as { movingBusId: string };

            if (data?.movingBusId) {
              const busRef = doc(this.firestore, 'busses', data.movingBusId);
              return from(getDoc(busRef)).pipe(
                map((busSnap) => {
                  if (!busSnap.exists()) return null;
                  return { id: busSnap.id, ...busSnap.data() } as Bus;
                })
              );
            }

          const busesRef = collection(this.firestore, 'busses');
          const q = query(
            busesRef,
            where('status', '==', 'active'),
            orderBy('queueOrder', 'asc')
          );

          return from(getDocs(q)).pipe(
            switchMap((snapshot) => {
              if(snapshot.empty) return of(null);

              const buses = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bus));

              const firstBus = buses[0];

               return from(updateDoc(this.rotationRef, { movingBusId: firstBus.id })).pipe(
                map(() => firstBus)
              );
            })
          )

          })
        );
      })
    );
  }

  // Get the open trip for the current moving bus on a given route and date
  getOpenTrip(busId: string, route: string, date: string): Observable<Trip | null> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const tripsRef = collection(this.firestore, 'trips');
        const q = query(
          tripsRef,
          where('busId', '==', busId),
          where('route', '==', route),
          where('date', '==', date),
          where('status', '==', 'open'),
          limit(1)
        );
        return from(getDocs(q)).pipe(
          map((snapshot) => {
            if (snapshot.empty) return null;
            const d = snapshot.docs[0];
            return { id: d.id, ...d.data() } as Trip;
          })
        );
      })
    );
  }

  // Create a new trip for a bus
  createTrip(bus: Bus, route: string, origin: string,
     destination: string, date: string, pricePerSeat: number): Observable<Trip> {
    return defer(() =>
      runInInjectionContext(this.injector, () => {
        const tripsRef = collection(this.firestore, 'trips');
        const newTrip: Omit<Trip, 'id'> = {
          busId: bus.id,
          busPlateNumber: bus.plateNumber,
          queueOrder: bus.queueOrder,
          route,
          origin,
          destination,
          date,
          totalSeats: bus.capacity,
          bookedSeats: 0,
          availableSeats: bus.capacity,
          pricePerSeat,
          status: 'open',
        };
        return from(addDoc(tripsRef, newTrip)).pipe(
          map((docRef) => ({ id: docRef.id, ...newTrip } as Trip))
        );
      })
    );
  }

  getNextBus(currentQueueOrder: number, excludeBusId?: string): Observable<Bus | null> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const busesRef = collection(this.firestore, 'busses');

      const q = query(
        busesRef,
        where('queueOrder', '>', currentQueueOrder),
        where('status', '==', 'active'),
        orderBy('queueOrder', 'asc'),
        limit(1)
      );

      return from(getDocs(q)).pipe(
        switchMap((snapshot) => {
          if (!snapshot.empty) {
            const d = snapshot.docs[0];
            return of({ id: d.id, ...d.data() } as Bus);
          }

          // Wrap around — fetch ALL active buses ordered by queueOrder
          const wrapQuery = query(
            busesRef,
            where('status', '==', 'active'),
            orderBy('queueOrder', 'asc')  // no limit — works for any fleet size
          );

          return from(getDocs(wrapQuery)).pipe(
            map((wrapSnapshot) => {
              if (wrapSnapshot.empty) return null;

              const candidates = wrapSnapshot.docs
                .map(d => ({ id: d.id, ...d.data() } as Bus))
                .filter(b => b.id !== excludeBusId); // exclude the one that just filled

              return candidates.length > 0 ? candidates[0] : null;
            })
          );
        })
      );
    })
  );
}
  // In TripService — combine both operations

// issueSeatAndSaveTicket(ticket: Ticket, tripId: string, busId: string,
//   seatsToBook: number, currentQueueOrder: number, route: string,
//   origin: string, destination: string, date: string,
//   pricePerSeat: number
// ): Observable<{ ticketId: string; trip: Trip; rotated: boolean }> {
//   return defer(() =>
//     runInInjectionContext(this.injector, () => {
//       const tripRef = doc(this.firestore, 'trips', tripId);
//       const currentBusRef = doc(this.firestore, 'busses', busId);
//       const ticketsRef = collection(this.firestore, 'tickets');
//       const newTicketRef = doc(ticketsRef);

//       return this.getNextBus(currentQueueOrder).pipe(
//         switchMap((nextBus) => {
//           const nextBusRef = nextBus
//             ? doc(this.firestore, 'busses', nextBus.id)
//             : null;

//           return from(
//             runTransaction(this.firestore, async (transaction) => {
//               const tripSnap = await transaction.get(tripRef);
//               const busSnap = await transaction.get(currentBusRef);
//               const nextBusSnap = nextBusRef ? await transaction.get(nextBusRef): null;
//               const rotationSnap = await transaction.get(this.rotationRef);

//               if (!tripSnap.exists()) throw new Error('Trip not found');
//               if (!busSnap.exists()) throw new Error('Bus not found');
//               if (!rotationSnap.exists()) throw new Error('Rotation config not found');

//               const trip = tripSnap.data() as Trip;

//               if (trip.availableSeats < seatsToBook) {
//                 throw new Error(`Only ${trip.availableSeats} seats available`);
//               }

//               const newBookedSeats = trip.bookedSeats + seatsToBook;
//               const newAvailableSeats = trip.availableSeats - seatsToBook;
//               const isFull = newAvailableSeats === 0;

//               // Update trip seats
//               transaction.update(tripRef, {
//                 bookedSeats: increment(seatsToBook),
//                 availableSeats: increment(-seatsToBook),
//                 status: isFull ? 'full' : 'open',
//               });

//               // Save ticket atomically with seat update
//               transaction.set(newTicketRef, { ...ticket });

//               if (isFull && nextBus) {
//                  transaction.update(this.rotationRef, { movingBusId: nextBus.id });
//               }

//               return {
//                 ticketId: newTicketRef.id,
//                 updatedTrip: {
//                   ...trip,
//                   id: tripId,
//                   bookedSeats: newBookedSeats,
//                   availableSeats: newAvailableSeats,
//                   status: isFull ? 'full' : 'open',
//                 } as Trip,
//                 isFull,
//                 nextBus,
//               };
//             })
//           ).pipe(
//             switchMap(({ ticketId, updatedTrip, isFull, nextBus }) => {
//               if (!isFull) {
//                 return of({ ticketId, trip: updatedTrip, rotated: false });
//               }

//               if (!nextBus) {
//                 console.warn('No next bus found for rotation');
//                 return of({ ticketId, trip: updatedTrip, rotated: false });
//               }

//               return this.createTrip(nextBus, route, origin, destination, date, pricePerSeat).pipe(
//                 map(() => ({ ticketId, trip: updatedTrip, rotated: true })),
//                 tap(() => console.log('[Rotated to bus]', nextBus.id))
//               );
//             })
//           );
//         })
//       );
//     })
//   );
// }

issueSeatAndSaveTicket(
  ticket: Ticket, tripId: string, busId: string,
  seatsToBook: number, currentQueueOrder: number, route: string,
  origin: string, destination: string, date: string,
  pricePerSeat: number
): Observable<{ ticketId: string; trip: Trip; rotated: boolean }> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const tripRef = doc(this.firestore, 'trips', tripId);
      const currentBusRef = doc(this.firestore, 'busses', busId);
      const ticketsRef = collection(this.firestore, 'tickets');
      const newTicketRef = doc(ticketsRef);

      return from(
        runTransaction(this.firestore, async (transaction) => {
          const tripSnap = await transaction.get(tripRef);
          const rotationSnap = await transaction.get(this.rotationRef);

          if (!tripSnap.exists()) throw new Error('Trip not found');
          if (!rotationSnap.exists()) throw new Error('Rotation config not found');

          const trip = tripSnap.data() as Trip;

          if (trip.availableSeats < seatsToBook) {
            throw new Error(`Only ${trip.availableSeats} seats available`);
          }

          const newBookedSeats = trip.bookedSeats + seatsToBook;
          const newAvailableSeats = trip.availableSeats - seatsToBook;
          const isFull = newAvailableSeats === 0;

          transaction.update(tripRef, {
            bookedSeats: increment(seatsToBook),
            availableSeats: increment(-seatsToBook),
            status: isFull ? 'full' : 'open',
          });

          transaction.set(newTicketRef, { ...ticket });

           if (isFull) {
            transaction.update(currentBusRef, {
              status: 'on-trip',
              queueOrder: null,
            });
          }

          return {
            ticketId: newTicketRef.id,
            updatedTrip: {
              ...trip, id: tripId,
              bookedSeats: newBookedSeats,
              availableSeats: newAvailableSeats,
              status: isFull ? 'full' : 'open',
            } as Trip,
            isFull,
          };
        })
      ).pipe(
        switchMap(({ ticketId, updatedTrip, isFull }) => {
          if (!isFull) return of({ ticketId, trip: updatedTrip, rotated: false });

          return this.getNextBus(currentQueueOrder, busId).pipe( 
            switchMap((nextBus) => {
              if (!nextBus) {
                  console.warn('All buses full — resetting rotation');
                  return from(updateDoc(this.rotationRef, { movingBusId: '' })).pipe(
                    map(() => ({ ticketId, trip: updatedTrip, rotated: false }))
                  );
              }

              return from(updateDoc(this.rotationRef, { movingBusId: nextBus.id })).pipe(
                switchMap(() =>
                  this.createTrip(nextBus, route, origin, destination, date, pricePerSeat)
                ),
                map(() => ({ ticketId, trip: updatedTrip, rotated: true })),
                tap(() => console.log('[Rotated to bus]', nextBus.id))
              );
            })
          );
        })
      );
    })
  );
}

  getCurrentTrip(route: string, origin: string, destination: string,
   date: string, pricePerSeat: number): Observable<Trip | null> {
  return this.getMovingBus().pipe(
    tap(bus => console.log('[Moving Bus]', bus)),
    switchMap((movingBus) => {
      if (!movingBus) throw new Error('No active bus available for this route right now');

      return this.getOpenTrip(movingBus.id, route, date).pipe(
        tap(trip => console.log('[getCurrentTrip] Found trip:', trip?.id,
          'available:', trip?.availableSeats)),
        switchMap((existingTrip) => {
          if (existingTrip) return of(existingTrip);

          // No open trip yet for this bus — create one
          return this.createTrip(movingBus, route, origin, destination, date, pricePerSeat);
        })
      );
    })
  );
}

// for drivers to report thier return to join the queue
reportReturn(busId: string): Observable<void> {
  return defer(() =>
    runInInjectionContext(this.injector, () => {
      const busesRef = collection(this.firestore, 'busses');
      const busRef = doc(this.firestore, 'busses', busId);

      // Find current max queueOrder among active buses
      const q = query(
        busesRef,
        where('status', '==', 'active'),
        orderBy('queueOrder', 'desc'),
        limit(1)
      );

      return from(getDocs(q)).pipe(
        switchMap((snapshot) => {
          const maxQueueOrder = snapshot.empty
            ? 0  // no active buses — this bus becomes first in queue
            : (snapshot.docs[0].data()['queueOrder'] as number);

          const newQueueOrder = maxQueueOrder + 1;

          return from(updateDoc(busRef, {
            status: 'active',
            queueOrder: newQueueOrder,
            returnedAt: new Date(), // ✅ useful for audit/admin view
          }));
        })
      );
    })
  );
}
}