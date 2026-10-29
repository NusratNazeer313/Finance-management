import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const progress = React.useRef(new Animated.Value(0)).current;
  const fade = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation, progress, fade]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.atmosphere} />
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <View style={styles.logoContainer}>
          <Icon name="logo" size={36} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.appName}>Finance Manager</Text>
        <Text style={styles.tagline}>Clear money. Calm decisions.</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmosphere: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryDark,
    opacity: 0.35,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    ...typography.title,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(244,247,246,0.7)',
    marginBottom: spacing.xl,
  },
  progressTrack: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.textOnPrimary,
    borderRadius: 2,
  },
});
