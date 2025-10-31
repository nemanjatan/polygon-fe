# Polygon Export FE

Small React + Vite frontend for your Polygon Export API. It shows live New York time and market session, lets you submit an export request, and displays the aligned frames including indicators.

## Prerequisites

- Node.js 18+
- Backend running locally per your guide:
  - `uvicorn api:create_app --host 0.0.0.0 --port 8000 --reload`

## Configure

- By default the FE calls `http://localhost:8000`.
- To point elsewhere, create `.env` and set:

```
VITE_API_BASE=http://localhost:8000
```

## Run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Features

- Live NYC time and market status via `GET /v1/market_status`
- Export form for symbol, as_of, timeframe, and indicators
- Results table for the first timeframe returned (e.g., `1m`)

## Notes

- CORS: if serving FE on a different origin, enable CORS in your backend (`api.py`).
- The form defaults to TSLA and a current NY timestamp; adjust as needed.

