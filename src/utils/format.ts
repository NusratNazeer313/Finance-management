export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/** Today's date as local YYYY-MM-DD (not UTC, which can be a different day). */
export const toISODate = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Parses YYYY-MM-DD as a local calendar date. `new Date('2024-05-15')` is
 * treated as UTC midnight, which shows as the previous day west of UTC.
 */
export const parseDate = (dateStr: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Date(dateStr);
};

export const isValidISODate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = parseDate(dateStr);
  return !Number.isNaN(date.getTime()) && toISODate(date) === dateStr;
};

/** Whole days from today to the date (negative = past). */
export const daysFromToday = (dateStr: string): number => {
  const today = parseDate(toISODate());
  return Math.round((parseDate(dateStr).getTime() - today.getTime()) / 86400000);
};

export const formatDate = (dateStr: string): string => {
  const days = daysFromToday(dateStr);
  if (days === 0) return 'Today';
  if (days === -1) return 'Yesterday';

  const date = parseDate(dateStr);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

/** "Due today", "Due tomorrow", "Due Fri, Nov 3", "5 days overdue". */
export const formatDueDate = (dateStr: string): string => {
  const days = daysFromToday(dateStr);
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 0) return `${-days} day${days === -1 ? '' : 's'} overdue`;
  return `Due ${parseDate(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min((current / total) * 100, 100);
};
