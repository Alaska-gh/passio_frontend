export type TicketStatus = 'active' | 'used' | 'expired' | 'refunded';

export interface Ticket {
  status: TicketStatus;
  ticketNumber: string;
  tripId: string;
  route: string;
  origion: string;
  destination: string;
  travelDate: string;
  timeSlot: string;
  passengerName: string;
  passengerPhone: string;
  numberOfSeats: number;
  pricePerSeat: number;
  totalAmount: number;
  paymentMethod: 'mtn' | 'vodafone';
  mobileMoneyNumber: string;
  issuedBy: string;
  issuedAt: Date;
}
