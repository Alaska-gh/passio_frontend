import { Bus } from "./bus.interface";

export interface Trip {
  id?: string;
  route: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  // buss: Bus
}
