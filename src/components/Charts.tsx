import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

interface MiniLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const MiniLineChart: React.FC<MiniLineChartProps> = ({
  data,
  width = 120,
  height = 40,
  color = colors.primary,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.3" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

interface HealthGaugeProps {
  score: number;
  size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score, size = 200 }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return colors.income;
    if (s >= 60) return colors.warning;
    return colors.expense;
  };

  const scoreColor = getScoreColor(score);
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = radius + strokeWidth / 2;
  const height = cy + strokeWidth / 2;

  // Point on the semicircle: 0% = left end, 100% = right end, over the top.
  const pointAt = (pct: number) => {
    const angle = Math.PI * (1 - pct / 100);
    return `${cx + radius * Math.cos(angle)} ${cy - radius * Math.sin(angle)}`;
  };
  const track = `M ${pointAt(0)} A ${radius} ${radius} 0 0 1 ${pointAt(100)}`;
  const progress = `M ${pointAt(0)} A ${radius} ${radius} 0 0 1 ${pointAt(clamped)}`;

  return (
    <View
      style={[styles.gaugeContainer, { width: size, height: height + 8 }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Financial health score"
      accessibilityValue={{ min: 0, max: 100, now: clamped, text: `${clamped} out of 100` }}>
      <Svg width={size} height={height}>
        <Path
          d={track}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {clamped > 0 && (
          <Path
            d={progress}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </Svg>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: scoreColor }]}>{clamped}</Text>
        <Text style={styles.scoreLabel}>/ 100</Text>
      </View>
    </View>
  );
};

export const healthLabel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: 'Good', color: colors.income };
  if (score >= 60) return { label: 'Fair', color: colors.warning };
  return { label: 'Needs attention', color: colors.expense };
};

const styles = StyleSheet.create({
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  score: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: -4,
  },
});
