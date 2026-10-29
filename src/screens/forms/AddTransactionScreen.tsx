import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ChipGroup } from '../../components/ChipGroup';
import { DateField } from '../../components/DateField';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { categoriesApi, transactionsApi } from '../../services/finance';
import { TransactionType } from '../../types';
import { isValidISODate, toISODate } from '../../utils/format';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

// Used until the category list loads (or if it fails).
const defaultCategories: Record<TransactionType, string[]> = {
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Other'],
  income: ['Income', 'Freelance', 'Investment'],
};

type Errors = { amount?: string; category?: string; date?: string };

export const AddTransactionScreen: React.FC<Props> = ({ navigation, route }) => {
  const editing = route.params?.transaction;
  const [type, setType] = useState<TransactionType>(
    editing?.type ?? route.params?.type ?? 'expense',
  );
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState<string | null>(editing?.category ?? null);
  const [date, setDate] = useState(editing?.date ?? toISODate());
  const [title, setTitle] = useState(
    editing && editing.title !== editing.category ? editing.title : '',
  );
  const [categories, setCategories] = useState(defaultCategories);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    categoriesApi
      .list()
      .then(list => {
        const byType = (t: TransactionType) => list.filter(c => c.type === t).map(c => c.name);
        if (list.length) setCategories({ expense: byType('expense'), income: byType('income') });
      })
      .catch(() => {});
  }, []);

  // Keep a category that was saved before but isn't in the standard list.
  const options =
    category && !categories[type].includes(category)
      ? [...categories[type], category]
      : categories[type];

  const switchType = (next: TransactionType) => {
    if (next === type) return;
    setType(next);
    setCategory(null);
    setErrors(e => ({ ...e, category: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    const parsed = Number(amount.replace(',', '.'));
    if (!amount.trim()) next.amount = 'Enter an amount';
    else if (!Number.isFinite(parsed) || parsed <= 0) next.amount = 'Enter a number greater than 0';
    if (!category) next.category = `Choose a ${type === 'income' ? 'source' : 'category'}`;
    if (!isValidISODate(date)) next.date = 'Enter a valid date as YYYY-MM-DD';
    return next;
  };

  const handleSave = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload = {
      type,
      amount: Number(amount.replace(',', '.')),
      category: category!,
      title: title.trim() || category!,
      date,
    };

    try {
      setLoading(true);
      if (editing) {
        await transactionsApi.update(editing.id, payload);
        showToast('Transaction updated');
        navigation.pop(2);
      } else {
        await transactionsApi.create(payload);
        showToast(type === 'income' ? 'Income added' : 'Expense added');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        'Couldn’t save',
        error instanceof Error ? error.message : 'Unable to save transaction. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const heading = editing ? 'Edit transaction' : type === 'income' ? 'Add Income' : 'Add Expense';

  return (
    <View style={styles.container}>
      <ScreenHeader title={heading} showBack />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.typeToggle} accessibilityRole="radiogroup" accessibilityLabel="Type">
          {(['income', 'expense'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnActive]}
              onPress={() => switchType(t)}
              accessibilityRole="radio"
              accessibilityState={{ selected: type === t }}>
              <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                {t === 'income' ? 'Income' : 'Expense'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Amount ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={v => {
            setAmount(v);
            if (errors.amount) setErrors(e => ({ ...e, amount: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.amount}
          autoFocus={!editing}
        />
        <ChipGroup
          label={type === 'income' ? 'Source' : 'Category'}
          options={options}
          value={category}
          onChange={c => {
            setCategory(c);
            setErrors(e => ({ ...e, category: undefined }));
          }}
          error={errors.category}
        />
        <DateField
          label="Date"
          value={date}
          onChange={d => {
            setDate(d);
            setErrors(e => ({ ...e, date: undefined }));
          }}
          presets={[
            { label: 'Today', offset: 0 },
            { label: 'Yesterday', offset: -1 },
          ]}
          error={errors.date}
        />
        <Input
          label="Description (optional)"
          placeholder={type === 'income' ? 'e.g. March salary' : 'e.g. Lunch with team'}
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <Button
          title={editing ? 'Save changes' : 'Save transaction'}
          onPress={handleSave}
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
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: colors.primary,
  },
  typeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeBtnTextActive: {
    color: colors.white,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
