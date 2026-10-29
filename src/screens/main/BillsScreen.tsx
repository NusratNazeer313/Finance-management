import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon, iconFromCategory } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, formatDueDate } from '../../utils/format';
import { useToast } from '../../components/Toast';
import { Bill } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { billsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Bills'>;
};

const statusConfig = {
  today: { label: 'Due today', color: colors.warning, bg: colors.warningLight },
  tomorrow: { label: 'Tomorrow', color: colors.expense, bg: colors.expenseLight },
  upcoming: { label: 'Upcoming', color: colors.textSecondary, bg: colors.surfaceMuted },
  overdue: { label: 'Overdue', color: colors.danger, bg: colors.dangerLight },
  paid: { label: 'Paid', color: colors.income, bg: colors.incomeLight },
};

export const BillsScreen: React.FC<Props> = ({ navigation }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      setError(null);
      setBills(await billsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, []);

  const openActions = (bill: Bill) => {
    const remove = () =>
      Alert.alert('Delete bill?', `${bill.name} will be removed from your reminders.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await billsApi.remove(bill.id);
              showToast('Bill deleted');
              load();
            } catch (err) {
              Alert.alert('Couldn’t delete', err instanceof Error ? err.message : 'Try again.');
            }
          },
        },
      ]);

    const togglePaid = async () => {
      try {
        await billsApi.setPaid(bill.id, !bill.paid);
        showToast(
          bill.paid ? `${bill.name} marked unpaid` : `${bill.name} paid — added to expenses`,
        );
        load();
      } catch (err) {
        Alert.alert('Couldn’t update', err instanceof Error ? err.message : 'Try again.');
      }
    };

    Alert.alert(bill.name, `${formatCurrency(bill.amount)} · ${formatDueDate(bill.dueDate)}`, [
      { text: 'Delete', style: 'destructive', onPress: remove },
      { text: 'Cancel', style: 'cancel' },
      { text: bill.paid ? 'Mark unpaid' : 'Mark as paid', onPress: togglePaid },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bills" subtitle="Upcoming payments & reminders" showBack />

      {loading && bills.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && bills.length === 0 ? (
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
          {bills.length === 0 && (
            <Text style={styles.empty}>No bills yet. Add one to get reminders before it’s due.</Text>
          )}
          {bills.length > 0 && (
            <Text style={styles.tip}>Tap a bill to mark it paid or delete it.</Text>
          )}
          {bills.map(bill => {
            const status = statusConfig[bill.status];
            const iconName = iconFromCategory(bill.name, 'bills');

            return (
              <TouchableOpacity
                key={bill.id}
                activeOpacity={0.7}
                onPress={() => openActions(bill)}
                accessibilityRole="button"
                accessibilityLabel={`${bill.name}, ${formatCurrency(bill.amount)}, ${
                  bill.paid ? 'paid' : formatDueDate(bill.dueDate)
                }`}
                accessibilityHint="Mark as paid or delete">
              <Card style={[styles.billCard, bill.paid && styles.billPaid]}>
                <View style={styles.billRow}>
                  <View style={styles.billIcon}>
                    <Icon name={iconName} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={styles.billName}>{bill.name}</Text>
                    <Text style={styles.billDate}>
                      {bill.paid ? `Paid · was ${formatDueDate(bill.dueDate).toLowerCase()}` : formatDueDate(bill.dueDate)}
                    </Text>
                  </View>
                  <View style={styles.billRight}>
                    <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="Add bill" onPress={() => navigation.navigate('AddBill')} />
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
  billPaid: {
    opacity: 0.6,
  },
  empty: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  tip: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  billCard: {
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    ...typography.bodyStrong,
    marginBottom: 2,
  },
  billDate: {
    ...typography.caption,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    ...typography.moneySm,
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
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
