import { Bus } from "./bus.interface";

export interface Trip {
  id?: string;
  route: string;
  origin: string;
  destination: string;
  date: string;
  queueOrder: number | null
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  busId: string
  busPlateNumber: string
  status: 'open' | 'full' | 'departed';
}
