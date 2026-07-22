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
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { HealthGauge } from '../../components/Charts';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { insightsApi, InsightsResponse } from '../../services/finance';

export const InsightsScreen: React.FC = () => {
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
      <ScreenHeader title="AI Insights" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Card style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Financial Health Score</Text>
          <View style={styles.gaugeWrapper}>
            <HealthGauge score={data!.healthScore} size={220} />
          </View>
          <Text style={styles.scoreDescription}>
            Your financial health is{' '}
            <Text style={{ fontWeight: '700', color: colors.income }}>Good</Text>
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>AI Analysis</Text>
        <Card style={styles.insightsCard}>
          {data!.insights.map((insight, index) => (
            <View key={insight.id} style={[styles.insightRow, index > 0 && styles.insightBorder]}>
              <Text style={styles.insightBullet}>
                {insight.type === 'positive' ? '✅' : insight.type === 'negative' ? '⚠️' : 'ℹ️'}
              </Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Recommendations</Text>
        <Card style={styles.recommendationCard}>
          <Text style={styles.recommendationIcon}>💡</Text>
          <Text style={styles.recommendationText}>{data!.recommendation}</Text>
          <Button
            title="View All Insights"
            variant="outline"
            onPress={() => {}}
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  gaugeWrapper: {
    marginBottom: spacing.md,
  },
  scoreDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  insightsCard: {
    marginBottom: spacing.lg,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  insightBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  insightBullet: {
    fontSize: 16,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  recommendationCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  recommendationIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  viewAllBtn: {
    width: '100%',
  },
});
