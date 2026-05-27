import { act, renderHook, waitFor } from '@testing-library/react-native';
import useLotteries from '../../hooks/useLotteries';
import * as LotteryService from '../../services/lottery';
import { lottery } from '../fixtures/lottery';

jest.mock('../../services/lottery');

const mockGetLotteries = LotteryService.getLotteries as jest.MockedFunction<
  typeof LotteryService.getLotteries
>;

describe('useLotteries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads lotteries on fetch', async () => {
    const items = [lottery('1')];
    mockGetLotteries.mockResolvedValue(items);

    const { result } = renderHook(() => useLotteries());

    act(() => {
      result.current.fetchLotteries();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(items);
    expect(result.current.error).toBeUndefined();
  });

  it('ignores stale fetch responses', async () => {
    let resolveSlow: (value: ReturnType<typeof lottery>[]) => void;
    const slow = new Promise<ReturnType<typeof lottery>[]>((resolve) => {
      resolveSlow = resolve;
    });

    mockGetLotteries
      .mockReturnValueOnce(slow)
      .mockResolvedValueOnce([lottery('fresh')]);

    const { result } = renderHook(() => useLotteries());

    act(() => {
      result.current.fetchLotteries();
      result.current.fetchLotteries();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([lottery('fresh')]);
    });

    act(() => {
      resolveSlow!([lottery('stale')]);
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([lottery('fresh')]);
    });
  });
});
