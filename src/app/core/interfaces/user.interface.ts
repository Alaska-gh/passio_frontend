export type UserRole = 'customer' | 'admin' | 'driver' | 'conductor';

export interface User {
  uid: string;
  phone: string;
  name?: string;
  role: UserRole;
  isNewUser?: boolean;
  createdAt: Date;
  fcmToken?: string;
}
