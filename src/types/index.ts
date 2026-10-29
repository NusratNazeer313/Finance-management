export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  icon: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  spent: number;
  total: number;
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'today' | 'tomorrow' | 'upcoming' | 'overdue' | 'paid';
  paid: boolean;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'reminder';
  title: string;
  body: string;
  target: 'Bills' | 'Budget';
  read: boolean;
}

export interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
