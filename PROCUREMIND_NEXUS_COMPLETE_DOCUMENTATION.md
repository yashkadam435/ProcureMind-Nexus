# ProcureMind Nexus — Complete Project Documentation

> **Purpose**: This document captures every architectural decision, implementation detail, process flow, and code structure of the ProcureMind Nexus platform. Use it as a comprehensive context file for AI-assisted development.

---

## 1. Project Overview

**ProcureMind Nexus** is an autonomous multi-agent procurement intelligence network built for the **AI Agent Olympics Hackathon — Milan AI Week 2026**. It orchestrates 5 specialized AI agents powered by Google Gemini to handle the full procurement lifecycle — from supplier discovery to payment settlement — with full EU AI Act compliance and human-in-the-loop governance.

### Core Value Proposition
- Every procurement decision is orchestrated by autonomous AI agents that reason together, learn from outcomes, and settle transactions on-chain
- Full governance visibility and human control at every step
- EU AI Act compliant with hash-chained immutable audit trails

### Target Metrics

| Metric | Manual Baseline | ProcureMind Target |
|---|---|---|
| RFx Cycle Time | 14-21 days | 2-3 days |
| Invoice Exceptions | 15-25% | <2% |
| Maverick Spend | 5-12% | <1% |
| Human Approval Required | 100% | 5-10% (strategic only) |

---

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Backend** | Python 3.11, FastAPI | 16+ REST endpoints, async, uvicorn with hot-reload |
| **AI Engine** | Google Gemini 2.5 Flash/Pro | `google-genai` SDK, structured JSON output, multimodal PDF analysis, extended thinking |
| **Database** | SQLite | WAL mode, foreign keys, 8 tables, hash-chained audit trail |
| **Frontend** | HTML5, CSS3, Vanilla JS | SPA with hash-based routing, glassmorphism dark-mode design, Lucide Icons |
| **Typography** | Inter (Google Fonts) | Weights 300-900 |
| **Payments** | x402 Protocol | USDC on Base L2, agent-to-agent micropayments |
| **Voice** | Speechmatics / Web Speech API | Real-time transcription with Gemini NLU parsing |
| **Treasury** | Kraken xStocks | Paper trading portfolio (SPYx, QQQx, EURx) |
| **Deployment** | Docker, Vultr Cloud VM | Single-container, docker-compose |
| **Config** | Pydantic Settings | Validated env vars from `.env` file |

### Python Dependencies (requirements.txt)
```
fastapi, uvicorn[standard], pydantic, pydantic-settings, python-multipart,
python-dotenv, aiofiles, httpx, google-genai, tenacity
```

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PROCUREMIND NEXUS                   │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Scout   │ │ Analyst  │ │Negotiator│ │Compli- │ │
│  │  Agent   │ │  Agent   │ │  Agent   │ │ance    │ │
│  │(Flash)   │ │ (Pro)    │ │  (Pro)   │ │Guardian│ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       └─────────────┴────────────┴───────────┘      │
│                      │                               │
│              ┌───────┴───────┐                       │
│              │   Payment     │                       │
│              │   Executor    │                       │
│              │ (Flash+x402)  │                       │
│              └───────────────┘                       │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ FastAPI  │ │ SQLite   │ │  Premium Frontend    │ │
│  │ Backend  │ │ + Audit  │ │  (5 pages, SSE)      │ │
│  └──────────┘ └──────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │              │              │
    ┌────┴────┐   ┌─────┴─────┐  ┌────┴────┐
    │ Gemini  │   │  x402 /   │  │Speechma-│
    │  API    │   │  Base L2  │  │tics API │
    └─────────┘   └───────────┘  └─────────┘
```

### Request Flow
1. **Browser** → `http://localhost:8000` → FastAPI serves `frontend/index.html`
2. **Static assets** mounted at `/static` → maps to `frontend/` directory
3. **API calls** from frontend JS → `/api/*` endpoints
4. **SSE stream** at `/api/stream` → real-time agent status updates every 2 seconds

