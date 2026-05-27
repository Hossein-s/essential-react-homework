import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'registeredLotteries';
const LEGACY_STORAGE_KEY = 'registeredLoterries';

async function readRegisteredLotteryIds(): Promise<string[]> {
  let raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw !== null) {
      await AsyncStorage.setItem(STORAGE_KEY, raw);
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }

  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Merges new lottery ids into AsyncStorage (deduped).
 * Call after a successful registration flow.
 */
export async function appendRegisteredLotteryIds(ids: string[]): Promise<void> {
  const existing = await readRegisteredLotteryIds();
  const next = [...new Set([...existing, ...ids])];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useRegisteredLotteries() {
  const [registeredLotteries, setRegisteredLotteries] = useState<string[]>([]);

  const getRegisteredLotteries = useCallback(async () => {
    setRegisteredLotteries(await readRegisteredLotteryIds());
  }, []);

  useEffect(() => {
    getRegisteredLotteries();
  }, [getRegisteredLotteries]);

  return {
    data: registeredLotteries,
    getRegisteredLotteries,
  };
}
