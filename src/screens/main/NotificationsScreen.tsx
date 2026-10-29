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
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppNotification } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { notificationsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Opening the screen counts as seeing them, so the bell's dot clears.
  // `unread` keeps the highlight for this visit.
  const [unreadIds, setUnreadIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const list = await notificationsApi.list();
      setUnreadIds(list.filter(n => !n.read).map(n => n.id));
      setItems(list);
      if (list.some(n => !n.read)) await notificationsApi.markAllRead();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openTarget = (n: AppNotification) => {
    if (n.target === 'Budget') navigation.navigate('MainTabs', { screen: 'Budget' });
    else navigation.navigate('Bills');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" showBack />

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load} accessibilityRole="button">
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="check" size={28} color={colors.income} />
          <Text style={styles.emptyTitle}>You’re all caught up</Text>
          <Text style={styles.emptyText}>
            We’ll let you know when a bill is due or a budget is nearly used.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
          <Card padding={0}>
            {items.map((n, i) => {
              const isAlert = n.type === 'alert';
              const unread = unreadIds.includes(n.id);
              return (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.row, i > 0 && styles.rowBorder]}
                  onPress={() => openTarget(n)}
                  accessibilityRole="button"
                  accessibilityLabel={`${unread ? 'New. ' : ''}${n.title}. ${n.body}`}
                  accessibilityHint={`Opens ${n.target}`}>
                  <View
                    style={[
                      styles.icon,
                      { backgroundColor: isAlert ? colors.dangerLight : colors.warningLight },
                    ]}>
                    <Icon
                      name={isAlert ? 'alert' : 'bell'}
                      size={16}
                      color={isAlert ? colors.danger : colors.warning}
                    />
                  </View>
                  <View style={styles.text}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.body}>{n.body}</Text>
                  </View>
                  {unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })}
          </Card>
        </ScrollView>
      )}
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
  emptyTitle: {
    ...typography.bodyStrong,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
  },
  title: {
    ...typography.bodyStrong,
    fontSize: 15,
  },
  body: {
    ...typography.caption,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.expense,
    marginLeft: spacing.sm,
  },
});
