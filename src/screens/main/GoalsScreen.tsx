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
      <ScreenHeader title="Savings Goals" />

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

            return (
              <Card key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                    <Text style={styles.goalEmoji}>{goal.icon}</Text>
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmounts}>
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </Text>
                  </View>
                  <Text style={[styles.goalPercent, { color: goal.color }]}>
                    {progress.toFixed(0)}%
                  </Text>
                </View>
                <ProgressBar progress={progress} color={goal.color} height={10} />
                <Text style={styles.goalRemaining}>
                  {formatCurrency(goal.target - goal.current)} remaining
                </Text>
              </Card>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.fabContainer}>
        <Button title="+ Create Goal" onPress={() => navigation.navigate('CreateGoal')} />
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
  goalCard: {
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  goalEmoji: {
    fontSize: 26,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  goalAmounts: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  goalPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalRemaining: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
