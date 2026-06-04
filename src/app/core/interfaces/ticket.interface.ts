export type TicketStatus = 'active' | 'used' | 'expired' | 'refunded';

export interface Ticket {
  status: TicketStatus;
  ticketNumber: string;
  tripId: string;
  route: string;
  origin: string;
  destination: string;
  travelDate: string;
  passengerName: string;
  passengerPhone: string;
  numberOfSeats: number;
  pricePerSeat: number;
  totalAmount: number;
  paymentMethod: 'mtn' | 'telecel';
  mobileMoneyNumber: string;
  issuedBy: string;
  issuedAt: Date;
}

export interface DailySummary {
  totalTickets: number;
  totalRevenue: number;
  totalSeats: number;
  lastTicket: Ticket | null;
  activeBuses: number;
  busesOnTrip: number;
}