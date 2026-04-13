export type TripStatus = 'in_progress' | 'returned';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  scheduleId: string;
  busId: string;
  driverId: string;
  status: TripStatus;
  departedAt: Date;
  returnedAt?: Date;
  returnGPS?: GeoPoint;
  flagged: boolean;
  flagReason?: string;
}