---

## 4. Project Structure (Every File)

```
procuremind-nexus/
├── .env                          # Active config (GEMINI_API_KEY only)
├── .env.example                  # Template with all env vars documented
├── .gitignore                    # Standard Python/Node ignores
├── docker-compose.yml            # Single-service Docker setup
├── README.md                     # Project overview
├── Agentic_AI_Project_BRD_and_Prompts.md  # Original BRD
│
├── backend/
│   ├── main.py                   # FastAPI app — 431 lines, 16+ routes, lifespan management
│   ├── config.py                 # Pydantic Settings — 52 lines, validates all env vars
│   ├── database.py               # SQLite layer — 257 lines, 8 tables, hash-chained audit
│   ├── orchestrator.py           # Workflow engine — 338 lines, 7-step pipeline
│   ├── requirements.txt          # 10 Python dependencies
│   ├── Dockerfile                # Python 3.11-slim, health check
│   ├── procuremind.db            # SQLite database (auto-created)
│   │
│   ├── agents/
│   │   ├── __init__.py           # Package marker
│   │   ├── gemini_client.py      # Core LLM client — 193 lines, 5 methods
│   │   ├── scout.py              # Supplier discovery — 99 lines
│   │   ├── analyst.py            # Contract/doc analysis — 82 lines
│   │   ├── negotiator.py         # RFQ/deal optimization — 62 lines
│   │   ├── compliance.py         # EU AI Act governance — 93 lines
│   │   └── payment.py            # Settlement & treasury — 73 lines
│   │
│   └── services/
│       ├── __init__.py           # Package marker
│       ├── x402_client.py        # x402 micropayments — 179 lines
│       ├── speechmatics_client.py # Voice transcription — 108 lines
│       └── kraken_client.py      # xStocks treasury — 142 lines
│
└── frontend/
    ├── index.html                # SPA entry — 109 lines, sidebar + topbar + page-content
    ├── package-lock.json         # Minimal (no npm dependencies used)
    ├── css/
    │   └── styles.css            # Design system — 424 lines, glassmorphism dark theme
    └── js/
        ├── api.js                # API client + SSE + toast — 48 lines
        ├── router.js             # Hash-based SPA router — 24 lines
        ├── app.js                # Main init + health check + keyboard shortcuts — 86 lines
        └── pages/
            ├── dashboard.js      # Command Center — 199 lines
            ├── procure.js        # Procurement workflow — 387 lines
            ├── contracts.js      # Contract analysis — 291 lines
            ├── treasury.js       # Treasury & finance — 184 lines
            └── settings.js       # Settings & governance — 302 lines
```

---

## 5. Database Schema (8 Tables)

### 5.1 workflows
```sql
CREATE TABLE workflows (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','running','paused','completed','failed')),
    request_text TEXT NOT NULL,
    total_budget REAL DEFAULT 0,
    spent REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    result_data TEXT DEFAULT '{}',
    audit_log TEXT DEFAULT '[]'
);
```

### 5.2 agent_runs
Tracks every individual agent execution with reasoning traces and confidence scores.
```sql
CREATE TABLE agent_runs (
    id TEXT PRIMARY KEY,
    workflow_id TEXT REFERENCES workflows(id),
    agent_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    input_summary TEXT,
    reasoning_trace TEXT,
    output_data TEXT DEFAULT '{}',
    confidence_score REAL DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    execution_time_ms INTEGER DEFAULT 0,
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    error_message TEXT
);
```

