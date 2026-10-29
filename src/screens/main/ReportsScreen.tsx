import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Svg, { Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';
import { reportsApi, ReportSummary } from '../../services/finance';

type Tab = 'expense' | 'income' | 'networth';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Reports'>;
};

const screenWidth = Dimensions.get('window').width - spacing.lg * 2;

export const ReportsScreen: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('expense');
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await reportsApi.getSummary());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'expense', label: 'Expense' },
    { key: 'income', label: 'Income' },
    { key: 'networth', label: 'Net Worth' },
  ];

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

  const months = data!.expenseChartData.map(d => d.month);
  const expenseChartData =
    activeTab === 'expense'
      ? data!.expenseChartData
      : activeTab === 'income'
      ? data!.incomeChartData
      : data!.netWorthChartData.map((amount, i) => ({ month: months[i] ?? '', amount }));
  const categoryBreakdown =
    activeTab === 'expense' ? data!.categoryBreakdown : activeTab === 'income' ? data!.incomeBreakdown : [];
  const maxAmount = Math.max(...expenseChartData.map(d => d.amount), 1);
  const barWidth = (screenWidth - 80) / expenseChartData.length - 12;
  const chartHeight = 140;
  const valueLabelSpace = 18;
  const shortMoney = (n: number) =>
    Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;
  const totalCategory = categoryBreakdown.reduce((sum, c) => sum + c.amount, 0) || 1;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reports" showBack />

      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            {activeTab === 'expense'
              ? 'Spent this month'
              : activeTab === 'income'
              ? 'Earned this month'
              : 'Net worth today'}
          </Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              activeTab === 'expense'
                ? data!.balance.expense
                : activeTab === 'income'
                ? data!.balance.income
                : data!.balance.total,
            )}
          </Text>
        </Card>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          {activeTab === 'networth' ? 'Net worth' : 'Monthly trend'} · last 6 months
        </Text>
        <Card style={styles.chartCard}>
          <View
            accessible
            accessibilityLabel={`Bar chart. ${expenseChartData
              .map(d => `${d.month}: ${formatCurrency(d.amount)}`)
              .join(', ')}`}>
          <Svg width={screenWidth - 32} height={chartHeight + valueLabelSpace + 20}>
            {expenseChartData.map((item, index) => {
              const barHeight = Math.max((item.amount / maxAmount) * chartHeight, 2);
              const x = index * (barWidth + 12) + 20;
              const y = chartHeight - barHeight + valueLabelSpace + 4;
              const isCurrent = index === expenseChartData.length - 1;

              return (
                <G key={`${item.month}-${index}`}>
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fontSize={11}
                    fontWeight={isCurrent ? '700' : '500'}
                    fill={colors.textSecondary}
                    textAnchor="middle">
                    {shortMoney(item.amount)}
                  </SvgText>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={6}
                    fill={isCurrent ? colors.primary : colors.primaryLight}
                  />
                </G>
              );
            })}
          </Svg>
          <View style={styles.chartLabels}>
            {expenseChartData.map((item, i) => (
              <Text key={`${item.month}-${i}`} style={styles.chartLabel}>
                {item.month}
              </Text>
            ))}
          </View>
          </View>
        </Card>

        {categoryBreakdown.length > 0 && (
        <>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {activeTab === 'income' ? 'Income by source' : 'Spending by category'} · this month
        </Text>
        <Card style={styles.donutCard}>
          <View style={styles.donutRow}>
            <Svg width={120} height={120} viewBox="0 0 120 120">
              {categoryBreakdown.reduce(
                (acc, cat) => {
                  const percentage = cat.amount / totalCategory;
                  const angle = percentage * 360;

                  acc.elements.push(
                    <Circle
                      key={cat.category}
                      cx={60}
                      cy={60}
                      r={25}
                      fill="none"
                      stroke={cat.color}
                      strokeWidth={25}
                      strokeDasharray={`${percentage * 157} ${157 - percentage * 157}`}
                      strokeDashoffset={-acc.offset * (157 / 360)}
                      transform="rotate(-90 60 60)"
                    />,
                  );

                  acc.offset += angle;
                  return acc;
                },
                { elements: [] as React.ReactElement[], offset: 0 },
              ).elements}
            </Svg>

            <View style={styles.legendContainer}>
              {categoryBreakdown.map(cat => (
                <View
                  key={cat.category}
                  style={styles.legendItem}
                  accessible
                  accessibilityLabel={`${cat.category}: ${formatCurrency(cat.amount)}, ${Math.round(
                    (cat.amount / totalCategory) * 100,
                  )} percent`}>
                  <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.legendText}>
                    {cat.category}{' '}
                    <Text style={styles.legendPct}>{Math.round((cat.amount / totalCategory) * 100)}%</Text>
                  </Text>
                  <Text style={styles.legendAmount}>{formatCurrency(cat.amount)}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
        </>
        )}
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
  legendPct: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textOnPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  totalCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 18,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartCard: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  chartLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  donutCard: {
    marginBottom: spacing.lg,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  legendContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
