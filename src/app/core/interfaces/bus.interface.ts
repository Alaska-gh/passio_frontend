export type BusStatus = 'active' | 'inactive' | 'maintenance';

export interface Bus {
  id: string;
  plateNumber: string;
  movingBus: boolean;
  capacity: number;
  status: BusStatus;
  model?: string;
  assignedDriverId?: string;
  createdAt: Date;
  busType: string
}
