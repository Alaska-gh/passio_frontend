export type BusStatus = 'active' | 'inactive' | 'maintenance' | 'on-trip';

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: BusStatus;
  model?: string;
  driverId: string | null;
  driverName: string | null;
  createdAt?: Date;
  busType: string;
  queueOrder: number | null;
  currentRoute?: string;
  currentTripId?: string;
  trackingSessionId?: string;
  trackingJoinToken?: string;
}

export interface BusRequest {
  id?: string;
  plateNumber: string;
  busType: 'normal' | 'express' | 'vip';
  capacity: number;
  driverId: string;
  driverName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}