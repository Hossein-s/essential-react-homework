import { useCallback, useRef, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export default function useLotteries() {
  const [lotteries, setLotteries] = useState<Array<Lottery>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const fetchIdRef = useRef(0);

  const fetchLotteries = useCallback(() => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setError(undefined);

    LotteryService.getLotteries()
      .then((fetched) => {
        if (fetchId !== fetchIdRef.current) {
          return;
        }
        setLotteries(fetched);
      })
      .catch((e: Error) => {
        if (fetchId !== fetchIdRef.current) {
          return;
        }
        setError(e.message);
      })
      .finally(() => {
        if (fetchId !== fetchIdRef.current) {
          return;
        }
        setLoading(false);
      });
  }, []);

  return {
    data: lotteries,
    loading,
    error,
    fetchLotteries,
  };
}
