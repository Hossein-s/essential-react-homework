export type LotteryStatus = 'running' | 'finished';

export type Lottery = {
  id: string;
  name: string;
  prize: string;
  type: string;
  status: LotteryStatus;
};