### 5.3 suppliers (Pre-seeded with 6 European suppliers)
```sql
CREATE TABLE suppliers (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, location TEXT,
    capability_score INTEGER DEFAULT 50, risk_rating INTEGER DEFAULT 50,
    avg_delivery_days INTEGER DEFAULT 14, contact_email TEXT, website TEXT,
    certifications TEXT DEFAULT '[]', past_performance TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now'))
);
```
**Seed data**: Precision Parts GmbH (Stuttgart), Milano Meccanica (Milan), TechForge Industries (Lyon), Nordic Components AB (Stockholm), Iberian Steel Works (Barcelona), Dutch Precision BV (Eindhoven)

### 5.4 contracts
```sql
CREATE TABLE contracts (
    id TEXT PRIMARY KEY, workflow_id TEXT, supplier_id TEXT, filename TEXT,
    file_size INTEGER, analysis_data TEXT DEFAULT '{}', risk_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', created_at TEXT, analyzed_at TEXT
);
```

### 5.5 transactions
```sql
CREATE TABLE transactions (
    id TEXT PRIMARY KEY, workflow_id TEXT, amount REAL, currency TEXT DEFAULT 'EUR',
    recipient TEXT, tx_type TEXT DEFAULT 'payment',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','failed','cancelled')),
    purpose TEXT, created_at TEXT
);
```

### 5.6 audit_trail (Hash-chained, immutable)
```sql
CREATE TABLE audit_trail (
    id TEXT PRIMARY KEY, previous_hash TEXT, agent_name TEXT, action TEXT,
    details TEXT DEFAULT '{}', entry_hash TEXT, created_at TEXT
);
```
**Hash chain**: Each entry's `entry_hash` = SHA-256(`previous_hash:agent_name:action:details_json`). First entry uses `"GENESIS"` as previous hash.

### 5.7 approvals
```sql
CREATE TABLE approvals (
    id TEXT PRIMARY KEY, workflow_id TEXT REFERENCES workflows(id),
    agent_name TEXT, amount REAL, category TEXT, reason TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','denied')),
    decided_by TEXT, decided_at TEXT, created_at TEXT
);
```

### 5.8 settings (Key-value store with defaults)
```sql
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT);
```
**Defaults**: auto_approve_threshold=10000, monthly_budget=500000, enable_autonomous_negotiation=true, enable_treasury_rebalance=true, currency=EUR, high_risk_categories=["IT_services","consulting","legal"]

### Database Indexes
```sql
CREATE INDEX idx_agent_runs_workflow ON agent_runs(workflow_id);
CREATE INDEX idx_transactions_workflow ON transactions(workflow_id);
CREATE INDEX idx_audit_trail_created ON audit_trail(created_at);
CREATE INDEX idx_approvals_status ON approvals(status);
```

---

## 6. AI Agent System (5 Agents)

### 6.1 GeminiClient (`agents/gemini_client.py` — 193 lines)
Central LLM client shared by all agents. Uses `google-genai` SDK.

**Key methods**:
- `generate(prompt, model_type, retries=3)` → Structured JSON with retry, markdown fence stripping
- `generate_with_reasoning(prompt)` → Extended thinking with `ThinkingConfig(thinking_budget=4096)`, extracts reasoning trace from thought parts
- `generate_text(prompt)` → Plain text output
- `analyze_document(prompt, file_bytes, mime_type)` → Multimodal PDF/image analysis using `Part.from_bytes()`
- `get_usage_stats()` → Token/call counters

**Models**: Both `model_flash` and `model_pro` are currently set to `"gemini-2.5-flash"` (cost optimization).

**JSON output**: All structured calls use `response_mime_type="application/json"`.

### 6.2 Scout Agent (`agents/scout.py` — 99 lines)
- **Model**: Gemini Flash
- **Role**: Supplier discovery and market intelligence
- **Flow**: Queries SQLite suppliers DB (LIKE match on category/name) → feeds results + request to Gemini → returns ranked suppliers with fit_score, price_estimate, recommendation
- **Output**: List of suppliers with capability_score, risk_rating, price estimates, certifications

