import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Button } from '../../components/Button';
import { Icon, colorForCategory, iconFromCategory } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, getProgress } from '../../utils/format';
import { Budget } from '../../types';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';
import { budgetsApi } from '../../services/finance';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Budget'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export const BudgetScreen: React.FC<Props> = ({ navigation }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setBudgets(await budgetsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Budget"
        subtitle={`${new Date().toLocaleDateString('en-US', { month: 'long' })} · resets monthly`}
      />

      {loading && budgets.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && budgets.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
          <View
            style={styles.overviewCard}
            accessible
            accessibilityLabel={`Total budget ${formatCurrency(totalBudget)}, spent ${formatCurrency(
              totalSpent,
            )}, ${
              totalSpent > totalBudget
                ? `over by ${formatCurrency(totalSpent - totalBudget)}`
                : `${formatCurrency(totalBudget - totalSpent)} left`
            }`}>
            <Text style={styles.overviewLabel}>Total allocated</Text>
            <Text style={styles.overviewAmount}>{formatCurrency(totalBudget)}</Text>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewMeta}>
                Spent{' '}
                <Text style={{ color: colors.expense, fontWeight: '700' }}>
                  {formatCurrency(totalSpent)}
                </Text>
              </Text>
              <Text style={styles.overviewMeta}>
                {totalSpent > totalBudget ? 'Over by ' : 'Left '}
                <Text
                  style={{
                    color: totalSpent > totalBudget ? colors.expense : colors.income,
                    fontWeight: '700',
                  }}>
                  {formatCurrency(Math.abs(totalBudget - totalSpent))}
                </Text>
              </Text>
            </View>
            <ProgressBar
              progress={getProgress(totalSpent, totalBudget)}
              color="rgba(244,247,246,0.9)"
              height={8}
            />
          </View>

          {budgets.map(budget => {
            const progress = getProgress(budget.spent, budget.total);
            const actualPct = budget.total ? (budget.spent / budget.total) * 100 : 0;
            const isOver = budget.spent > budget.total;
            const isNear = !isOver && actualPct >= 80;
            const status = isOver
              ? `Over by ${formatCurrency(budget.spent - budget.total)}`
              : `${formatCurrency(budget.total - budget.spent)} left`;
            const accent = budget.color?.startsWith('#')
              ? budget.color
              : colorForCategory(budget.category);
            const iconName = iconFromCategory(budget.category, 'chart');

            return (
              <Card key={budget.id} style={styles.budgetCard}>
                <View
                  accessible
                  accessibilityLabel={`${budget.category}: ${formatCurrency(budget.spent)} of ${formatCurrency(
                    budget.total,
                  )} spent, ${status}`}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    <View style={[styles.budgetIcon, { backgroundColor: accent + '20' }]}>
                      <Icon name={iconName} size={18} color={accent} />
                    </View>
                    <View>
                      <Text style={styles.budgetCategory}>{budget.category}</Text>
                      <Text style={styles.budgetAmounts}>
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.total)} ·{' '}
                        <Text style={isOver ? { color: colors.expense, fontWeight: '600' } : undefined}>
                          {status}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.budgetPercent,
                      (isOver || isNear) && { color: isOver ? colors.expense : colors.warning },
                    ]}>
                    {actualPct.toFixed(0)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={progress}
                  color={isOver ? colors.expense : isNear ? colors.warning : accent}
                  height={6}
                />
                </View>
              </Card>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="Create budget" onPress={() => navigation.navigate('CreateBudget')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  overviewCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: spacing.lg,
  },
  overviewLabel: {
    fontSize: 13,
    color: 'rgba(244,247,246,0.75)',
    marginBottom: 4,
  },
  overviewAmount: {
    ...typography.money,
    fontSize: 30,
    color: colors.textOnPrimary,
    marginBottom: spacing.sm,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  overviewMeta: {
    fontSize: 13,
    color: 'rgba(244,247,246,0.8)',
  },
  budgetCard: {
    marginBottom: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  budgetIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetCategory: {
    ...typography.bodyStrong,
    marginBottom: 2,
  },
  budgetAmounts: {
    ...typography.caption,
  },
  budgetPercent: {
    ...typography.moneySm,
    color: colors.primary,
  },
  // A footer bar rather than a floating button, so it never covers list items.
  fabContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 4,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
