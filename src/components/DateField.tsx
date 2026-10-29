import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChipGroup } from './ChipGroup';
import { Input } from './Input';
import { spacing } from '../theme/spacing';
import { formatDate, isValidISODate, parseDate, toISODate } from '../utils/format';

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Quick picks, as day offsets from today (e.g. [0, -1] = Today, Yesterday). */
  presets: { label: string; offset: number }[];
}

const offsetDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toISODate(date);
};

/**
 * One-tap presets for the common dates, with "Other" for typing any date.
 * Avoids a native date-picker dependency.
 */
export const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, error, presets }) => {
  const presetFor = (date: string) => presets.find(p => offsetDate(p.offset) === date)?.label;
  const [custom, setCustom] = useState(() => !presetFor(value));
  const selected = custom ? 'Other' : presetFor(value) ?? 'Other';

  const handleChip = (choice: string) => {
    const preset = presets.find(p => p.label === choice);
    if (preset) {
      setCustom(false);
      onChange(offsetDate(preset.offset));
    } else {
      setCustom(true);
    }
  };

  const valid = isValidISODate(value);

  return (
    <View style={styles.container}>
      <ChipGroup
        label={label}
        options={[...presets.map(p => p.label), 'Other']}
        value={selected}
        onChange={handleChip}
        error={custom ? undefined : error}
      />
      {custom && (
        <Input
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          accessibilityLabel={`${label}, format year month day`}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          error={error}
          hint={
            valid
              ? parseDate(value).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }) + (formatDate(value).match(/Today|Yesterday/) ? ` (${formatDate(value)})` : '')
              : 'Format: YYYY-MM-DD'
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
});
