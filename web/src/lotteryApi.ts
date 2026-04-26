import type { Lottery, LotteryStatus } from './lotteryTypes';

const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

function normalizeStatus(value: string | undefined): LotteryStatus {
  if (value === 'finished' || value === 'running') return value;
  return 'running';
}

function normalizeLotteryRecord(raw: Record<string, string>): Lottery {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    prize: String(raw.prize ?? ''),
    type: String(raw.type ?? ''),
    status: normalizeStatus(raw.status),
  };
}

export async function fetchLotteries(): Promise<Lottery[]> {
  const response = await fetch(`${API_BASE}/lotteries`);
  if (!response.ok) {
    throw new Error('Failed to load lotteries');
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter(
      (item): item is Record<string, string> =>
        item !== null && typeof item === 'object',
    )
    .map((item) => normalizeLotteryRecord(item as Record<string, string>));
}

export async function registerForLottery(
  lotteryId: string,
  name: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lotteryId, name }),
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => ({}));
    const errMsg =
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : 'Failed to register';
    throw new Error(errMsg);
  }
}

export { API_BASE };