### 6.3 Analyst Agent (`agents/analyst.py` — 82 lines)
- **Model**: Gemini Pro
- **Role**: Contract PDF analysis, risk scoring, document processing
- **Methods**:
  - `analyze_contract(file_bytes, filename, mime_type)` → Multimodal PDF analysis → extracts parties, payment terms, delivery terms, liability, termination conditions, risk factors, overall_risk_score (0-100), recommendations
  - `analyze_text(text, analysis_type)` → Text-based market/supplier analysis

### 6.4 Negotiator Agent (`agents/negotiator.py` — 62 lines)
- **Model**: Gemini Pro
- **Role**: RFQ drafting, counter-offer generation, deal optimization
- **Output**: Strategy description, full RFQ email draft (subject + body), per-supplier analysis with leverage points and counter-offers, recommended supplier with final price and estimated savings

### 6.5 Compliance Guardian (`agents/compliance.py` — 93 lines)
- **Model**: Gemini Flash (for speed on policy checks)
- **Role**: EU AI Act compliance, policy enforcement, authorization gating
- **Policy rules** (hardcoded + dynamic from settings):
  - Auto-approve threshold: €10,000 (configurable via settings)
  - High-risk categories: IT_services, consulting, legal
  - Spend thresholds: operational €50K/month, capital €100K/quarter
- **Flow**: Rule-based check → AI risk assessment (Gemini) → if risk_score > 70 OR amount > threshold OR high-risk category → `requires_human_approval = true`
- **Also provides**: `get_compliance_status()` with EU AI Act article-by-article compliance report

### 6.6 Payment Executor (`agents/payment.py` — 73 lines)
- **Model**: Gemini Flash
- **Role**: Transaction recording, budget tracking
- **Flow**: Creates transaction record → updates workflow spent amount → audit trail entry
- **Budget status**: Reads monthly_budget from settings, calculates spent/remaining/utilization

### Agent State Management
Every agent has `status` ("idle"/"active"/"error") and `current_task` (string) fields, updated in real-time and streamed via SSE.

---

## 7. Workflow Orchestrator (`orchestrator.py` — 338 lines)

### 7-Step Sequential Pipeline

```
Step 1: PARSE      → Gemini Flash parses NL text into structured request
Step 2: COMPLY     → Compliance Guardian checks authorization
Step 3: SCOUT      → Scout Agent discovers suppliers
Step 4: ANALYZE    → Analyst Agent evaluates suppliers
Step 5: NEGOTIATE  → Negotiator drafts RFQ + strategy
Step 6: PAYMENT    → Payment Executor processes settlement (if auto-approved)
Step 7: AUDIT      → Final audit trail entry
```

### Human-in-the-Loop Gate
- If compliance step flags `requires_human_approval = true`:
  - Creates approval record in `approvals` table
  - Workflow status set to `"paused"`
  - Payment step is **skipped**
  - Frontend shows Approve/Deny buttons
  - On approval → workflow status updated to `"completed"` or `"failed"`

### Agent Run Tracking
Every agent step is logged to `agent_runs` table with:
- `input_summary`: What the agent received
- `reasoning_trace`: Why the agent made its decision
- `confidence_score`: 0.0-1.0
- `execution_time_ms`: Performance tracking
- `output_data`: Full JSON result (truncated if >50KB)

---

## 8. API Endpoints (16+ Routes)

