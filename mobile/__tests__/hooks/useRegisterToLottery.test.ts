import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useRegisterToLottery } from '../../hooks/useRegisterToLottery';
import * as LotteryService from '../../services/lottery';
import { appendRegisteredLotteryIds } from '../../hooks/useRegisteredLotteries';
import { lottery } from '../fixtures/lottery';

jest.mock('../../services/lottery');
jest.mock('../../hooks/useRegisteredLotteries', () => ({
  appendRegisteredLotteryIds: jest.fn(),
}));

const mockRegister = LotteryService.registerToLottery as jest.MockedFunction<
  typeof LotteryService.registerToLottery
>;
const mockAppend = appendRegisteredLotteryIds as jest.MockedFunction<
  typeof appendRegisteredLotteryIds
>;

describe('useRegisterToLottery', () => {
  const lotteries = [lottery('1'), lottery('2')];

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
    mockAppend.mockResolvedValue(undefined);
  });

  it('registers for each lottery and persists ids', async () => {
    const { result } = renderHook(() => useRegisterToLottery(lotteries));

    await act(async () => {
      await result.current.registerToLotteries('  Ann  ');
    });

    expect(mockRegister).toHaveBeenCalledTimes(2);
    expect(mockRegister).toHaveBeenNthCalledWith(1, {
      name: 'Ann',
      lotteryId: '1',
    });
    expect(mockAppend).toHaveBeenCalledWith(['1', '2']);
    expect(result.current.error).toBeUndefined();
  });

  it('sets error when registration fails', async () => {
    mockRegister.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRegisterToLottery(lotteries));

    await act(async () => {
      await expect(result.current.registerToLotteries('Ann')).rejects.toThrow(
        'Network error',
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.loading).toBe(false);
    });
  });
});
