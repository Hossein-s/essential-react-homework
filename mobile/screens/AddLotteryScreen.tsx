import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Form } from '../components/Form';
import { useNewLottery } from '../hooks/useNewLottery';
import { stackHeaderOptions } from '../navigation/headerOptions';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddLottery'>;

export function AddLotteryScreen() {
  const navigation = useNavigation<Nav>();
  const { createNewLottery, loading, error } = useNewLottery();

  useLayoutEffect(() => {
    navigation.setOptions({
      ...stackHeaderOptions,
      title: 'Add new Lottery',
    });
  }, [navigation]);

  return (
    <Form
      variant="addLottery"
      loading={loading}
      error={error}
      onSubmit={async (values) => {
        try {
          await createNewLottery(values);
          navigation.goBack();
        } catch {
          // error surfaced via hook
        }
      }}
    />
  );
}
