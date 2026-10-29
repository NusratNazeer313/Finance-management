import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { DateField } from '../../components/DateField';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { billsApi } from '../../services/finance';
import { isValidISODate, toISODate } from '../../utils/format';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddBill'>;
};

type Errors = { name?: string; amount?: string; dueDate?: string };

export const AddBillScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(toISODate());
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const amountRef = useRef<TextInput>(null);
  const { showToast } = useToast();

  const handleCreate = async () => {
    const parsed = Number(amount.replace(',', '.'));
    const found: Errors = {};
    if (!name.trim()) found.name = 'Enter the bill name';
    if (!amount.trim()) found.amount = 'Enter the amount';
    else if (!Number.isFinite(parsed) || parsed <= 0) found.amount = 'Enter a number greater than 0';
    if (!isValidISODate(dueDate)) found.dueDate = 'Enter a valid date as YYYY-MM-DD';
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      await billsApi.create({ name: name.trim(), amount: parsed, dueDate });
      showToast('Bill added');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Couldn’t add bill',
        error instanceof Error ? error.message : 'Unable to add bill. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Bill" showBack />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input
          label="Bill name"
          placeholder="e.g. WiFi Internet"
          value={name}
          onChangeText={v => {
            setName(v);
            if (errors.name) setErrors(e => ({ ...e, name: undefined }));
          }}
          error={errors.name}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => amountRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={amountRef}
          label="Amount ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={v => {
            setAmount(v);
            if (errors.amount) setErrors(e => ({ ...e, amount: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.amount}
        />
        <DateField
          label="Due date"
          value={dueDate}
          onChange={d => {
            setDueDate(d);
            setErrors(e => ({ ...e, dueDate: undefined }));
          }}
          presets={[
            { label: 'Today', offset: 0 },
            { label: 'Tomorrow', offset: 1 },
            { label: 'In a week', offset: 7 },
          ]}
          error={errors.dueDate}
        />

        <Button title="Add bill" onPress={handleCreate} loading={loading} style={styles.saveBtn} />
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
