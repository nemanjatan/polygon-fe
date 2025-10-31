import type { ExportResponse, ExportFrameRow } from '../types';

type Props = { data: ExportResponse | null };

function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <div className="subtle">{k}</div>
      <div className="mono">{v}</div>
    </div>
  );
}

function FrameTable({ rows }: { rows: ExportFrameRow[] }) {
  if (!rows.length) return <div className="subtle">No rows</div>;
  const sample = rows[0];
  const columns = Object.keys(sample);
  const visibleCols = columns; // keep all, including indicators
  return (
    <div style={{ overflow: 'auto' }}>
      <table>
        <thead>
          <tr>
            {visibleCols.map((c) => (<th key={c}>{c}</th>))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {visibleCols.map((c) => (
                <td key={c} className={c === 'timestamp' ? 'mono' : ''}>{String((r as any)[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ExportResult({ data }: Props) {
  if (!data) return null;
  const firstTf = Object.keys(data.frames)[0];
  const frameRows = firstTf ? data.frames[firstTf] : [];
  return (
    <div className="panel" style={{ display: 'grid', gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{data.ticker}</h2>
        <div className="subtle">{data.timezone}</div>
      </div>
      <div className="grid">
        <KeyValue k="As of (UTC)" v={data.as_of_utc} />
        <KeyValue k="As of (NY)" v={data.as_of_edt} />
        <KeyValue k="Market" v={`${data.market_status} · ${data.market_session}`} />
        <KeyValue k="Source" v={data.source} />
      </div>
      {firstTf && (
        <>
          <div className="subtle">Timeframe: {firstTf}</div>
          <FrameTable rows={frameRows} />
        </>
      )}
    </div>
  );
}

