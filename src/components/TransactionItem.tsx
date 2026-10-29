import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Icon, colorForCategory, iconFromCategory, isIconName } from './Icon';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const isIncome = transaction.type === 'income';
  const accent = isIncome ? colors.income : colorForCategory(transaction.category);
  // Prefer the category (most specific), then the backend's icon name.
  const fallback = isIconName(transaction.icon) ? transaction.icon : isIncome ? 'income' : 'card';
  const iconName = iconFromCategory(transaction.category || transaction.title, fallback);
  const amountText = `${isIncome ? '+' : '−'}${formatCurrency(transaction.amount)}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${transaction.title}, ${transaction.category}, ${formatDate(
        transaction.date,
      )}, ${isIncome ? 'income' : 'expense'} ${formatCurrency(transaction.amount)}`}
      accessibilityHint={onPress ? 'Opens transaction details' : undefined}>
      <View style={[styles.iconContainer, { backgroundColor: accent + '18' }]}>
        <Icon name={iconName} size={18} color={accent} />
      </View>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.category}>
          {transaction.category} · {formatDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.text }]}>
        {amountText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyStrong,
    marginBottom: 2,
  },
  category: {
    ...typography.caption,
  },
  amount: {
    ...typography.moneySm,
  },
});
