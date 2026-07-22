import { Bill, Budget, Goal, Insight, Transaction, User } from '../types';

export const mockUser: User = {
  name: 'Nusrat',
  email: 'nusrat@example.com',
};

export const mockBalance = {
  total: 5430.0,
  income: 8200.0,
  expense: 2770.0,
  savings: 1200.0,
  incomeChange: 12.5,
  expenseChange: -3.2,
  savingsChange: 8.1,
};

export const mockTransactions: Transaction[] = [
  { id: '1', title: 'Salary', category: 'Income', amount: 5000, type: 'income', date: '2024-05-15', icon: '💰' },
  { id: '2', title: 'Grocery Store', category: 'Food', amount: 85.5, type: 'expense', date: '2024-05-15', icon: '🛒' },
  { id: '3', title: 'Uber Ride', category: 'Transport', amount: 24.0, type: 'expense', date: '2024-05-14', icon: '🚗' },
  { id: '4', title: 'Freelance', category: 'Income', amount: 1200, type: 'income', date: '2024-05-14', icon: '💻' },
  { id: '5', title: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', date: '2024-05-13', icon: '🎬' },
  { id: '6', title: 'Electric Bill', category: 'Bills', amount: 120.0, type: 'expense', date: '2024-05-12', icon: '⚡' },
  { id: '7', title: 'Coffee Shop', category: 'Food', amount: 6.5, type: 'expense', date: '2024-05-12', icon: '☕' },
  { id: '8', title: 'Stock Dividend', category: 'Investment', amount: 350, type: 'income', date: '2024-05-11', icon: '📈' },
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', spent: 320, total: 500, icon: '🍔', color: '#E17055' },
  { id: '2', category: 'Transport', spent: 180, total: 300, icon: '🚗', color: '#6C5CE7' },
  { id: '3', category: 'Entertainment', spent: 95, total: 200, icon: '🎮', color: '#00B894' },
  { id: '4', category: 'Shopping', spent: 250, total: 400, icon: '🛍️', color: '#FDCB6E' },
  { id: '5', category: 'Health', spent: 75, total: 150, icon: '💊', color: '#74B9FF' },
];

export const mockGoals: Goal[] = [
  { id: '1', name: 'MacBook Pro', current: 1800, target: 2500, icon: '💻', color: '#6C5CE7' },
  { id: '2', name: 'New Car', current: 8500, target: 20000, icon: '🚙', color: '#00B894' },
  { id: '3', name: 'Vacation', current: 1200, target: 3000, icon: '✈️', color: '#FDCB6E' },
  { id: '4', name: 'Emergency Fund', current: 5000, target: 10000, icon: '🏦', color: '#74B9FF' },
];

export const mockBills: Bill[] = [
  { id: '1', name: 'WiFi Internet', amount: 59.99, dueDate: '2024-05-15', status: 'today', icon: '📶' },
  { id: '2', name: 'Electricity', amount: 120.0, dueDate: '2024-05-16', status: 'tomorrow', icon: '⚡' },
  { id: '3', name: 'Netflix', amount: 15.99, dueDate: '2024-05-18', status: 'upcoming', icon: '🎬' },
  { id: '4', name: 'Rent', amount: 1500.0, dueDate: '2024-05-20', status: 'upcoming', icon: '🏠' },
  { id: '5', name: 'Phone Bill', amount: 45.0, dueDate: '2024-05-10', status: 'overdue', icon: '📱' },
];

export const mockInsights: Insight[] = [
  { id: '1', text: 'Your spending decreased by 6% compared to last month', type: 'positive' },
  { id: '2', text: 'Food & Dining is 64% of your budget — consider meal prepping', type: 'negative' },
  { id: '3', text: 'You saved $200 more than your monthly goal', type: 'positive' },
  { id: '4', text: 'Transport costs increased by 15% this week', type: 'negative' },
];

export const mockHealthScore = 82;

export const mockRecommendation =
  'Try reducing food delivery orders. You spent $180 on delivery this month — cooking at home could save you up to $120.';

export const balanceChartData = [4200, 4500, 4800, 5100, 4950, 5200, 5430];

export const expenseChartData = [
  { month: 'Jan', amount: 2100 },
  { month: 'Feb', amount: 2400 },
  { month: 'Mar', amount: 2200 },
  { month: 'Apr', amount: 2600 },
  { month: 'May', amount: 2770 },
];

export const categoryBreakdown = [
  { category: 'Food', amount: 850, color: '#E17055' },
  { category: 'Transport', amount: 420, color: '#6C5CE7' },
  { category: 'Entertainment', amount: 280, color: '#00B894' },
  { category: 'Shopping', amount: 650, color: '#FDCB6E' },
  { category: 'Bills', amount: 570, color: '#74B9FF' },
];

export const onboardingSlides = [
  {
    id: '1',
    title: 'Track Your Finances',
    description: 'Easily monitor your income, expenses, and savings all in one place.',
    icon: '📊',
  },
  {
    id: '2',
    title: 'Smart Budgeting',
    description: 'Set budgets for categories and get alerts when you are close to your limit.',
    icon: '💡',
  },
  {
    id: '3',
    title: 'Achieve Your Goals',
    description: 'Create savings goals and watch your progress grow over time.',
    icon: '🎯',
  },
];
