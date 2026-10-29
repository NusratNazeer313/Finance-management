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
import { Icon, iconFromCategory, isIconName } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatCurrency, getProgress } from '../../utils/format';
import { Goal } from '../../types';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';
import { goalsApi } from '../../services/finance';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Goals'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export const GoalsScreen: React.FC<Props> = ({ navigation }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setGoals(await goalsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load goals');
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
      <ScreenHeader title="Savings goals" subtitle="Track progress toward targets" />

      {loading && goals.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && goals.length === 0 ? (
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
          {goals.map(goal => {
            const progress = getProgress(goal.current, goal.target);
            const accent = goal.color?.startsWith('#') ? goal.color : colors.primaryLight;
            // Match the goal's name first ("New Car" → car), then its stored icon.
            const iconName = iconFromCategory(
              goal.name,
              isIconName(goal.icon) ? goal.icon : 'target',
            );

            return (
              <Card key={goal.id} style={styles.goalCard}>
                <View
                  accessible
                  accessibilityLabel={`${goal.name}: ${formatCurrency(goal.current)} saved of ${formatCurrency(
                    goal.target,
                  )}, ${progress.toFixed(0)} percent`}>
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIcon, { backgroundColor: accent + '20' }]}>
                    <Icon name={iconName} size={22} color={accent} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmounts}>
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </Text>
                  </View>
                  <Text style={[styles.goalPercent, { color: accent }]}>
                    {progress.toFixed(0)}%
                  </Text>
                </View>
                <ProgressBar progress={progress} color={accent} height={8} />
                <Text style={styles.goalRemaining}>
                  {goal.current >= goal.target
                    ? 'Goal reached 🎉'
                    : `${formatCurrency(goal.target - goal.current)} to go`}
                </Text>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="Create goal" onPress={() => navigation.navigate('CreateGoal')} />
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
  goalCard: {
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    ...typography.bodyStrong,
    fontSize: 16,
    marginBottom: 4,
  },
  goalAmounts: {
    ...typography.caption,
  },
  goalPercent: {
    ...typography.moneySm,
    fontSize: 18,
  },
  goalRemaining: {
    ...typography.caption,
    marginTop: spacing.sm,
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
