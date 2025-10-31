import { useMemo, useState } from 'react';
import type { ExportRequest, IndicatorSpec } from '../types';

function defaultAsOfNy(): string {
  // default to current NY time as a readable string with offset hint
  // Example: 2025-10-30 20:00:00 -0400
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const parts = fmt.formatToParts(now).reduce<Record<string,string>>((acc, p) => { if (p.type !== 'literal') acc[p.type] = p.value; return acc; }, {});
  // naive EDT/EST placeholder note: backend accepts ISO or explicit offset; users can change this
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

type Props = {
  onSubmit: (req: ExportRequest) => void;
  busy?: boolean;
};

export default function ExportForm({ onSubmit, busy }: Props) {
  const [symbol, setSymbol] = useState('TSLA');
  const [asOf, setAsOf] = useState(defaultAsOfNy());
  const [maxCandles, setMaxCandles] = useState(200);
  const [timeframe, setTimeframe] = useState('1m');
  const [ema, setEma] = useState(10);
  const [rsi, setRsi] = useState(14);
  const [useMacd, setUseMacd] = useState(true);

  const indicators = useMemo<IndicatorSpec[]>(() => {
    const list: IndicatorSpec[] = [];
    if (ema > 0) list.push({ name: `ema${ema}`, indicator: 'ema', params: { window_size: ema } });
    if (rsi > 0) list.push({ name: `rsi${rsi}`, indicator: 'rsi', params: { window_size: rsi } });
    if (useMacd) list.push({ name: 'macd', indicator: 'macd', params: { short_window_size: 12, long_window_size: 26, signal_window_size: 9 } });
    return list;
  }, [ema, rsi, useMacd]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const req: ExportRequest = {
      symbol,
      as_of: asOf,
      config: {
        max_candles_limit: maxCandles,
        config: { [timeframe]: indicators }
      }
    };
    onSubmit(req);
  }

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ display: 'grid', gap: 12 }}>
      <div className="grid">
        <div>
          <label>Symbol</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="TSLA or FPGL" />
        </div>
        <div>
          <label>As of (NY local or ISO)</label>
          <input value={asOf} onChange={(e) => setAsOf(e.target.value)} placeholder="2025-10-30 20:00:00 -0400" />
        </div>
      </div>

      <div className="grid">
        <div>
          <label>Timeframe</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="1d">1d</option>
          </select>
        </div>
        <div>
          <label>Max candles</label>
          <input type="number" min={10} max={2000} value={maxCandles} onChange={(e) => setMaxCandles(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid">
        <div>
          <label>EMA window</label>
          <input type="number" min={0} value={ema} onChange={(e) => setEma(Number(e.target.value))} />
        </div>
        <div>
          <label>RSI window</label>
          <input type="number" min={0} value={rsi} onChange={(e) => setRsi(Number(e.target.value))} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <label className="row" style={{ gap: 8 }}>
          <input type="checkbox" checked={useMacd} onChange={(e) => setUseMacd(e.target.checked)} /> Use MACD
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Loading…' : 'Fetch export'}</button>
      </div>
    </form>
  );
}

