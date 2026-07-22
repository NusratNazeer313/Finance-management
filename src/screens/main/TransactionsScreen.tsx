import React, { useCallback, useMemo, useState } from 'react';
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
import { Input } from '../../components/Input';
import { TransactionItem } from '../../components/TransactionItem';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/format';
import { Transaction, TransactionType } from '../../types';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';
import { transactionsApi } from '../../services/finance';

type FilterType = 'all' | TransactionType;

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Transactions'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export const TransactionsScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await transactionsApi.list();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || tx.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(tx => {
      const key = formatDate(tx.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return groups;
  }, [filtered]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Transactions" />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search transactions..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && transactions.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && transactions.length === 0 ? (
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
          {Object.entries(grouped).map(([date, items]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.groupDate}>{date}</Text>
              <View style={styles.groupList}>
                {items.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button
          title="+ Add Transaction"
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
        />
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: -spacing.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  groupList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
