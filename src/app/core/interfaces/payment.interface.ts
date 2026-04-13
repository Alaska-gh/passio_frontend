export type PaymentProvider = 'mtn_momo' | 'vodafone_cash' | 'card';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  ticketId: string;
  customerId: string;
  amountGHS: number;
  provider: PaymentProvider;
  mobileNumber?: string;
  providerReference?: string;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
}
