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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AuthStackParamList } from '../../navigation/types';
import { authApi } from '../../services/finance';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
  onLogin: () => void;
};

export const SignUpScreen: React.FC<Props> = ({ navigation, onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const clear = (field: keyof typeof errors) =>
    setErrors(e => ({ ...e, [field]: undefined, form: undefined }));

  const handleSignUp = async () => {
    const found: typeof errors = {};
    if (!name.trim()) found.name = 'Enter your name';
    if (!email.trim()) found.email = 'Enter your email';
    else if (!EMAIL_RE.test(email.trim())) found.email = 'Enter a valid email, like name@example.com';
    if (password.length < 8) found.password = 'Use at least 8 characters';
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      await authApi.register(name.trim(), email.trim(), password);
      onLogin();
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Unable to create account. Try again.',
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start managing your finances today</Text>
        </View>

        <View style={styles.form}>
          {errors.form && (
            <View style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          )}
          <Input
            label="Full name"
            placeholder="Enter your name"
            value={name}
            onChangeText={v => {
              setName(v);
              clear('name');
            }}
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Input
            ref={emailRef}
            label="Email"
            placeholder="name@example.com"
            value={email}
            onChangeText={v => {
              setEmail(v);
              clear('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Input
            ref={passwordRef}
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={v => {
              setPassword(v);
              clear('password');
            }}
            secureTextEntry
            autoComplete="new-password"
            error={errors.password}
            hint="At least 8 characters"
            returnKeyType="go"
            onSubmitEditing={handleSignUp}
          />

          <Button
            title="Create account"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="link"
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}>
            <Text style={styles.footerLink}>Sign in</Text>
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
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  signUpBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    gap: spacing.sm,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
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
