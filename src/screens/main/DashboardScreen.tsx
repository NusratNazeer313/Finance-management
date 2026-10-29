import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { TransactionItem } from '../../components/TransactionItem';
import { MiniLineChart } from '../../components/Charts';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, getGreeting } from '../../utils/format';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';
import { dashboardApi, DashboardOverview } from '../../services/finance';

const formatChange = (pct: number) => `${pct > 0 ? '+' : ''}${pct}%`;

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
  const fade = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    try {
      setError(null);
      const overview = await dashboardApi.getOverview();
      setData(overview);
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [fade]);

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
      <View style={styles.topWash} />
      <ScreenHeader
        greeting={getGreeting()}
        title={data!.user.name}
        showNotification
        unreadCount={data!.unreadNotifications}
        compact
        variant="dark"
        onNotificationPress={() => navigation.navigate('Notifications')}
        rightAction={
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Profile">
            <Text style={styles.avatarText}>{data!.user.name.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        style={{ opacity: fade }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />
        }>
        <View
          style={styles.balanceCard}
          accessible
          accessibilityLabel={`Available balance ${formatCurrency(balance.total)}`}>
          <View style={styles.balanceTop}>
            <Text style={styles.accountLabel}>Available balance</Text>
            <MiniLineChart
              data={data!.balanceChartData}
              width={72}
              height={28}
              color="rgba(244,247,246,0.85)"
            />
          </View>
          <Text style={styles.balanceAmount}>{formatCurrency(balance.total)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.incomeLight }]}>
              <Icon name="arrow-up" size={14} color={colors.income} />
            </View>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, { color: colors.income }]}>
              {formatCurrency(balance.income)}
            </Text>
            <Text style={styles.summaryChange}>{formatChange(balance.incomeChange)} vs last month</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.expenseLight }]}>
              <Icon name="arrow-down" size={14} color={colors.expense} />
            </View>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={[styles.summaryAmount, { color: colors.expense }]}>
              {formatCurrency(balance.expense)}
            </Text>
            <Text
              style={[
                styles.summaryChange,
                { color: balance.expenseChange > 0 ? colors.expense : colors.income },
              ]}>
              {formatChange(balance.expenseChange)} vs last month
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.primarySoft }]}>
              <Icon name="wallet" size={14} color={colors.primary} />
            </View>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>
              {formatCurrency(balance.savings)}
            </Text>
            <Text style={styles.summaryChange}>in goals</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Transactions')}
            accessibilityRole="link"
            accessibilityLabel="See all transactions"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.transactionsCard}>
          {recentTransactions.map((tx, index) => (
            <View key={tx.id}>
              <TransactionItem
                transaction={tx}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
              />
              {index < recentTransactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
            accessibilityRole="button"
            accessibilityLabel="Add transaction">
            <View style={styles.quickIconWrap}>
              <Icon name="plus" size={18} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Bills')}
            accessibilityRole="button">
            <View style={styles.quickIconWrap}>
              <Icon name="bills" size={18} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Reports')}
            accessibilityRole="button">
            <View style={styles.quickIconWrap}>
              <Icon name="chart" size={18} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topWash: {
    ...StyleSheet.absoluteFill,
    height: 20,
    backgroundColor: colors.primaryDark,
    opacity: 1,
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
    paddingTop: 2,
  },
  balanceCard: {
    marginBottom: spacing.sm + 4,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  accountLabel: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(244,247,246,0.7)',
    letterSpacing: 0.2,
    marginRight: spacing.sm,
  },
  balanceAmount: {
    ...typography.money,
    fontSize: 30,
    color: colors.textOnPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm + 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  summaryIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  summaryLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  summaryAmount: {
    ...typography.moneySm,
    fontSize: 13,
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 11,
    color: colors.income,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 17,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  transactionsCard: {
    marginBottom: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  quickIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
