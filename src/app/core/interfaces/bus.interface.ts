export type BusStatus = 'active' | 'inactive' | 'maintenance';

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: BusStatus;
  model?: string;
  assignedDriverId?: string;
  createdAt: Date;
}
