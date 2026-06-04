export type BusStatus = 'active' | 'inactive' | 'maintenance' | 'on-trip';

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: BusStatus;
  model?: string;
  assignedDriverId?: string;
  createdAt: Date;
  busType: string;
  queueOrder: number | null;
}
