export type TicketStatus = 'active' | 'used' | 'expired' | 'refunded';

export interface Ticket {
  id: string;
  customerId: string;
  scheduleId: string;
  routeId: string;
  passengerCount: number;
  fareGHS: number;
  status: TicketStatus;
  qrPayload: string;
  paymentId: string;
  purchasedAt: Date;
  usedAt?: Date;
  scannedBy?: string;
}
