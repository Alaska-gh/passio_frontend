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
import { Observable } from 'rxjs';
import { User, UserRole } from '@core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  getUserById(uid: string): Observable<User | undefined> {
    return docData(doc(this.firestore, 'users', uid), { idField: 'uid' }) as Observable<
      User | undefined
    >;
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    const q = query(collection(this.firestore, 'users'), where('role', '==', role));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  updateRole(uid: string, role: UserRole): Promise<void> {
    return updateDoc(doc(this.firestore, 'users', uid), { role });
  }

  updateFcmToken(uid: string, token: string): Promise<void> {
    return updateDoc(doc(this.firestore, 'users', uid), { fcmToken: token });
  }
}
