import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Icon, IconName } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { User } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { profileApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  onLogout: () => void;
};

type MenuItem = {
  icon: IconName;
  label: string;
  /** Not built yet — shown dimmed with a "Coming soon" tag instead of a dead tap. */
  comingSoon?: boolean;
  route?: 'EditProfile' | 'Notifications';
};

const menuItems: MenuItem[] = [
  { icon: 'profile', label: 'Personal details', route: 'EditProfile' },
  { icon: 'bell', label: 'Notifications', route: 'Notifications' },
  { icon: 'lightbulb', label: 'Help & support' },
  { icon: 'card', label: 'Subscription', comingSoon: true },
  { icon: 'spark', label: 'Preferences', comingSoon: true },
  { icon: 'wallet', label: 'Security', comingSoon: true },
];

export const ProfileScreen: React.FC<Props> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setUser(await profileApi.get());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'You’ll need your email and password to sign back in.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: onLogout },
    ]);

  const openItem = (item: MenuItem) => {
    if (item.route) navigation.navigate(item.route);
    else if (item.label === 'Help & support') {
      Alert.alert(
        'Help & support',
        'Pull down on any screen to refresh. Tap a transaction to edit or delete it, and tap a bill to mark it paid.\n\nStill stuck? Contact your Finance Manager administrator.',
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && !user) {
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
      <ScreenHeader title="Profile" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user!.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user!.name}</Text>
          <Text style={styles.userEmail}>{user!.email}</Text>
        </Card>

        <Card style={styles.menuCard} padding={0}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index > 0 && styles.menuBorder, item.comingSoon && styles.menuDisabled]}
              activeOpacity={0.7}
              disabled={item.comingSoon}
              onPress={() => openItem(item)}
              accessibilityRole="button"
              accessibilityState={{ disabled: !!item.comingSoon }}
              accessibilityLabel={item.comingSoon ? `${item.label}, coming soon` : item.label}>
              <View style={styles.menuIconWrap}>
                <Icon name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.comingSoon ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Coming soon</Text>
                </View>
              ) : (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Button
          title="Sign out"
          variant="outline"
          onPress={confirmSignOut}
          style={styles.logoutBtn}
          textStyle={{ color: colors.danger }}
        />
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  userName: {
    ...typography.title,
    fontSize: 22,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.caption,
  },
  menuCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    ...typography.bodyStrong,
  },
  menuDisabled: {
    opacity: 0.55,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  menuArrow: {
    fontSize: 22,
    color: colors.textLight,
  },
  logoutBtn: {
    borderColor: colors.danger,
  },
});
