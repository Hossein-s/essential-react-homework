export type Status = 'running' | 'finished';

export interface Lottery {
  id: string;
  name: string;
  prize: string;
  type: string;
  status: Status;
}

export type RootStackParamList = {
  Home: { lotteryRegistered?: boolean } | undefined;
  AddLottery: undefined;
  /** Full selection from Home; register screen sends one API request per lottery */
  RegisterToLottery: { lotteries: Lottery[] };
};
