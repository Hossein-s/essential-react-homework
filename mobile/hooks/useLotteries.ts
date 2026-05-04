import { useCallback, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export default function useLotteries() {
  const [lotteries, setLotteries] = useState<Array<Lottery>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchLotteries = useCallback(() => {
    setLoading(true);
    setError(undefined);

    LotteryService.getLottieries()
      .then((lotteries) => {
        setLoading(false);
        setLotteries(lotteries);
      })
      .catch((e: Error) => {
        setLoading(false);
        setError(e.message);
      });
  }, []);

  return {
    data: lotteries,
    loading,
    error,
    fetchLotteries,
  };
}
