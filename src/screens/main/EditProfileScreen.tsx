import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { profileApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    profileApi
      .get()
      .then(user => {
        setName(user.name);
        setEmail(user.email);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Enter your name');
      return;
    }
    try {
      setSaving(true);
      await profileApi.update({ name: name.trim() });
      showToast('Profile updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Couldn’t save', err instanceof Error ? err.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Personal details" showBack />
      {!loaded ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Input
            label="Full name"
            value={name}
            onChangeText={v => {
              setName(v);
              setError(undefined);
            }}
            autoCapitalize="words"
            error={error}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <Input
            label="Email"
            value={email}
            editable={false}
            hint="Email can’t be changed yet."
            style={styles.readOnly}
          />
          <Button title="Save changes" onPress={handleSave} loading={saving} style={styles.save} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    marginTop: spacing.xl,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  readOnly: {
    backgroundColor: colors.surfaceMuted,
    color: colors.textSecondary,
  },
  save: {
    marginTop: spacing.md,
  },
});
