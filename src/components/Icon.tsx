import React from 'react';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';
import { colors } from '../theme/colors';

export type IconName =
  | 'home'
  | 'card'
  | 'chart'
  | 'target'
  | 'spark'
  | 'bell'
  | 'plus'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'wallet'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'income'
  | 'investment'
  | 'salary'
  | 'coffee'
  | 'freelance'
  | 'list'
  | 'profile'
  | 'check'
  | 'alert'
  | 'lightbulb'
  | 'logo';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

const stroke = (color: string) => ({
  stroke: color,
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
});

export const Icon: React.FC<Props> = ({ name, size = 22, color = colors.text }) => {
  const s = stroke(color);

  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" {...s} />
        </Svg>
      );
    case 'card':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="6" width="18" height="12" rx="2" {...s} />
          <Line x1="3" y1="10" x2="21" y2="10" {...s} />
          <Line x1="7" y1="14" x2="11" y2="14" {...s} />
        </Svg>
      );
    case 'chart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 19V5" {...s} />
          <Path d="M4 19h16" {...s} />
          <Path d="M8 16V11" {...s} />
          <Path d="M12 16V8" {...s} />
          <Path d="M16 16v-5" {...s} />
        </Svg>
      );
    case 'target':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" {...s} />
          <Circle cx="12" cy="12" r="4" {...s} />
          <Circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
        </Svg>
      );
    case 'spark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3l1.2 6.3L19 12l-5.8 2.7L12 21l-1.2-6.3L5 12l5.8-2.7L12 3z" {...s} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" {...s} />
          <Path d="M10 19a2 2 0 0 0 4 0" {...s} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 5v14M5 12h14" {...s} />
        </Svg>
      );
    case 'arrow-up':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 19V5M6 11l6-6 6 6" {...s} />
        </Svg>
      );
    case 'arrow-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 5v14M6 13l6 6 6-6" {...s} />
        </Svg>
      );
    case 'arrow-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M15 18l-6-6 6-6" {...s} />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" {...s} />
          <Path d="M3 8V6.5A2.5 2.5 0 0 1 5.5 4H17" {...s} />
          <Circle cx="17" cy="14" r="1.2" fill={color} stroke="none" />
        </Svg>
      );
    case 'food':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M8 3v8M6 3v4a2 2 0 0 0 4 0V3" {...s} />
          <Path d="M8 11v10" {...s} />
          <Path d="M16 3v18M16 3c2 0 3 2 3 4v3h-3" {...s} />
        </Svg>
      );
    case 'transport':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 16l1.5-8h11L19 16" {...s} />
          <Path d="M4 16h16" {...s} />
          <Circle cx="8" cy="17.5" r="1.5" {...s} />
          <Circle cx="16" cy="17.5" r="1.5" {...s} />
          <Path d="M7 11h10" {...s} />
        </Svg>
      );
    case 'entertainment':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="7" width="18" height="12" rx="2" {...s} />
          <Path d="M8 7V5M16 7V5" {...s} />
          <Path d="M10 13h4" {...s} />
        </Svg>
      );
    case 'bills':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5V3z" {...s} />
          <Path d="M10 8h4M10 12h4M10 16h3" {...s} />
        </Svg>
      );
    case 'shopping':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 8h12l-1 11H7L6 8z" {...s} />
          <Path d="M9 8a3 3 0 0 1 6 0" {...s} />
        </Svg>
      );
    case 'health':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" {...s} />
        </Svg>
      );
    case 'income':
    case 'salary':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" {...s} />
          <Path d="M12 8v8M9.5 10.5c0-1 1.2-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.5-2.5 1.8-2.5.8-2.5 1.8 1.2 1.8 2.5 1.8 2.5-.8 2.5-1.8" {...s} />
        </Svg>
      );
    case 'investment':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 18l5-6 4 3 7-9" {...s} />
          <Path d="M15 6h5v5" {...s} />
        </Svg>
      );
    case 'coffee':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" {...s} />
          <Path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2" {...s} />
          <Path d="M8 4v2M11 3v2M14 4v2" {...s} />
        </Svg>
      );
    case 'freelance':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="5" width="18" height="12" rx="2" {...s} />
          <Path d="M8 19h8M12 17v2" {...s} />
        </Svg>
      );
    case 'list':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M8 7h12M8 12h12M8 17h12" {...s} />
          <Circle cx="4.5" cy="7" r="1" fill={color} stroke="none" />
          <Circle cx="4.5" cy="12" r="1" fill={color} stroke="none" />
          <Circle cx="4.5" cy="17" r="1" fill={color} stroke="none" />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="9" r="3.5" {...s} />
          <Path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" {...s} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 12.5l4.5 4.5L19 7" {...s} />
        </Svg>
      );
    case 'alert':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 4l9 16H3L12 4z" {...s} />
          <Path d="M12 10v4M12 16.5h.01" {...s} />
        </Svg>
      );
    case 'lightbulb':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 18h6M10 21h4" {...s} />
          <Path d="M8 14a5 5 0 1 1 8 0c-.8.9-1.5 1.6-1.5 3h-5c0-1.4-.7-2.1-1.5-3z" {...s} />
        </Svg>
      );
    case 'logo':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 17V7l8 5 8-5v10" {...s} />
          <Path d="M4 7l8 5 8-5" {...s} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" {...s} />
        </Svg>
      );
  }
};

