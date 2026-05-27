import { useCallback, useEffect, useRef, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';
import { toErrorMessage } from '../utils/toErrorMessage';
import { appendRegisteredLotteryIds } from './useRegisteredLotteries';

export function useRegisterToLottery(lotteries: Lottery[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inFlightRef = useRef(false);

  useEffect(() => {
    setError(undefined);
  }, [lotteries]);

  const registerToLotteries = useCallback(
    (name: string) => {
      if (inFlightRef.current) {
        return Promise.reject(
          new Error('Registration already in progress'),
        );
      }

      inFlightRef.current = true;
      setError(undefined);
      setLoading(true);

      const trimmedName = name.trim();

      return (async () => {
        for (const lottery of lotteries) {
          await LotteryService.registerToLottery({
            name: trimmedName,
            lotteryId: lottery.id,
          });
        }
        await appendRegisteredLotteryIds(lotteries.map((l) => l.id));
      })()
        .catch((e: unknown) => {
          const message = toErrorMessage(e);
          setError(message);
          throw e;
        })
        .finally(() => {
          inFlightRef.current = false;
          setLoading(false);
        });
    },
    [lotteries],
  );

  return {
    loading,
    error,
    registerToLotteries,
  };
}
