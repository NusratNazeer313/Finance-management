import {
  AppNotification,
  Bill,
  Budget,
  Category,
  Goal,
  Insight,
  Transaction,
  User,
} from '../types';
import { apiRequest } from './api';

export type AuthResponse = {
  token: string;
  user: User & { id?: string };
};

export type DashboardOverview = {
  user: User;
  balance: {
    total: number;
    income: number;
    expense: number;
    savings: number;
    incomeChange: number;
    expenseChange: number;
    savingsChange: number;
  };
  balanceChartData: number[];
  recentTransactions: Transaction[];
  unreadNotifications: number;
};

export type InsightsResponse = {
  healthScore: number;
  insights: Insight[];
  recommendation: string;
};

type MonthlyPoint = { month: string; amount: number };
type CategoryTotal = { category: string; amount: number; color: string };

export type ReportSummary = {
  balance: DashboardOverview['balance'];
  expenseChartData: MonthlyPoint[];
  incomeChartData: MonthlyPoint[];
  netWorthChartData: number[];
  categoryBreakdown: CategoryTotal[];
  incomeBreakdown: CategoryTotal[];
};

export type TransactionInput = {
  title?: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  notes?: string;
  date?: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  register: (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
};

export const dashboardApi = {
  getOverview: () => apiRequest<DashboardOverview>('/dashboard/overview'),
};

export const transactionsApi = {
  list: () => apiRequest<Transaction[]>('/transactions'),
  create: (payload: TransactionInput) =>
    apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: payload,
    }),
  update: (id: string, payload: TransactionInput) =>
    apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: payload,
    }),
  remove: (id: string) => apiRequest<null>(`/transactions/${id}`, { method: 'DELETE' }),
};

export const categoriesApi = {
  list: () => apiRequest<Category[]>('/categories'),
};

export const budgetsApi = {
  list: () => apiRequest<Budget[]>('/budgets'),
  create: (payload: { category: string; amount: number }) =>
    apiRequest<Budget>('/budgets', {
      method: 'POST',
      body: payload,
    }),
};

export const goalsApi = {
  list: () => apiRequest<Goal[]>('/goals'),
  create: (payload: { name: string; target: number; current?: number }) =>
    apiRequest<Goal>('/goals', {
      method: 'POST',
      body: payload,
    }),
};

export const billsApi = {
  list: () => apiRequest<Bill[]>('/bills'),
  create: (payload: { name: string; amount: number; dueDate?: string }) =>
    apiRequest<Bill>('/bills', {
      method: 'POST',
      body: payload,
    }),
  setPaid: (id: string, paid: boolean) =>
    apiRequest<Bill>(`/bills/${id}`, {
      method: 'PATCH',
      body: { paid },
    }),
  remove: (id: string) => apiRequest<null>(`/bills/${id}`, { method: 'DELETE' }),
};

export const notificationsApi = {
  list: () => apiRequest<AppNotification[]>('/notifications'),
  markAllRead: () =>
    apiRequest<AppNotification[]>('/notifications/read-all', { method: 'POST' }),
};

export const insightsApi = {
  list: () => apiRequest<InsightsResponse>('/insights'),
};

export const reportsApi = {
  getSummary: () => apiRequest<ReportSummary>('/reports/summary'),
};

export const profileApi = {
  get: () => apiRequest<User>('/profile'),
  update: (payload: { name: string }) =>
    apiRequest<User>('/profile', {
      method: 'PUT',
      body: payload,
    }),
};
