import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { goalsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateGoal'>;
};

export const CreateGoalScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const parsedTarget = Number(target);
    if (!name.trim() || !parsedTarget) {
      Alert.alert('Missing fields', 'Please enter goal name and target amount.');
      return;
    }

    try {
      setLoading(true);
      await goalsApi.create({ name: name.trim(), target: parsedTarget });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Create failed',
        error instanceof Error ? error.message : 'Unable to create goal',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Goal" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageIcon}>🖼️</Text>
          <Text style={styles.imageText}>Add Goal Image</Text>
        </View>

        <Input
          label="Goal Name"
          placeholder="e.g. MacBook Pro"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Target Amount"
          placeholder="0.00"
          value={target}
          onChangeText={setTarget}
          keyboardType="decimal-pad"
        />
        <Input label="Start Date" placeholder="May 1, 2024" />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.saveBtn} />
        ) : (
          <Button title="Create Goal" onPress={handleCreate} style={styles.saveBtn} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  imageIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  imageText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
