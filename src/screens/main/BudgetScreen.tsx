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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
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
      <ScreenHeader title="Budget Planner" subtitle="May 2024" />

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
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Total Budget</Text>
            <Text style={styles.overviewAmount}>{formatCurrency(totalBudget)}</Text>
            <View style={styles.overviewRow}>
              <Text style={styles.overviewSpent}>
                Spent: <Text style={{ color: colors.expense }}>{formatCurrency(totalSpent)}</Text>
              </Text>
              <Text style={styles.overviewRemaining}>
                Remaining:{' '}
                <Text style={{ color: colors.income }}>
                  {formatCurrency(totalBudget - totalSpent)}
                </Text>
              </Text>
            </View>
            <ProgressBar
              progress={getProgress(totalSpent, totalBudget)}
              color={colors.primary}
              height={10}
            />
          </Card>

          {budgets.map(budget => {
            const progress = getProgress(budget.spent, budget.total);
            const isOverBudget = progress >= 90;

            return (
              <Card key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    <View style={[styles.budgetIcon, { backgroundColor: budget.color + '20' }]}>
                      <Text style={styles.budgetEmoji}>{budget.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.budgetCategory}>{budget.category}</Text>
                      <Text style={styles.budgetAmounts}>
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.total)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.budgetPercent, isOverBudget && { color: colors.expense }]}>
                    {progress.toFixed(0)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={progress}
                  color={isOverBudget ? colors.expense : budget.color}
                  height={8}
                />
              </Card>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="+ Create Budget" onPress={() => navigation.navigate('CreateBudget')} />
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
    paddingBottom: 100,
  },
  overviewCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  overviewLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  overviewSpent: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  overviewRemaining: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
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
  },
  budgetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetEmoji: {
    fontSize: 20,
  },
  budgetCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  budgetAmounts: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  budgetPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
