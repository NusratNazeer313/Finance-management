import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  height = 8,
  showLabel = false,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {showLabel && <Text style={styles.label}>{clampedProgress.toFixed(0)}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {},
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
});
