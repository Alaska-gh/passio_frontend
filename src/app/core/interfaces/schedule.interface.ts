export type ScheduleStatus = 'pending' | 'boarding' | 'in_progress' | 'completed' | 'cancelled';

export interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  driverId: string;
  conductorId: string;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  status: ScheduleStatus;
  queuePosition: number;
  seatsTotal: number;
  seatsRemaining: number;
  createdAt: Date;
}
