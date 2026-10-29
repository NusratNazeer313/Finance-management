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
import { Button } from '../../components/Button';
import { HealthGauge, healthLabel } from '../../components/Charts';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { insightsApi, InsightsResponse } from '../../services/finance';
import { AppTabParamList, RootStackParamList } from '../../navigation/types';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Insights'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export const InsightsScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await insightsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
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

  return (
    <View style={styles.container}>
      <ScreenHeader title="Insights" subtitle="Spending patterns & health" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Card style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Financial health score</Text>
          <View style={styles.gaugeWrapper}>
            <HealthGauge score={data!.healthScore} size={220} />
          </View>
          <Text style={styles.scoreDescription}>
            Your financial health is{' '}
            <Text style={{ fontWeight: '700', color: healthLabel(data!.healthScore).color }}>
              {healthLabel(data!.healthScore).label}
            </Text>
          </Text>
          <Text style={styles.scoreExplain}>
            Based on how much of your income you keep, staying within budgets, and paying bills on
            time.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Analysis</Text>
        <Card style={styles.insightsCard} padding={0}>
          {data!.insights.map((insight, index) => (
            <View
              key={insight.id}
              style={[styles.insightRow, index > 0 && styles.insightBorder]}
              accessible
              accessibilityLabel={`${insight.type === 'positive' ? 'Good' : 'Heads up'}: ${insight.text}`}>
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor:
                      insight.type === 'positive' ? colors.incomeLight : colors.warningLight,
                  },
                ]}>
                <Icon
                  name={insight.type === 'positive' ? 'check' : 'alert'}
                  size={16}
                  color={insight.type === 'positive' ? colors.income : colors.warning}
                />
              </View>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Recommendation</Text>
        <Card style={styles.recommendationCard}>
          <View style={styles.recommendationIcon}>
            <Icon name="lightbulb" size={22} color={colors.primary} />
          </View>
          <Text style={styles.recommendationText}>{data!.recommendation}</Text>
          <Button
            title="Review spending in Reports"
            variant="outline"
            onPress={() => navigation.navigate('Reports')}
            style={styles.viewAllBtn}
          />
        </Card>
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
  scoreCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
  },
  scoreTitle: {
    ...typography.bodyStrong,
    marginBottom: spacing.md,
  },
  gaugeWrapper: {
    marginBottom: spacing.md,
  },
  scoreExplain: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  scoreDescription: {
    ...typography.caption,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  insightsCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  insightBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  insightIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 1,
  },
  insightText: {
    flex: 1,
    ...typography.body,
  },
  recommendationCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  recommendationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  recommendationText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  viewAllBtn: {
    width: '100%',
  },
});
