import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ChipGroup } from '../../components/ChipGroup';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { budgetsApi, categoriesApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateBudget'>;
};

const defaultCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Other'];

type Errors = { category?: string; amount?: string };

export const CreateBudgetScreen: React.FC<Props> = ({ navigation }) => {
  const [category, setCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [options, setOptions] = useState(defaultCategories);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Only offer categories that don't have a budget yet.
  useEffect(() => {
    Promise.all([categoriesApi.list(), budgetsApi.list()])
      .then(([categories, budgets]) => {
        const taken = budgets.map(b => b.category.toLowerCase());
        const isTaken = (name: string) =>
          taken.some(t => t === name.toLowerCase() || t.split(/\s*&\s*|\s+/).includes(name.toLowerCase()));
        setOptions(categories.filter(c => c.type === 'expense').map(c => c.name).filter(n => !isTaken(n)));
      })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    const parsed = Number(amount.replace(',', '.'));
    const found: Errors = {};
    if (!category) found.category = 'Choose a category';
    if (!amount.trim()) found.amount = 'Enter a monthly limit';
    else if (!Number.isFinite(parsed) || parsed <= 0) found.amount = 'Enter a number greater than 0';
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      await budgetsApi.create({ category: category!, amount: parsed });
      showToast(`${category} budget created`);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Couldn’t create budget',
        error instanceof Error ? error.message : 'Unable to create budget. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Budget" showBack />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ChipGroup
          label="Category"
          options={options}
          value={category}
          onChange={c => {
            setCategory(c);
            setErrors(e => ({ ...e, category: undefined }));
          }}
          error={
            errors.category ?? (options.length ? undefined : 'Every category already has a budget')
          }
        />
        <Input
          label="Monthly limit ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={v => {
            setAmount(v);
            if (errors.amount) setErrors(e => ({ ...e, amount: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.amount}
          hint="Resets at the start of each month. This month’s spending counts right away."
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        <Button
          title="Create budget"
          onPress={handleCreate}
          loading={loading}
          style={styles.saveBtn}
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
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
