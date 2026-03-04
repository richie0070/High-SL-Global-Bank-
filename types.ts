
export type Role = 'admin' | 'user';

export type AccountType = 'Savings Account' | 'Cheque Account' | 'Business Account' | 'Wealth Management Account';

export interface FeeConfiguration {
  transferFee: number; // Percentage
  networkFee: number; // Percentage
  electricalFee: number; // Percentage
  loanInterestRate: number; // APR Percentage
  loanOriginationFee: number; // Flat fee
  investmentFee: number; // Percentage
  escrowFee: number; // Percentage
  subjectFee: number; // Flat fee
  maintenanceFee: number; // Flat fee
  overdraftFee: number; // Flat fee
  wireTransferFee: number; // Flat fee
  internationalTransferFee: number; // Flat fee
  atmFee: number; // Flat fee
  latePaymentFee: number; // Flat fee
}

export interface PaymentConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  btcAddress: string;
  ethAddress: string;
  usdtAddress: string;
  paypalEmail: string;
  zelleContact: string;
  cashAppTag: string;
  acceptedGiftCards: string;
}

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'info' | 'warn' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  balance: number;
  accountType?: AccountType;
  accountNumber?: string;
  status?: 'Active' | 'Frozen' | 'Suspended' | 'Pending';
  riskScore?: 'Low' | 'Medium' | 'High' | 'Critical';
  kycLevel?: 1 | 2 | 3;
  lastLoginIp?: string;
  joinedDate?: string;
  dob?: string;
  ssn?: string;
  employmentStatus?: string;
  residentialAddress?: string;
  phoneNumber?: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateApplied: string;
  purpose: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status?: 'Completed' | 'Pending' | 'Processing' | 'Failed' | 'Requires Fee';
  network?: string;
  sender?: string;
  recipient?: string;
  senderAccount?: string;
  recipientAccount?: string;
  notes?: string;
  reference?: string;
  requiredFeeType?: string;
  requiredFeeAmount?: number;
}

export type View = 'landing' | 'login' | 'dashboard' | 'loans' | 'admin' | 'users' | 'transfer' | 'account-details' | 'investments' | 'activity' | 'support' | 'documents' | 'messages' | 'cards' | 'vaults';
