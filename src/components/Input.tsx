import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Helper text shown under the field when there is no error. */
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, style, onFocus, onBlur, secureTextEntry, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const isPassword = Boolean(secureTextEntry);

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View>
          <TextInput
            ref={ref}
            style={[
              styles.input,
              isPassword && styles.inputWithToggle,
              focused && styles.inputFocused,
              error && styles.inputError,
              style,
            ]}
            placeholderTextColor={colors.textLight}
            secureTextEntry={isPassword && !revealed}
            accessibilityLabel={label ?? props.placeholder}
            accessibilityHint={error ? `Error: ${error}` : hint}
            onFocus={e => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={e => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              style={styles.toggle}
              onPress={() => setRevealed(r => !r)}
              accessibilityRole="button"
              accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.toggleText}>{revealed ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : hint ? (
          <Text style={styles.hint}>{hint}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: 16,
    color: colors.text,
    minHeight: 52,
  },
  inputWithToggle: {
    paddingRight: 64,
  },
  inputFocused: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger,
  },
  toggle: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
