import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { billsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddBill'>;
};

export const AddBillScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const parsedAmount = Number(amount);
    if (!name.trim() || !parsedAmount) {
      Alert.alert('Missing fields', 'Please enter bill name and amount.');
      return;
    }

    try {
      setLoading(true);
      await billsApi.create({
        name: name.trim(),
        amount: parsedAmount,
        dueDate: dueDate.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Add failed',
        error instanceof Error ? error.message : 'Unable to add bill',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Bill" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Input
          label="Bill Name"
          placeholder="e.g. WiFi Internet"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <Input
          label="Due Date"
          placeholder="2024-05-15"
          value={dueDate}
          onChangeText={setDueDate}
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.saveBtn} />
        ) : (
          <Button title="Add Bill" onPress={handleCreate} style={styles.saveBtn} />
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
