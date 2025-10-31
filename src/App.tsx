import { useState } from 'react';
import NycClock from './components/NycClock';
import ExportForm from './components/ExportForm';
import ExportResult from './components/ExportResult';
import { postExport } from './lib/api';
import type { ExportRequest, ExportResponse } from './types';

export default function App() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExportResponse | null>(null);

  async function handleSubmit(req: ExportRequest) {
    setBusy(true);
    setError(null);
    setData(null);
    try {
      const res = await postExport(req);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Polygon Export Demo</h1>
        <div className="subtle">Simple FE over your backend</div>
      </div>

      <NycClock />

      <div className="spacer" />

      <ExportForm busy={busy} onSubmit={handleSubmit} />

      {error && (
        <div className="panel" style={{ borderColor: 'rgba(255,0,0,0.25)' }}>
          <div style={{ color: '#fca5a5' }}>{error}</div>
        </div>
      )}

      <div className="spacer" />

      <ExportResult data={data} />
    </div>
  );
}

