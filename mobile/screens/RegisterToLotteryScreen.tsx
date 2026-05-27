import { useLayoutEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Form } from '../components/Form';
import { useRegisterToLottery } from '../hooks/useRegisterToLottery';
import { stackHeaderOptions } from '../navigation/headerOptions';
import type { RootStackParamList } from '../types';

type RegisterNav = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterToLottery'
>;
type RegisterRoute = RouteProp<RootStackParamList, 'RegisterToLottery'>;

export function RegisterToLotteryScreen() {
  const navigation = useNavigation<RegisterNav>();
  const route = useRoute<RegisterRoute>();
  const { lotteries } = route.params;
  const { registerToLotteries, loading, error } = useRegisterToLottery(lotteries);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...stackHeaderOptions,
      title: 'Register to lottery',
    });
  }, [navigation]);

  return (
    <Form
      variant="register"
      lotteries={lotteries}
      loading={loading}
      error={error}
      onCancel={() => {
        navigation.goBack();
      }}
      onSubmit={async (name) => {
        try {
          await registerToLotteries(name);
          navigation.navigate('Home', { lotteryRegistered: true });
        } catch {
          // error surfaced via hook
        }
      }}
    />
  );
}
