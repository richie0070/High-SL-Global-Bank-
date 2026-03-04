
import { User, Loan, Transaction } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'user',
    balance: 124500.50,
    accountType: 'Wealth Management Account',
    accountNumber: 'HSL-8892-1102',
    status: 'Active',
    riskScore: 'Low',
    kycLevel: 3,
    lastLoginIp: '192.168.1.42',
    joinedDate: '2022-03-15',
    dob: 'Oct 24, 1988',
    ssn: '***-**-4451',
    employmentStatus: 'Self-Employed',
    residentialAddress: '123 Financial District, Suite 400, New York, NY 10005',
    phoneNumber: '+1 (555) 123-4567'
  },
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    role: 'user',
    balance: 84200.00,
    accountType: 'Business Account',
    accountNumber: 'HSL-8892-3341',
    status: 'Active',
    riskScore: 'Medium',
    kycLevel: 2,
    lastLoginIp: '10.0.0.55',
    joinedDate: '2023-01-10',
    dob: 'Jan 12, 1992',
    ssn: '***-**-8821',
    employmentStatus: 'Employed',
    residentialAddress: '456 Tech Boulevard, San Francisco, CA 94105',
    phoneNumber: '+1 (415) 987-6543'
  },
  {
    id: 'admin1',
    name: 'High SL Admin',
    email: 'highslbankingservices@gmail.com',
    role: 'admin',
    balance: 999999999.99,
    accountType: 'Wealth Management Account',
    accountNumber: 'HSL-ADMIN-001',
    status: 'Active',
    riskScore: 'Low',
    kycLevel: 3,
    lastLoginIp: '127.0.0.1',
    joinedDate: '2020-01-01',
    dob: 'Jan 01, 1980',
    ssn: '***-**-0001',
    employmentStatus: 'Employed',
    residentialAddress: '1 High SL Tower, London, UK',
    phoneNumber: '+44 20 7946 0958'
  }
];

export interface BeneficiaryInfo {
  name: string;
  bank: string;
  network: string;
  branchCode?: string;
  accountType: string;
  region: string;
  currency: string;
  nodeStatus: 'Verified' | 'Unregistered';
}

export const MOCK_RECIPIENTS: Record<string, BeneficiaryInfo> = {
  '8037375289': { 
    name: 'Opay User (Paycom Verified)', 
    bank: 'OPay Digital Services (Paycom)', 
    network: 'NIP/NIBSS Protocol',
    accountType: 'Mobile Wallet',
    region: 'Nigeria',
    currency: 'NGN',
    nodeStatus: 'Verified'
  },
  '4122283540': { 
    name: 'K Pietersen', 
    bank: 'ABSA Group', 
    network: 'BankServAfrica RTC',
    branchCode: '632005',
    accountType: 'Cheque',
    region: 'South Africa',
    currency: 'ZAR',
    nodeStatus: 'Verified'
  },
  '1234567890': {
    name: 'Alice Springer',
    bank: 'JPMorgan Chase',
    network: 'FedWire',
    accountType: 'Savings',
    region: 'North America (FedWire/NACHA)',
    currency: 'USD',
    nodeStatus: 'Verified'
  }
};

export const BANK_NETWORKS = {
  'South Africa (BankServAfrica/RTC)': [
    'ABSA Group',
    'Capitec Bank',
    'First National Bank (FNB)',
    'Standard Bank',
    'Nedbank',
    'Discovery Bank'
  ],
  'Nigeria (NIBSS/NIP)': [
    'OPay Digital Services (Paycom)',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'Guaranty Trust Bank (GTCO)',
    'Access Bank',
    'PalmPay'
  ],
  'North America (FedWire/NACHA)': [
    'JPMorgan Chase', 
    'Bank of America', 
    'Wells Fargo', 
    'Citibank', 
    'TD Bank, N.A.'
  ],
  'Europe (SEPA/TARGET2)': [
    'HSBC Holdings', 
    'BNP Paribas', 
    'Deutsche Bank', 
    'Revolut', 
    'Wise'
  ]
};

export const MOCK_LOANS: Loan[] = [
  {
    id: 'l1',
    userId: 'u1',
    userName: 'Sarah Jenkins',
    amount: 50000,
    status: 'Approved',
    dateApplied: '2023-10-15',
    purpose: 'Luxury Vehicle'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2024-03-20',
    description: 'Apple Store NY',
    amount: 1299.00,
    type: 'debit',
    status: 'Completed',
    network: 'Apple Pay',
    reference: 'TRX-112233',
    sender: 'Sarah Jenkins',
    recipient: 'Apple Inc.',
    senderAccount: 'HSL-8892-1102',
    recipientAccount: 'APL-9922-3344',
    notes: 'MacBook Pro 16" Purchase'
  },
  {
    id: 't2',
    date: '2024-03-18',
    description: 'Wire Transfer - London',
    amount: 5500.00,
    type: 'credit',
    status: 'Completed',
    network: 'SWIFT',
    reference: 'SWF-998877',
    sender: 'Barclays PLC',
    recipient: 'Sarah Jenkins',
    senderAccount: 'BARC-2233-4455',
    recipientAccount: 'HSL-8892-1102',
    notes: 'Consulting Retainer Q1'
  },
  {
    id: 't3',
    date: '2024-03-15',
    description: 'Salary Deposit',
    amount: 12500.00,
    type: 'credit',
    status: 'Completed',
    network: 'ACH',
    reference: 'ACH-554433',
    sender: 'Tech Corp Inc.',
    recipient: 'Sarah Jenkins',
    senderAccount: 'TCI-1122-3344',
    recipientAccount: 'HSL-8892-1102',
    notes: 'March 2024 Salary'
  },
  {
    id: 't4',
    date: '2024-03-10',
    description: 'Opay Transfer',
    amount: 150.00,
    type: 'debit',
    status: 'Completed',
    network: 'NIP/NIBSS',
    reference: 'NIP-223344',
    sender: 'Sarah Jenkins',
    recipient: 'Opay User',
    senderAccount: 'HSL-8892-1102',
    recipientAccount: 'OPY-5566-7788',
    notes: 'Freelance Payment'
  }
];
