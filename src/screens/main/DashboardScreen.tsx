import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { TransactionItem } from '../../components/TransactionItem';
import { MiniLineChart } from '../../components/Charts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, getGreeting } from '../../utils/format';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';
import { dashboardApi, DashboardOverview } from '../../services/finance';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const overview = await dashboardApi.getOverview();
      setData(overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={load}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const balance = data!.balance;
  const recentTransactions = data!.recentTransactions;

  return (
    <View style={styles.container}>
      <ScreenHeader
        greeting={`${getGreeting()},`}
        title={data!.user.name}
        showNotification
        onNotificationPress={() => navigation.navigate('Profile')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>{formatCurrency(balance.total)}</Text>
            <MiniLineChart data={data!.balanceChartData} width={100} height={36} />
          </View>
        </Card>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard} padding={spacing.md}>
            <Text style={styles.summaryIcon}>📈</Text>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, { color: colors.income }]}>
              {formatCurrency(balance.income)}
            </Text>
            <Text style={styles.summaryChange}>+{balance.incomeChange}%</Text>
          </Card>
          <Card style={styles.summaryCard} padding={spacing.md}>
            <Text style={styles.summaryIcon}>📉</Text>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={[styles.summaryAmount, { color: colors.expense }]}>
              {formatCurrency(balance.expense)}
            </Text>
            <Text style={[styles.summaryChange, { color: colors.expense }]}>
              {balance.expenseChange}%
            </Text>
          </Card>
          <Card style={styles.summaryCard} padding={spacing.md}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>
              {formatCurrency(balance.savings)}
            </Text>
            <Text style={styles.summaryChange}>+{balance.savingsChange}%</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.transactionsCard}>
          {recentTransactions.map((tx, index) => (
            <View key={tx.id}>
              <TransactionItem transaction={tx} />
              {index < recentTransactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}>
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Bills')}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Reports')}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
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
    paddingBottom: spacing.xl,
  },
  balanceCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 11,
    color: colors.income,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionsCard: {
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
