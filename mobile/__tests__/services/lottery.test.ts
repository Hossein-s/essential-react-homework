import {
  createNewLottery,
  getLotteries,
  registerToLottery,
} from '../../services/lottery';
import { lottery } from '../fixtures/lottery';

const API_URL = 'https://api.test';

beforeEach(() => {
  global.fetch = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('lottery service', () => {
  it('fetches lotteries', async () => {
    const items = [lottery('1')];
    (fetch as jest.Mock).mockResolvedValue({
      json: async () => items,
    });

    await expect(getLotteries()).resolves.toEqual(items);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/lotteries`);
  });

  it('creates a lottery', async () => {
    const created = lottery('new');
    (fetch as jest.Mock).mockResolvedValue({
      json: async () => created,
    });

    await expect(
      createNewLottery({ name: 'A', prize: 'B' }),
    ).resolves.toEqual(created);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/lotteries`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ type: 'simple', name: 'A', prize: 'B' }),
      }),
    );
  });

  it('throws when registration fails', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(
      registerToLottery({ name: 'Ann', lotteryId: '1' }),
    ).rejects.toThrow('Bad Request');
  });
});
