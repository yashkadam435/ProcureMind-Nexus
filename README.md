# ProcureMind Nexus

[![Deployed on Vultr](https://img.shields.io/badge/Deployed%20on-Vultr-0069ff)](https://www.vultr.com/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Pro-4285f4)](https://ai.google.dev/)
[![Payments x402](https://img.shields.io/badge/Payments-x402%20Protocol-0052ff)](https://www.x402.org/)
[![EU AI Act](https://img.shields.io/badge/Compliant-EU%20AI%20Act-10b981)](https://artificialintelligenceact.eu/)

## Autonomous Multi-Agent Procurement Intelligence Network

> *Every procurement decision — from supplier discovery to final payment — orchestrated by autonomous AI agents that reason together, learn from outcomes, and settle transactions on-chain — with full governance visibility and human control.*

### 🏗️ Architecture

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

### 🤖 Agent System

| Agent | Model | Role |
|-------|-------|------|
| **Scout** | Gemini 2.5 Flash | Supplier discovery, market intelligence, web search |
| **Analyst** | Gemini 2.5 Pro | Contract PDF analysis, risk scoring, invoice validation |
| **Negotiator** | Gemini 2.5 Pro | RFQ drafting, counter-offers, deal optimization |
| **Compliance Guardian** | Gemini 2.5 Pro | EU AI Act compliance, policy enforcement, audit trail |
| **Payment Executor** | Gemini 2.5 Flash | x402 settlement, budget tracking, treasury management |

### 🚀 Quick Start

```bash
# Clone
git clone https://github.com/yourteam/procuremind-nexus.git
cd procuremind-nexus

# Configure
cp .env.example .env
# Edit .env with your GEMINI_API_KEY

# Run
pip install -r backend/requirements.txt
cd backend && python main.py

# Open http://localhost:8000
```

### 🐳 Docker

```bash
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d
# Open http://localhost:8000
```

### 📱 Frontend Pages

| Page | Route | Features |
|------|-------|----------|
| **Command Center** | `/` | KPI dashboard, 5 agent status cards, pending approvals, transaction feed |
| **Procurement** | `/#procure` | Natural language input, workflow step visualization, supplier table, negotiation |
| **Contracts** | `/#contracts` | PDF drag-and-drop upload, risk gauge, clause analysis, recommendations |
| **Treasury** | `/#treasury` | Budget gauge, xStocks P&L, spend analytics, transaction history |
| **Settings** | `/#settings` | Policy sliders, agent controls, EU AI Act status, audit trail export |

### 🔗 API Endpoints

```
GET    /api/health                   # System health
POST   /api/procure                  # Start procurement workflow
GET    /api/procure/{id}             # Workflow status
GET    /api/workflows                # List workflows
POST   /api/contracts/analyze        # Upload & analyze PDF
GET    /api/contracts                # Contract history
GET    /api/agents/status            # All agent statuses
GET    /api/suppliers                # Supplier database
GET    /api/suppliers/search?q=      # Search suppliers
GET    /api/approvals                # Pending approvals
POST   /api/approvals/{id}          # Approve/deny
GET    /api/transactions             # Transaction history
GET    /api/treasury/budget          # Budget status
GET    /api/treasury/portfolio       # xStocks portfolio
GET    /api/compliance/status        # EU AI Act compliance
GET    /api/compliance/audit         # Audit trail
GET    /api/settings                 # App settings
POST   /api/settings                # Update setting
GET    /api/stream                   # SSE agent updates
GET    /api/analytics/dashboard      # Dashboard KPIs
```

### 💰 x402 Integration

- **Pay-per-supplier-data**: Agents pay €0.05/credit report via x402 micropayment
- **Supplier settlement**: x402 payment release on delivery confirmation
- **Agent-to-agent commerce**: POST `/x402/intelligence/quote` → 402 → payment → data

### 🏛️ EU AI Act Compliance

| Requirement | Article | Implementation |
|---|---|---|
| Human oversight | Art. 14 | Human gate for all transactions >€10K |
| Transparency | Art. 13 | Reasoning trace logged for every agent decision |
| Audit logging | Art. 26 | Append-only, SHA-256 hash-chained audit trail |
| Data governance | Art. 10 | No personal data in training |
| Robustness | Art. 15 | Confidence scores, fallback to human on uncertainty |

### 📊 Success Metrics

| Metric | Baseline (Manual) | ProcureMind Target |
|---|---|---|
| RFx Cycle Time | 14-21 days | 2-3 days |
| Invoice Exceptions | 15-25% | <2% |
| Maverick Spend | 5-12% | <1% |
| Human Approval Required | 100% | 5-10% (strategic only) |

### 🛠️ Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLite, Gemini 2.5 Pro/Flash
- **Frontend**: HTML5, CSS3 (glassmorphism), JavaScript (SPA), Lucide Icons
- **AI**: Google Gemini API (structured JSON output, multimodal PDF analysis)
- **Payments**: x402 protocol (USDC on Base L2)
- **Voice**: Speechmatics real-time transcription
- **Treasury**: Kraken xStocks paper trading (SPYx, QQQx)
- **Deploy**: Docker, Vultr Cloud VM

### 📁 Project Structure

```
procuremind-nexus/
├── backend/
│   ├── main.py              # FastAPI app (16 routes)
│   ├── database.py           # SQLite + hash-chained audit
│   ├── config.py             # Pydantic Settings
│   ├── requirements.txt
│   ├── Dockerfile
│   └── agents/
│       ├── gemini_client.py  # Gemini API with retry
│       ├── scout.py          # Supplier discovery
│       ├── analyst.py        # Contract/document analysis
│       ├── negotiator.py     # RFQ drafting & negotiation
│       ├── compliance.py     # EU AI Act governance
│       └── payment.py        # x402 settlement & treasury
├── frontend/
│   ├── index.html            # SPA entry point
│   ├── css/styles.css        # Premium dark-mode design system
│   └── js/
│       ├── api.js            # API client + SSE
│       ├── router.js         # Hash-based SPA router
│       ├── app.js            # Main application init
│       └── pages/
│           ├── dashboard.js  # Command Center
│           ├── procure.js    # Procurement workflow
│           ├── contracts.js  # Contract analysis
│           ├── treasury.js   # Treasury & finance
│           └── settings.js   # Settings & governance
├── docker-compose.yml
├── .env.example
└── README.md
```

### 👥 Team

- Built for AI Agent Olympics Hackathon — Milan AI Week 2026

### 📄 License

MIT
