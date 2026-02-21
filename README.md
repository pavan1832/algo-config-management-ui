# AlgoConfig UI – Algorithm Configuration & Rule Builder

A **frontend-heavy internal tool** for quantitative and algorithmic trading firms. Engineers and traders use this app to configure, validate, and persist algorithm rules **before** algorithms run — enabling downstream execution systems to consume well-structured, validated configurations.

---

## Business Use Case

Algorithmic trading systems require deterministic, validated inputs before they can execute trades. AlgoConfig UI serves as the **pre-trade configuration layer**, where:

- **Traders** define which instruments (NIFTY, SP500, etc.) and timeframes (1m, 5m…) to operate on
- **Quants** set signal thresholds — entry/exit levels that trigger positions
- **Risk managers** enforce per-algorithm loss limits and execution caps
- **Engineers** enable or disable specific algorithm configs without code deployments

Configurations are persisted as structured JSON and can be fetched by downstream execution engines via REST.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (functional components) |
| State Management | Redux Toolkit (slices + async thunks) |
| HTTP Client | Axios |
| Styling | Custom CSS (design tokens, dark theme) |
| Testing | Jest + React Testing Library |
| Backend | Node.js + Express |
| Persistence | JSON file (no database required) |
| Deployment | Frontend → Netlify · Backend → Render |

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                  React App                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Pages   │  │Components│  │  Services │  │
│  │ HomePage │  │ConfigForm│  │configSvc  │  │
│  │          │  │ConfigTable│ │ (Axios)   │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │              │              │        │
│  ┌────▼──────────────▼──────────────▼─────┐  │
│  │           Redux Toolkit Store          │  │
│  │  algoConfigSlice │ uiSlice            │  │
│  └─────────────────────────────────────┬──┘  │
└────────────────────────────────────────│──────┘
                                         │ HTTP REST
                         ┌───────────────▼───────────────┐
                         │     Express Backend            │
                         │  routes/configs.js             │
                         │  controllers/configController  │
                         │  data/configs.json (persist)   │
                         └───────────────────────────────┘
```

**Key design decisions:**
- Redux `algoConfigSlice` owns all config list state; `uiSlice` owns transient UI state (modals, toasts)
- All API calls go through async thunks — UI never calls `configService` directly
- Client-side validation runs synchronously before any API call; server validates independently
- JSON file persistence makes the backend stateless-friendly for Render's free tier

---

## Folder Structure

```
algoconfig-ui/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js         # App header with API status indicator
│   │   │   ├── ConfigForm.js     # Create/Edit form with validation
│   │   │   ├── ConfigModal.js    # Modal wrapper for ConfigForm
│   │   │   ├── ConfigTable.js    # Tabular config list with edit actions
│   │   │   ├── StatsBar.js       # Summary stats (total, enabled, instruments)
│   │   │   └── Toast.js          # Auto-dismissing notifications
│   │   ├── pages/
│   │   │   └── HomePage.js       # Main page composing all components
│   │   ├── redux/
│   │   │   ├── store.js          # Redux store configuration
│   │   │   ├── algoConfigSlice.js # Config CRUD + async thunks
│   │   │   └── uiSlice.js        # Modal, toast, tab state
│   │   ├── services/
│   │   │   └── configService.js  # Axios API wrapper
│   │   ├── tests/
│   │   │   ├── algoConfigSlice.test.js
│   │   │   ├── formValidation.test.js
│   │   │   └── uiSlice.test.js
│   │   ├── App.js
│   │   └── index.css             # Design tokens + component styles
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── configs.js            # Express router for /configs
│   ├── controllers/
│   │   └── configController.js   # Business logic + validation
│   ├── data/
│   │   └── configs.json          # JSON persistence store
│   ├── app.js                    # Express entry point
│   └── package.json
└── README.md
```

---

## API Documentation

Base URL: `http://localhost:4000`

### `GET /configs`
Returns all saved configurations.

**Response 200:**
```json
{
  "data": [ { "id": "uuid", "name": "NIFTY Momentum", ... } ],
  "count": 1
}
```

---

### `GET /configs/:id`
Returns a single configuration by ID.

**Response 200:**
```json
{ "data": { "id": "...", "name": "NIFTY Momentum", ... } }
```

**Response 404:**
```json
{ "error": "Config not found." }
```

---

### `POST /configs`
Creates a new configuration. All fields required.

**Request Body:**
```json
{
  "name": "NIFTY Momentum v2",
  "instrument": "NIFTY",
  "timeframe": "5m",
  "entryThreshold": 0.85,
  "exitThreshold": 0.40,
  "maxLossPct": 2.5,
  "maxTradesPerDay": 10,
  "enabled": true
}
```

**Response 201:** Created config object  
**Response 422:** Validation errors map

---

### `PUT /configs/:id`
Updates an existing configuration. Same body schema as POST.

**Response 200:** Updated config object  
**Response 404:** Config not found  
**Response 422:** Validation errors map

---

### `GET /health`
Health check endpoint.

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Clone / Download the project

```bash
git clone <repo-url>
cd algoconfig-ui
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
# API running on http://localhost:4000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
# App running on http://localhost:3000
```

> The frontend uses a `"proxy": "http://localhost:4000"` in `package.json`, so API calls work without CORS config during local development.

### 4. Run Tests

```bash
cd frontend
npm test
```

---

## Deployment

### Frontend → Netlify
1. Build: `cd frontend && npm run build`
2. Deploy the `build/` folder to Netlify
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com`

### Backend → Render
1. Create a new **Web Service** pointing to the `backend/` folder
2. Build command: `npm install`
3. Start command: `node app.js`
4. Note: Render free tier has ephemeral disk — config data will reset on restart. For persistence, swap `configs.json` with a free-tier database like PlanetScale or Supabase.

---

## Design Decisions

- **No authentication**: Intentional — this is an internal tool behind a VPN/intranet
- **No WebSockets**: Data is pre-trade, not real-time; polling or manual refresh is sufficient
- **File persistence**: Eliminates database setup complexity for rapid deployment; trivially swappable
- **Redux for all async state**: Keeps components pure and testable; API errors surface as Redux state
- **Dual validation**: Client-side for UX speed; server-side for correctness guarantee

---

*Built for internal quant/algo trading operations. Not intended for production market connectivity.*
