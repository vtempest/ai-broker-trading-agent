export interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  weeklyChange?: number;
  weeklyChangePercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  yearlyChange: number;
  yearlyChangePercent: number;
  high: number;
  low: number;
  volume: string;
  type: "index" | "stock";
  source?: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  type?: "index" | "stock";
}

export type ChangeType = "d" | "w" | "m" | "y" | "3m" | "6m" | "5y";
