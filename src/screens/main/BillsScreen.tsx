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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';
import { Bill } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { billsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Bills'>;
};

const statusConfig = {
  today: { label: 'Today', color: colors.warning, bg: colors.warningLight },
  tomorrow: { label: 'Tomorrow', color: colors.expense, bg: colors.expenseLight },
  upcoming: { label: 'Upcoming', color: colors.textSecondary, bg: colors.background },
  overdue: { label: 'Overdue', color: colors.danger, bg: colors.dangerLight },
};

export const BillsScreen: React.FC<Props> = ({ navigation }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bills & Reminders" />

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
          {bills.map(bill => {
            const status = statusConfig[bill.status];

            return (
              <Card key={bill.id} style={styles.billCard}>
                <View style={styles.billRow}>
                  <View style={styles.billIcon}>
                    <Text style={styles.billEmoji}>{bill.icon}</Text>
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={styles.billName}>{bill.name}</Text>
                    <Text style={styles.billDate}>Due: {bill.dueDate}</Text>
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
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="+ Add Bill" onPress={() => navigation.navigate('AddBill')} />
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
  billCard: {
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  billEmoji: {
    fontSize: 20,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  billDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