| Method | Path | Handler | Description |
|---|---|---|---|
| GET | `/` | `root()` | Serves frontend/index.html |
| GET | `/api/health` | `health()` | System health + Gemini status + token usage |
| GET | `/api/agents/status` | `agent_status()` | All 5 agent statuses (idle/active/error) |
| GET | `/api/agents/runs` | `list_agent_runs()` | Agent run history with reasoning traces |
| GET | `/api/agents/runs/{id}` | `get_agent_run()` | Single agent run detail |
| POST | `/api/procure` | `initiate_procurement()` | **Main entry** — triggers 7-step pipeline |
| GET | `/api/procure/{id}` | `get_workflow()` | Workflow detail with agent runs |
| GET | `/api/workflows` | `list_workflows()` | All workflows list |
| POST | `/api/contracts/analyze` | `analyze_contract()` | Upload PDF → multimodal Gemini analysis |
| GET | `/api/contracts` | `list_contracts()` | Contract history |
| GET | `/api/suppliers` | `list_suppliers()` | Supplier database |
| GET | `/api/suppliers/search?q=` | `search_suppliers()` | Search by name/category/location |
| GET | `/api/approvals` | `list_approvals()` | Pending + resolved approvals |
| POST | `/api/approvals/{id}` | `decide_approval()` | Approve or deny |
| GET | `/api/transactions` | `list_transactions()` | Transaction history |
| GET | `/api/treasury/budget` | `budget_status()` | Budget utilization |
| GET | `/api/treasury/portfolio` | `treasury_portfolio()` | xStocks positions |
| GET | `/api/treasury/history/{symbol}` | `price_history()` | Hourly candle data |
| GET | `/api/treasury/analytics` | `spend_analytics()` | Category breakdown |
| GET | `/api/compliance/status` | `compliance_status()` | EU AI Act article compliance |
| GET | `/api/compliance/audit` | `audit_trail()` | Hash-chained audit entries |
| GET/POST | `/api/settings` | Settings CRUD | Key-value config |
| GET | `/api/stream` | `event_stream()` | SSE — agent status every 2s |
| GET | `/api/analytics/dashboard` | `dashboard_analytics()` | Aggregated KPIs |
| POST | `/api/x402/pay` | `x402_payment()` | x402 micropayment |
| GET | `/api/x402/stats` | `x402_stats()` | Payment protocol stats |
| GET | `/api/voice/config` | `voice_config()` | Speechmatics config |
| POST | `/api/voice/process` | `process_voice()` | Voice → structured request |
| GET | `/api/integrations` | `integration_status()` | All external service statuses |

---

## 9. External Integration Services

### 9.1 x402 Payment Protocol (`services/x402_client.py` — 179 lines)
- **Live mode**: When `X402_WALLET_PRIVATE_KEY` is set
  - Sends GET to supplier endpoint → expects HTTP 402
  - Reads `X-Payment-Address` and `X-Payment-Amount` headers
  - Signs USDC transfer on Base L2
  - Re-sends request with `X-Payment-Proof` header
- **Simulation mode** (current): Generates deterministic tx hashes, simulated block numbers and credit reports
- **Tracks**: total_spent_usdc, tx_count
- **Records**: Every payment in `transactions` table + audit trail

### 9.2 Speechmatics Voice (`services/speechmatics_client.py` — 108 lines)
- **Live mode**: When `SPEECHMATICS_API_KEY` is set → WebSocket to `wss://eu2.rt.speechmatics.com/v2`
- **Browser fallback** (current): Returns flag telling frontend to use Web Speech API
- **Voice processing flow**: Browser captures audio → transcription text → POST `/api/voice/process` → Gemini Flash parses into structured procurement request (item, quantity, budget, category, priority)

### 9.3 Kraken xStocks Treasury (`services/kraken_client.py` — 142 lines)
- **Live mode**: When `KRAKEN_API_KEY` + `KRAKEN_API_SECRET` are set
- **Simulation mode** (current): Realistic price movements using sine waves + noise
- **Portfolio**: SPYx (S&P 500), QQQx (Nasdaq 100), EURx (Euro Stoxx 50) + €245,000 cash
- **Features**: `get_portfolio()` with live P&L, `get_price_history()` for charting, `get_spend_analytics()` with category breakdown

---

## 10. Frontend Architecture

