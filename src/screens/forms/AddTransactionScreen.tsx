import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { transactionsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;
  route: RouteProp<RootStackParamList, 'AddTransaction'>;
};

export const AddTransactionScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialType = route.params?.type || 'expense';
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const parsedAmount = Number(amount);
    if (!category.trim() || !parsedAmount) {
      Alert.alert('Missing fields', 'Please enter amount and category.');
      return;
    }

    try {
      setLoading(true);
      await transactionsApi.create({
        type,
        amount: parsedAmount,
        category: category.trim(),
        title: notes.trim() || category.trim(),
        notes: notes.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Save failed',
        error instanceof Error ? error.message : 'Unable to save transaction',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={type === 'income' ? 'Add Income' : 'Add Expense'} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]}
            onPress={() => setType('income')}>
            <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
            onPress={() => setType('expense')}>
            <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <Input
          label={type === 'income' ? 'Source' : 'Category'}
          placeholder={type === 'income' ? 'e.g. Salary' : 'e.g. Food'}
          value={category}
          onChangeText={setCategory}
        />
        <Input label="Date" placeholder="May 15, 2024" />
        <Input
          label="Notes"
          placeholder="Add a note (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.saveBtn} />
        ) : (
          <Button title="Save Transaction" onPress={handleSave} style={styles.saveBtn} />
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
