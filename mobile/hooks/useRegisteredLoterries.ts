import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'registeredLoterries';

/**
 * Merges new lottery ids into AsyncStorage (deduped).
 * Call after a successful registration flow.
 */
export async function appendRegisteredLotteryIds(ids: string[]): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let existing: string[] = [];
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    existing = Array.isArray(parsed) ? parsed : [];
  } catch {
    existing = [];
  }
  const next = [...new Set([...existing, ...ids])];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useRegisteredLoterries() {
  const [registeredLotteries, setRegisteredLotteries] = useState<string[]>([]);

  const getRegisteredLotteries = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setRegisteredLotteries(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRegisteredLotteries([]);
    }
  }, []);

  useEffect(() => {
    getRegisteredLotteries();
  }, [getRegisteredLotteries]);

  return {
    data: registeredLotteries,
    getRegisteredLotteries,
  };
}
