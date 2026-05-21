import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  collection,
  collectionData,
  query,
  where,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User, UserRole } from '@core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  /** Real-time stream of a single user profile */
  getUserById(uid: string): Observable<User | undefined> {
    return docData(doc(this.firestore, 'users', uid), { idField: 'uid' }) as Observable<
      User | undefined
    >;
  }

  /** Real-time stream of all users with a given role */
  getUsersByRole(role: UserRole): Observable<User[]> {
    return collectionData(query(collection(this.firestore, 'users'), where('role', '==', role)), {
      idField: 'uid',
    }) as Observable<User[]>;
  }

  /** Update a user's role — admin only */
  updateRole(uid: string, role: UserRole): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'users', uid), { role }));
  }

  /** Save the FCM push token for the current user */
  updateFcmToken(uid: string, token: string): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'users', uid), { fcmToken: token }));
  }
}
