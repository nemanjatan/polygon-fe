export type MarketStatusResponse = {
  as_of: string;
  market_status: 'Open' | 'Closed' | string;
  market_session: 'Pre-Market' | 'Regular Market' | 'After-Hours' | string;
  timezone: string; // e.g. America/New_York
};

export type TimeGridResponse = {
  end_aligned: string;
  timestamps: string[];
};

export type IndicatorSpec = {
  name: string;
  indicator: 'ema' | 'rsi' | 'macd' | string;
  params: Record<string, number>;
};

export type ExportRequest = {
  symbol: string;
  as_of: string; // New York local datetime string (or ISO)
  api_key?: string | null;
  config: {
    max_candles_limit?: number;
    config: Record<string, IndicatorSpec[]>; // timeframe -> indicators
  };
};

export type ExportFrameRow = {
  timestamp: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number;
  // dynamic indicator keys possible
  [key: string]: string | number | null;
};

export type ExportResponse = {
  version: string;
  as_of_utc: string;
  as_of_edt: string;
  source: string;
  ticker: string;
  market_status: string;
  market_session: string;
  timezone: string;
  frames: Record<string, ExportFrameRow[]>; // timeframe -> rows
};

