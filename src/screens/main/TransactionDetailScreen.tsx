import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon, colorForCategory, iconFromCategory, isIconName } from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, parseDate } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';
import { transactionsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TransactionDetail'>;
  route: RouteProp<RootStackParamList, 'TransactionDetail'>;
};

export const TransactionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transaction } = route.params;
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();
  const isIncome = transaction.type === 'income';
  const accent = isIncome ? colors.income : colorForCategory(transaction.category);
  const fallback = isIconName(transaction.icon) ? transaction.icon : isIncome ? 'income' : 'card';

  const confirmDelete = () => {
    Alert.alert(
      'Delete transaction?',
      `${transaction.title} (${formatCurrency(transaction.amount)}) will be removed and your totals updated. This can’t be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await transactionsApi.remove(transaction.id);
              showToast('Transaction deleted');
              navigation.goBack();
            } catch (error) {
              setDeleting(false);
              Alert.alert(
                'Couldn’t delete',
                error instanceof Error ? error.message : 'Try again.',
              );
            }
          },
        },
      ],
    );
  };

  const rows: [string, string][] = [
    ['Type', isIncome ? 'Income' : 'Expense'],
    ['Category', transaction.category],
    [
      'Date',
      parseDate(transaction.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    ],
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Transaction" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: accent + '18' }]}>
            <Icon
              name={iconFromCategory(transaction.category, fallback)}
              size={26}
              color={accent}
            />
          </View>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={[styles.amount, { color: isIncome ? colors.income : colors.text }]}>
            {isIncome ? '+' : '−'}
            {formatCurrency(transaction.amount)}
          </Text>
        </Card>

        <Card padding={0}>
          {rows.map(([label, value], i) => (
            <View key={label} style={[styles.row, i > 0 && styles.rowBorder]} accessible>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </Card>

        <Button
          title="Edit"
          onPress={() => navigation.navigate('AddTransaction', { transaction })}
          style={styles.action}
        />
        <Button
          title="Delete"
          variant="outline"
          onPress={confirmDelete}
          loading={deleting}
          style={styles.action}
          textStyle={{ color: colors.danger }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodyStrong,
    fontSize: 17,
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowLabel: {
    ...typography.caption,
    fontSize: 14,
  },
  rowValue: {
    ...typography.bodyStrong,
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  action: {
    marginTop: spacing.md,
  },
});