### 10.1 SPA Router (`router.js`)
- Hash-based routing: `/#dashboard`, `/#procure`, `/#contracts`, `/#treasury`, `/#settings`
- `registerPage(name, renderFn)` — each page registers an async render function
- `navigateTo(page)` — updates sidebar active state, page title/subtitle, triggers render
- Keyboard shortcuts: Press 1-5 to navigate pages

### 10.2 API Client (`api.js`)
- `api.get(path)`, `api.post(path, data)`, `api.upload(path, file)` — wraps fetch with error handling
- `connectSSE(onMessage)` — EventSource to `/api/stream`, auto-reconnect on error (5s delay)
- `showToast(msg, type)` — Success/error/info notifications with Lucide icons, auto-dismiss 4s

### 10.3 Main App (`app.js`)
- Health check on load + every 30s → updates "Gemini Connected" status badge
- SSE connection for real-time agent status
- Overrides `navigateTo` to add page transitions and topbar metadata
- Mobile sidebar toggle support

### 10.4 Pages

**Dashboard (Command Center)**:
- 4 KPI cards (workflows, suppliers, spend, approvals) with animated slide-up
- 5 agent status cards with color-coded icons and live status dots
- Pending approvals list with Approve/Deny buttons
- Recent transactions table
- Recent workflows table
- Skeleton loading states

**Procurement**:
- Natural language textarea with voice input button
- Budget input + category selector (7 categories)
- 4 quick-fill preset buttons (CNC Brackets, Steel Bolts, IT Audit, Packaging)
- 7-step workflow progress visualization with animated connectors
- Results panels: Parsed request tiles, supplier table, compliance status, negotiation strategy with recommended supplier and RFQ draft (accordion)
- Workflow history table

**Contracts**:
- Drag-and-drop PDF upload area with progress bar
- SVG risk gauge (0-100) with gradient arc animation
- Executive summary + buyer/supplier parties
- Risk factors list with severity badges
- Key clauses in accordion format
- Payment terms, delivery terms, termination conditions cards
- AI recommendations numbered list
- Contract history table

**Treasury**:
- 4 KPI cards (budget, spent, remaining, portfolio P&L)
- SVG budget utilization gauge
- xStocks portfolio with per-position P&L (paper trading badge)
- Spend breakdown with SVG donut charts per category
- Transaction history table

**Settings** (5 tabs):
- **Spending Policy**: Approval threshold slider (€1K-100K), monthly budget input, high-risk category toggles
- **Agent Controls**: Toggle switches for autonomous negotiation, treasury auto-invest, voice queries, x402 payments; circuit breaker status display
- **EU AI Act**: Compliance score ring (98%), audit entry counts, article-by-article compliance table (Art. 13, 14, 15, 26, 10)
- **Audit Trail**: Hash-chained log table with export to JSON/CSV
- **Suppliers**: Full supplier database table with scores, risk, delivery, certifications

### 10.5 CSS Design System (`styles.css` — 424 lines)
- **Theme**: Premium dark mode with glassmorphism
- **Colors**: bg-primary #0a0e1a, accent #6366f1 (indigo), success/warning/danger/info
- **Effects**: Animated background mesh, card hover glow, logo pulse, skeleton shimmer, step pulse
- **Components**: Cards, stat-cards, agent-cards, buttons (5 variants), inputs, tables, badges (5 colors), progress bars, modals, upload areas, workflow steps, tabs, toggles, accordions, toasts
- **Responsive**: 3 breakpoints (1200px, 900px, 600px), mobile sidebar overlay

---

## 11. Configuration System

