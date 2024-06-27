export interface AdaData {
  price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
}

export interface TransactionData {
  timestamp: string;
  count: number;
}

export interface DashboardProps {
}

export interface DashboardState {
  adaData: AdaData | null;
  transactionData: TransactionData[];
}