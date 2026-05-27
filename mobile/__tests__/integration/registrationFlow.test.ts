import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useRegisterToLottery } from '../../hooks/useRegisterToLottery';
import { useRegisteredLotteries } from '../../hooks/useRegisteredLotteries';
import * as LotteryService from '../../services/lottery';
import { lottery } from '../fixtures/lottery';

jest.mock('../../services/lottery');

const mockRegister = LotteryService.registerToLottery as jest.MockedFunction<
  typeof LotteryService.registerToLottery
>;

/**
 * End-to-end hook flow: register via API, persist locally, read back on refresh.
 */
describe('registration flow', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
  });

  it('persists registered lottery ids after successful registration', async () => {
    const lotteries = [lottery('x')];
    const registerHook = renderHook(() => useRegisterToLottery(lotteries));
    const storageHook = renderHook(() => useRegisteredLotteries());

    await waitFor(() => {
      expect(storageHook.result.current.data).toEqual([]);
    });

    await act(async () => {
      await registerHook.result.current.registerToLotteries('Player');
    });

    await act(async () => {
      await storageHook.result.current.getRegisteredLotteries();
    });

    await waitFor(() => {
      expect(storageHook.result.current.data).toEqual(['x']);
    });
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Player',
      lotteryId: 'x',
    });
  });
});
