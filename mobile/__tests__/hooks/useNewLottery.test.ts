import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useNewLottery } from '../../hooks/useNewLottery';
import * as LotteryService from '../../services/lottery';
import { lottery } from '../fixtures/lottery';

jest.mock('../../services/lottery');

const mockCreate = LotteryService.createNewLottery as jest.MockedFunction<
  typeof LotteryService.createNewLottery
>;

describe('useNewLottery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the created lottery', async () => {
    const created = lottery('new');
    mockCreate.mockResolvedValue(created);

    const { result } = renderHook(() => useNewLottery());

    let resolved: typeof created | undefined;
    await act(async () => {
      resolved = await result.current.createNewLottery({
        name: 'A',
        prize: 'B',
      });
    });

    expect(resolved).toEqual(created);
    expect(result.current.data).toEqual(created);
  });

  it('rejects concurrent create calls', async () => {
    let resolveCreate!: (value: ReturnType<typeof lottery>) => void;
    mockCreate.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );

    const { result } = renderHook(() => useNewLottery());

    let first: Promise<unknown>;
    act(() => {
      first = result.current.createNewLottery({ name: 'A', prize: 'B' });
    });

    await expect(
      result.current.createNewLottery({ name: 'C', prize: 'D' }),
    ).rejects.toThrow('already being created');

    await act(async () => {
      resolveCreate(lottery('done'));
      await first!;
    });
  });
});