### Environment Variables (.env.example)
```
GEMINI_API_KEY=            # REQUIRED — Google AI API key
GEMINI_MODEL_PRO=gemini-2.5-pro-preview-05-06
GEMINI_MODEL_FLASH=gemini-2.5-flash-preview-05-20
COINBASE_API_KEY=          # Optional — x402 live payments
X402_WALLET_PRIVATE_KEY=   # Optional — Base L2 wallet
X402_FACILITATOR_URL=https://facilitator.x402.org
BASE_RPC_URL=https://mainnet.base.org
SPEECHMATICS_API_KEY=      # Optional — voice transcription
SPEECHMATICS_WS_URL=wss://eu2.rt.speechmatics.com/v2
KRAKEN_API_KEY=            # Optional — live portfolio
KRAKEN_API_SECRET=
APP_ENV=development
LOG_LEVEL=INFO
HUMAN_APPROVAL_THRESHOLD_EUR=10000
```

### Config Validation (`config.py`)
Uses Pydantic `BaseSettings` with `@lru_cache()` singleton. All optional fields default to empty strings. Loads from `.env` file in project root.

---

## 12. Deployment

### Docker
```dockerfile
FROM python:3.11-slim
# Installs gcc, pip dependencies, creates /app/data for SQLite
# Health check: python urllib to /api/health
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose
```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: [.env]
    volumes: [./backend:/app, ./frontend:/app/frontend, backend_data:/app/data]
    restart: unless-stopped
```

### Local Development
```bash
cp .env.example .env   # Add GEMINI_API_KEY
pip install -r backend/requirements.txt
cd backend && python main.py
# Open http://localhost:8000
```

---

## 13. EU AI Act Compliance Implementation

| Article | Requirement | Implementation |
|---|---|---|
| Art. 14 | Human oversight | Human approval gate for all transactions >€10K (configurable) |
| Art. 13 | Transparency | Reasoning trace logged in `agent_runs` for every agent decision |
| Art. 26 | Audit logging | SHA-256 hash-chained `audit_trail` table (append-only, GENESIS root) |
| Art. 10 | Data governance | No personal data in training; all data stays in local SQLite |
| Art. 15 | Robustness | Confidence scores (0-1.0) on all outputs; fallback to human on uncertainty |

---

## 14. Current State & Known Limitations

### What is FULLY working:
- FastAPI backend with all 16+ routes
- All 5 AI agents with Gemini integration
- 7-step orchestrated procurement workflow (end-to-end)
- Contract PDF upload and multimodal analysis
- SQLite database with all 8 tables and seed data
- Hash-chained audit trail
- Human-in-the-loop approval system
- Complete 5-page frontend SPA
- SSE real-time agent status streaming
- Voice input (browser Web Speech API fallback)
- Simulated x402 payments, Kraken portfolio, Speechmatics

### What uses simulation/fallback:
- x402 payments (simulated — no real USDC transfers, needs `X402_WALLET_PRIVATE_KEY`)
- Kraken xStocks (simulated price movements — needs `KRAKEN_API_KEY`)
- Speechmatics (falls back to browser Web Speech API — needs `SPEECHMATICS_API_KEY`)
- Both Gemini models currently use `gemini-2.5-flash` (Pro model also points to Flash for cost savings)

### Known issues:
- `docker-compose up` fails if Docker Desktop is not running
- No `package.json` in frontend (pure vanilla JS, no npm needed)
- No authentication/authorization on API endpoints
- No WebSocket implementation for Speechmatics (only REST fallback)
- No real blockchain transaction signing (placeholder hash generation)

---

## 15. Key Design Decisions

1. **Single-process architecture**: FastAPI serves both API and static frontend — no separate frontend server needed
2. **Vanilla JS SPA**: No React/Vue/Angular — reduces complexity, zero build step, instant page loads
3. **SQLite over PostgreSQL**: Zero-config, single-file database, perfect for hackathon/demo
4. **Hash-chained audit**: Simulates blockchain-style immutability without actual blockchain overhead
5. **Graceful degradation**: Every external service (x402, Speechmatics, Kraken) falls back to simulation mode when API keys are missing
6. **Structured JSON output**: All Gemini calls use `response_mime_type="application/json"` to guarantee parseable responses
7. **Agent status via SSE**: Lightweight real-time updates without WebSocket complexity
