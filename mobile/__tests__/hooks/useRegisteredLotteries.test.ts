import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  appendRegisteredLotteryIds,
  useRegisteredLotteries,
} from '../../hooks/useRegisteredLotteries';

describe('useRegisteredLotteries', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('loads stored ids on mount', async () => {
    await AsyncStorage.setItem('registeredLotteries', JSON.stringify(['a']));

    const { result } = renderHook(() => useRegisteredLotteries());

    await waitFor(() => {
      expect(result.current.data).toEqual(['a']);
    });
  });

  it('appends ids without duplicates', async () => {
    await AsyncStorage.setItem('registeredLotteries', JSON.stringify(['a']));

    await appendRegisteredLotteryIds(['a', 'b']);

    expect(JSON.parse((await AsyncStorage.getItem('registeredLotteries'))!)).toEqual(
      ['a', 'b'],
    );
  });

  it('migrates legacy storage key', async () => {
    await AsyncStorage.setItem('registeredLoterries', JSON.stringify(['legacy']));

    const { result } = renderHook(() => useRegisteredLotteries());

    await waitFor(() => {
      expect(result.current.data).toEqual(['legacy']);
    });

    expect(await AsyncStorage.getItem('registeredLoterries')).toBeNull();
    expect(await AsyncStorage.getItem('registeredLotteries')).toBe(
      JSON.stringify(['legacy']),
    );
  });
});
