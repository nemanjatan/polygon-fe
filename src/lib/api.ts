import type { ExportRequest, ExportResponse, MarketStatusResponse, TimeGridResponse } from '../types';

// Use relative paths by default; Vite dev proxy will forward to the backend.
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE ?? '';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function getMarketStatus(at?: string): Promise<MarketStatusResponse> {
  const path = `/v1/market_status${at ? `?at=${encodeURIComponent(at)}` : ''}`;
  const res = await fetch(`${API_BASE}${path}`);
  return handle<MarketStatusResponse>(res);
}

export async function getTimeGrid(params: { end?: string; timeframe?: string; count?: number } = {}): Promise<TimeGridResponse> {
  const p = new URLSearchParams();
  if (params.end) p.set('end', params.end);
  if (params.timeframe) p.set('timeframe', params.timeframe);
  if (params.count != null) p.set('count', String(params.count));
  const q = p.toString();
  const res = await fetch(`${API_BASE}/v1/time_grid${q ? `?${q}` : ''}`);
  return handle<TimeGridResponse>(res);
}

export async function postExport(body: ExportRequest): Promise<ExportResponse> {
  const res = await fetch(`${API_BASE}/v1/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return handle<ExportResponse>(res);
}

export function formatSessionLabel(status: MarketStatusResponse): string {
  return `${status.market_status} · ${status.market_session}`;
}

export function isOpen(status: MarketStatusResponse): boolean {
  return String(status.market_status).toLowerCase() === 'open';
}

