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
  status: 'open' | 'full';
  trackingSessionId?: string;
  trackingJoinToken?: string;
  trackingStartedAt?: Date;
}

export interface TripTracking {
  id?: string;

  tripId: string;

  originLat: number;
  originLng: number;

  destinationLat: number;
  destinationLng: number;

  currentLat?: number;
  currentLng?: number;

  departedAt?: string;
  arrivedAt?: string;
  returnedAt?: string;

  leftOrigin: boolean;
  reachedDestination: boolean;

  meetSessionId: string;
  meetJoinToken: string;

  trackingEnabled: boolean;
}