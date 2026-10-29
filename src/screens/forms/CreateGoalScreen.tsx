import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/types';
import { goalsApi } from '../../services/finance';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateGoal'>;
};

type Errors = { name?: string; target?: string; current?: string };

const parseMoney = (v: string) => Number(v.replace(',', '.'));

export const CreateGoalScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const targetRef = useRef<TextInput>(null);
  const currentRef = useRef<TextInput>(null);
  const { showToast } = useToast();

  const handleCreate = async () => {
    const found: Errors = {};
    const t = parseMoney(target);
    const c = current.trim() ? parseMoney(current) : 0;
    if (!name.trim()) found.name = 'Give your goal a name';
    if (!target.trim()) found.target = 'Enter how much you want to save';
    else if (!Number.isFinite(t) || t <= 0) found.target = 'Enter a number greater than 0';
    if (!Number.isFinite(c) || c < 0) found.current = 'Enter 0 or more';
    else if (Number.isFinite(t) && c > t) found.current = 'Can’t be more than the target';
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      await goalsApi.create({ name: name.trim(), target: t, current: c });
      showToast('Goal created');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Couldn’t create goal',
        error instanceof Error ? error.message : 'Unable to create goal. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Goal" showBack />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input
          label="Goal name"
          placeholder="e.g. Vacation"
          value={name}
          onChangeText={v => {
            setName(v);
            if (errors.name) setErrors(e => ({ ...e, name: undefined }));
          }}
          error={errors.name}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => targetRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={targetRef}
          label="Target amount ($)"
          placeholder="0.00"
          value={target}
          onChangeText={v => {
            setTarget(v);
            if (errors.target) setErrors(e => ({ ...e, target: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.target}
          returnKeyType="next"
          onSubmitEditing={() => currentRef.current?.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={currentRef}
          label="Already saved ($, optional)"
          placeholder="0.00"
          value={current}
          onChangeText={v => {
            setCurrent(v);
            if (errors.current) setErrors(e => ({ ...e, current: undefined }));
          }}
          keyboardType="decimal-pad"
          error={errors.current}
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        <Button title="Create goal" onPress={handleCreate} loading={loading} style={styles.saveBtn} />
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
