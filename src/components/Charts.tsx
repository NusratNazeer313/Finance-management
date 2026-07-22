import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop } from 'react-native-svg';
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
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={[styles.gaugeContainer, { width: size, height: size / 2 + 30 }]}>
      <Svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <Polyline
          points={`${strokeWidth / 2},${size / 2} ${size - strokeWidth / 2},${size / 2}`}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Polyline
          points={`${strokeWidth / 2},${size / 2} ${strokeWidth / 2 + progress * (size - strokeWidth) / circumference},${size / 2 - Math.sin((score / 100) * Math.PI) * (size / 2 - strokeWidth)}`}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreLabel}>/ 100</Text>
      </View>
    </View>
  );
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
