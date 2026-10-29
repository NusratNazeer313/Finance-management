import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AuthStackParamList } from '../../navigation/types';
import { authApi } from '../../services/finance';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  onLogin: () => void;
};

export const LoginScreen: React.FC<Props> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const found: typeof errors = {};
    if (!email.trim()) found.email = 'Enter your email';
    else if (!EMAIL_RE.test(email.trim())) found.email = 'Enter a valid email, like name@example.com';
    if (!password) found.password = 'Enter your password';
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      await authApi.login(email.trim(), password);
      onLogin();
    } catch (error) {
      setErrors({
        form:
          error instanceof Error && error.message
            ? `${error.message}. Check your details and try again.`
            : 'Unable to sign in. Check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoSmall}>
            <Icon name="logo" size={28} color={colors.textOnPrimary} />
          </View>
          <Text style={styles.brand}>Finance Manager</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your everyday account</Text>
        </View>

        <View style={styles.form}>
          {errors.form && (
            <View style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          )}
          <Input
            label="Email"
            placeholder="name@example.com"
            value={email}
            onChangeText={v => {
              setEmail(v);
              if (errors.email || errors.form) setErrors({});
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={errors.email}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Input
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={v => {
              setPassword(v);
              if (errors.password || errors.form) setErrors({});
            }}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            error={errors.password}
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
            accessibilityRole="link">
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Sign in" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            accessibilityRole="link"
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formError: {
    backgroundColor: colors.dangerLight,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  formErrorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoSmall: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: {
    ...typography.label,
    color: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  loginBtn: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
});