const categoryMap: Record<string, IconName> = {
  food: 'food',
  'food & dining': 'food',
  grocery: 'food',
  transport: 'transport',
  entertainment: 'entertainment',
  bills: 'bills',
  shopping: 'shopping',
  health: 'health',
  income: 'income',
  investment: 'investment',
  salary: 'salary',
  coffee: 'coffee',
  freelance: 'freelance',
};

const iconNames: readonly IconName[] = [
  'home', 'card', 'chart', 'target', 'spark', 'bell', 'plus', 'arrow-up', 'arrow-down',
  'arrow-left', 'wallet', 'food', 'transport', 'entertainment', 'bills', 'shopping', 'health',
  'income', 'investment', 'salary', 'coffee', 'freelance', 'list', 'profile', 'check', 'alert',
  'lightbulb', 'logo',
];

export const isIconName = (value?: string): value is IconName =>
  !!value && (iconNames as readonly string[]).includes(value);

export function iconFromCategory(category?: string, fallback: IconName = 'card'): IconName {
  if (!category) return fallback;
  const key = category.toLowerCase().trim();
  if (key in categoryMap) return categoryMap[key];
  // Whole-word match so e.g. "card" doesn't count as "car".
  const words = key.split(/[^a-z]+/);
  const hasWord = (...w: string[]) => w.some(x => words.includes(x));
  if (key.includes('food') || key.includes('dining') || key.includes('grocery')) return 'food';
  if (key.includes('uber') || key.includes('transport') || hasWord('car', 'gas', 'taxi')) return 'transport';
  if (key.includes('netflix') || key.includes('entertain')) return 'entertainment';
  if (key.includes('bill') || key.includes('electric') || key.includes('rent') || key.includes('phone') || key.includes('wifi')) return 'bills';
  if (key.includes('shop')) return 'shopping';
  if (key.includes('health') || key.includes('medical')) return 'health';
  if (key.includes('salary') || key.includes('income')) return 'salary';
  if (key.includes('stock') || key.includes('invest') || key.includes('dividend')) return 'investment';
  if (key.includes('coffee')) return 'coffee';
  if (key.includes('freelance') || key.includes('work') || key.includes('laptop') || key.includes('macbook')) return 'freelance';
  if (key.includes('vacation') || key.includes('travel') || key.includes('trip')) return 'target';
  if (key.includes('emergency') || key.includes('saving')) return 'wallet';
  return fallback;
}

export function colorForCategory(category?: string): string {
  const key = (category || '').toLowerCase();
  if (key.includes('food') || key.includes('dining')) return colors.catFood;
  if (key.includes('transport')) return colors.catTransport;
  if (key.includes('entertain')) return colors.catEntertainment;
  if (key.includes('shop')) return colors.catShopping;
  if (key.includes('health')) return colors.catHealth;
  if (key.includes('bill') || key.includes('rent') || key.includes('electric') || key.includes('phone') || key.includes('wifi')) return colors.catBills;
  if (key.includes('income') || key.includes('salary') || key.includes('freelance')) return colors.catIncome;
  if (key.includes('invest') || key.includes('dividend') || key.includes('stock')) return colors.catInvestment;
  return colors.primaryLight;
}
