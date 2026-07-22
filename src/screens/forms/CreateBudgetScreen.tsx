import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { budgetsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateBudget'>;
};

export const CreateBudgetScreen: React.FC<Props> = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const parsedAmount = Number(amount);
    if (!category.trim() || !parsedAmount) {
      Alert.alert('Missing fields', 'Please enter category and amount.');
      return;
    }

    try {
      setLoading(true);
      await budgetsApi.create({ category: category.trim(), amount: parsedAmount });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Create failed',
        error instanceof Error ? error.message : 'Unable to create budget',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Budget" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Input
          label="Category"
          placeholder="e.g. Food & Dining"
          value={category}
          onChangeText={setCategory}
        />
        <Input
          label="Budget Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <Input label="Start Date" placeholder="May 1, 2024" />
        <Input label="End Date" placeholder="May 31, 2024" />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.saveBtn} />
        ) : (
          <Button title="Create Budget" onPress={handleCreate} style={styles.saveBtn} />
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
  saveBtn: {
    marginTop: spacing.md,
  },
});
