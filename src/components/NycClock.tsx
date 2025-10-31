import { useEffect, useMemo, useState } from 'react';
import { getMarketStatus, formatSessionLabel, isOpen } from '../lib/api';

function nowInNy(): Date {
  // Use Intl to render in America/New_York while keeping a Date object for display only
  return new Date();
}

function formatNy(dt: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(dt);
}

export default function NycClock() {
  const [tick, setTick] = useState(0);
  const [session, setSession] = useState<{ label: string; open: boolean } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    const nowIso = new Date().toISOString();
    getMarketStatus(nowIso).then((s) => {
      if (mounted) setSession({ label: formatSessionLabel(s), open: isOpen(s) });
    }).catch(() => {/* ignore */});
    const id = setInterval(() => {
      const iso = new Date().toISOString();
      getMarketStatus(iso).then((s) => setSession({ label: formatSessionLabel(s), open: isOpen(s) })).catch(() => {/* ignore */});
    }, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const nyString = useMemo(() => formatNy(nowInNy()), [tick]);

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="subtle">New York Time (America/New_York)</div>
          <div className="mono" style={{ fontSize: 18 }}>{nyString}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="subtle">Market</div>
          <div className={session?.open ? 'status-open' : 'status-closed'}>{session?.label ?? '—'}</div>
        </div>
      </div>
    </div>
  );
}

