export type CashAccount = {
  id: string;
  name: string;
  type: 'checking' | 'savings';
  accountNumber: string;
  currentBalance: number;
  currentInflows: number;
  currentOutflows: number;
  surplusDeficit: number;
  owner: {
    name: string;
    avatar?: string;
  };
  yearEndProjected: number;
};

export type Event = {
  id: string;
  type: 'Emergency Savings' | 'Sabbatical' | 'Vacation';
  name: string;
  amount: number;
  date: string;
  progress: 'On Track' | 'Off Track';
};

export type CashFlow = {
  date: string;
  'Ally Checking': number;
  'Chase Checking': number;
  'Chase Savings': number;
}; 
// Add this to your existing types file
export interface ValidationError {
  field: string;
  message: string;
}
