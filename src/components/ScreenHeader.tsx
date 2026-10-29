import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Icon } from './Icon';

interface ScreenHeaderProps {
  title?: string;
  greeting?: string;
  subtitle?: string;
  showNotification?: boolean;
  /** Number of unread notifications; the red dot shows only when > 0. */
  unreadCount?: number;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  onNotificationPress?: () => void;
  compact?: boolean;
  /** Dark green header used on the home screen */
  variant?: 'default' | 'dark';
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  greeting,
  subtitle,
  showNotification = false,
  unreadCount = 0,
  showBack = false,
  onBackPress,
  rightAction,
  onNotificationPress,
  compact = false,
  variant = 'default',
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isDark = variant === 'dark';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        isDark && styles.containerDark,
        { paddingTop: insets.top + (compact ? 0 : spacing.sm) },
      ]}>
      <View style={[styles.content, compact && styles.contentCompact]}>
        {showBack && (
          <TouchableOpacity
            style={[styles.backBtn, isDark && styles.backBtnDark]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon
              name="arrow-left"
              size={20}
              color={isDark ? colors.textOnPrimary : colors.text}
            />
          </TouchableOpacity>
        )}

        <View style={styles.textContainer}>
          {compact && greeting && title ? (
            <Text style={[styles.titleInline, isDark && styles.titleDark]} numberOfLines={1}>
              <Text style={[styles.greetingInline, isDark && styles.greetingDark]}>
                {greeting},{' '}
              </Text>
              {title}
            </Text>
          ) : (
            <>
              {greeting && (
                <Text style={[styles.greeting, isDark && styles.greetingDark]}>{greeting}</Text>
              )}
              {title && (
                <Text
                  style={[styles.title, showBack && styles.titleWithBack, isDark && styles.titleDark]}
                  numberOfLines={1}
                  accessibilityRole="header">
                  {title}
                </Text>
              )}
            </>
          )}
          {subtitle && !compact && (
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>
          )}
        </View>

        {showNotification && (
          <TouchableOpacity
            style={[
              styles.notificationBtn,
              compact && styles.notificationBtnCompact,
              isDark && styles.notificationBtnDark,
            ]}
            onPress={onNotificationPress}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
            }>
            <Icon
              name="bell"
              size={compact ? 16 : 20}
              color={isDark ? colors.textOnPrimary : colors.text}
            />
            {unreadCount > 0 && <View style={[styles.dot, compact && styles.dotCompact]} />}
          </TouchableOpacity>
        )}
        {rightAction}
        {!showNotification && !rightAction && showBack ? <View style={styles.rightSpacer} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  } as ViewStyle,
  containerCompact: {
    paddingBottom: 6,
  },
  containerDark: {
    backgroundColor: colors.primaryDark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCompact: {
    minHeight: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  backBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  greeting: {
    ...typography.caption,
    marginBottom: 1,
  } as TextStyle,
  greetingInline: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  } as TextStyle,
  greetingDark: {
    color: 'rgba(244,247,246,0.72)',
  },
  title: {
    ...typography.title,
    fontSize: 24,
  } as TextStyle,
  titleWithBack: {
    fontSize: 20,
  },
  titleCompact: {
    ...typography.heading,
    fontSize: 20,
    letterSpacing: -0.3,
  } as TextStyle,
  titleInline: {
    ...typography.heading,
    fontSize: 17,
    letterSpacing: -0.2,
    lineHeight: 22,
  } as TextStyle,
  titleDark: {
    color: colors.textOnPrimary,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  } as TextStyle,
  subtitleDark: {
    color: 'rgba(244,247,246,0.65)',
  },
  rightSpacer: {
    width: 40,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBtnCompact: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  notificationBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  dot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.expense,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  dotCompact: {
    top: 6,
    right: 7,
    width: 6,
    height: 6,
  },
});
