import { useCallback, useRef, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';
import { toErrorMessage } from '../utils/toErrorMessage';

export function useNewLottery() {
  const [lottery, setLottery] = useState<Lottery>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inFlightRef = useRef(false);

  const createNewLottery = useCallback(
    (lotteryData: { name: string; prize: string }) => {
      if (inFlightRef.current) {
        return Promise.reject(
          new Error('A lottery is already being created'),
        );
      }

      inFlightRef.current = true;
      setError(undefined);
      setLoading(true);

      return LotteryService.createNewLottery(lotteryData)
        .then((created) => {
          setLottery(created);
          return created;
        })
        .catch((e: unknown) => {
          setError(toErrorMessage(e));
          throw e;
        })
        .finally(() => {
          inFlightRef.current = false;
          setLoading(false);
        });
    },
    [],
  );

  return {
    data: lottery,
    loading,
    error,
    createNewLottery,
  };
}
