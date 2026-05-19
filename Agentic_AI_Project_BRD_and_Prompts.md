# Agentic AI Project: BRD & Master Prompt Architecture

## AI Agent Olympics Hackathon — Milan AI Week 2026

---

# PART 1: PROJECT SELECTION & STRATEGIC ANALYSIS

## 1.1 Selected Project: **"ProcureMind Nexus"**

### Tagline
*Autonomous Multi-Agent Procurement Intelligence Network with Agent-to-Agent x402 Commerce*

### One-Liner
An autonomous procurement intelligence network where specialized AI agents collaboratively manage enterprise sourcing, contract analysis, supplier negotiation, and governed payment execution — settled via x402 micropayments — transforming procurement from a cost center into a strategic advantage.

---

## 1.2 Why This Project? — Differentiation Matrix

| Dimension | Recent Winners (ShadowNPM, ARIA, Sendero, JudyAI) | **ProcureMind Nexus** | Gap Filled |
|---|---|---|---|
| **Domain** | Security audits, crypto trading, travel ops | **Enterprise B2B Procurement** | $1M-$5M annual waste per mid-market company |
| **x402 Use Case** | Pay-per-query, trading fees, travel booking | **Agent-to-agent procurement commerce** | First autonomous supply chain settlement via x402 |
| **Governance** | Minimal or manual | **Built-in EU AI Act compliance, audit trails, human-in-the-loop** | #1 barrier to enterprise AI adoption |
| **Multimodal** | Text/code only | **Contract PDF analysis, supplier voice calls, invoice image processing** | Rich document understanding |
| **Collaboration** | Single-agent or dual-agent | **5 specialized agents + orchestrator with shared state** | True multi-agent enterprise workflow |
| **Gemini Integration** | Basic API calls | **Deep reasoning, 1M token context for contracts, multimodal document analysis** | Maximizes partner technology |
| **Feasibility** | Complex infrastructure | **Clear 6-day MVP scope with iterative expansion** | Deliverable within hackathon |

---

## 1.3 Enterprise Problem Statement

**The $5.5 Trillion Procurement Crisis:**

Enterprise procurement teams manage thousands of suppliers, process tens of thousands of invoices monthly, and run hundreds of sourcing events per year — yet **60-70% of buyer time is spent on transactional tasks** (chasing approvals, reconciling invoices, reformatting proposals) rather than strategic negotiation [^27^].

**Quantified Pain Points:**

| Pain Point | Annual Cost (Mid-Market) | Root Cause |
|---|---|---|
| Slow RFx cycles | $500K-$2M lost savings | Manual coordination, email chaos |
| Invoice exceptions | $300K-$800K processing | Data silos, manual three-way matching |
| Maverick (off-contract) spend | 5-12% of addressable spend | Poor visibility, weak policy enforcement |
| Compliance violations | $200K-$1M per incident | No automated governance, audit gaps |
| **Total Estimated Waste** | **$1M-$5M+ annually** | **Procurement operates like it's 2005** |

**Why AI Agents, Not RPA?**
Traditional RPA handles structured, repetitive clicks. Procurement work is *messy* — supplier proposals arrive in different formats, contract redlines require judgment, stakeholder requests come through email/chat/voice. AI agents combine LLM reasoning with domain rules to read unstructured documents, reason about options, and adapt to new scenarios without reprogramming [^27^].

---

## 1.4 Hackathon Track Alignment

ProcureMind Nexus is designed to compete across **ALL FIVE TRACKS simultaneously**:

| Track | How ProcureMind Nexus Addresses It |
|---|---|
| **🧠 Intelligent Reasoning** | Contract risk analysis, supplier scoring models, negotiation strategy formulation with autonomous replanning when roadblocks encountered |
| **🔄 Agentic Workflows** | Multi-step procurement pipeline: discover → analyze → negotiate → approve → pay → audit, with external tool calling (APIs, email, x402) |
| **🌍 Enterprise Utility** | Directly solves procurement waste for Milan AI Week entrepreneurs and managers; immediate measurable ROI |
| **🧩 Multimodal Intelligence** | Processes PDF contracts, image invoices, audio supplier calls, video conferencing via Gemini's native multimodal architecture |
| **🤝 Collaborative Systems** | Five specialized agents (Scout, Analyst, Negotiator, Compliance Guardian, Payment Executor) coordinated by central orchestrator |

---

## 1.5 Partner Technology Integration Strategy

| Partner | Technology | Integration Role | Prize Category |
|---|---|---|---|
| **Google/Gemini** | Gemini 2.5 Pro API (1M context, multimodal) | Core reasoning engine, contract analysis, document processing, negotiation drafting | Best use of Gemini ($5K/$3K/$2K) |
| **Vultr** | Serverless Inference + Cloud VMs | Deploy web app, agent orchestrator backend, vector DB for RAG | Best use of Vultr ($5K/$3K/$1K + credits) |
| **Coinbase/x402** | x402 Payment Protocol (HTTP 402) | Agent-to-agent procurement payments, pay-per-supplier-data, settlement layer | Startup launch track |
| **Kraken** | Kraken CLI + xStocks (tokenized equities) | Treasury management — excess procurement budget auto-invested in xStocks ETFs | Kraken Trading Performance |
| **Speechmatics** | Real-time Speech-to-Text API | Transcribe supplier calls, extract action items, voice-based procurement queries | Speechmatics prizes ($1K/$500/credits) |
| **Featherless** | Open-source model inference (27K+ models) | Domain-specialized contract analysis model for faster/cheaper inference | Featherless prizes (credits + Claw Pro) |

---

# PART 2: BUSINESS REQUIREMENTS DOCUMENT (BRD)

---

## 2.1 Executive Summary

**Product Name:** ProcureMind Nexus
**Version:** 1.0 MVP (Hackathon Edition)
**Date:** May 2026
**Target Users:** Mid-market procurement teams (50-500 employees), entrepreneurs at Milan AI Week
**Business Objective:** Reduce procurement cycle time by 60%, eliminate 90% of invoice exceptions, and enforce 100% spend compliance — while demonstrating autonomous agent-to-agent commerce via x402 payments.

---

## 2.2 Product Vision

> *"Every procurement decision, from supplier discovery to final payment, orchestrated by autonomous AI agents that reason together, learn from outcomes, and settle transactions on-chain — with full governance visibility and human control at every critical juncture."*

---

## 2.3 User Personas

### Primary Persona: Marco — Procurement Manager
- **Role:** Procurement Manager at a 200-person manufacturing company near Milan
- **Pain:** Spends 70% of time on transactional tasks, misses savings windows due to slow RFx cycles
- **Goal:** Automate routine procurement while maintaining control over strategic decisions
- **Tech Savviness:** Moderate; uses SAP and Excel daily, skeptical of AI hype

### Secondary Persona: Elena — CFO / Finance Director
- **Role:** CFO at a growing tech startup exhibiting at Milan AI Week
- **Pain:** No visibility into maverick spend, compliance violations cost $200K+ last year
- **Goal:** Real-time procurement dashboard with audit trails and budget enforcement
- **Tech Savviness:** High; interested in AI ROI and x402 programmable payments

### Tertiary Persona: Jean — Supplier / Vendor
- **Role:** Sales director at an industrial components supplier
- **Pain:** Responding to RFQs manually, payment delays of 45-60 days
- **Goal:** Faster quote turnaround, instant payment upon delivery confirmation
- **Tech Savviness:** Low-Moderate; uses email and basic portals

---

## 2.4 Functional Requirements

### FR-001: Multi-Agent Procurement Orchestration
The system shall operate five specialized agents coordinated by a central orchestrator:

| Agent | Role | Gemini Model | Key Capabilities |
|---|---|---|---|
| **Scout Agent** | Supplier discovery & market intelligence | Gemini 2.5 Flash (speed) | Web search, supplier DB queries, price benchmarking, RFx posting |
| **Analyst Agent** | Contract & document analysis | Gemini 2.5 Pro (deep reasoning) | PDF contract parsing, risk clause extraction, term comparison, invoice validation |
| **Negotiator Agent** | Supplier communication & deal optimization | Gemini 2.5 Pro (reasoning) | Draft counter-proposals, email negotiation, optimal timing detection |
| **Compliance Guardian** | Governance & audit enforcement | Gemini 2.5 Pro + rules engine | EU AI Act compliance checking, human-in-the-loop gating, audit logging |
| **Payment Executor** | Settlement & treasury operations | Gemini 2.5 Flash | x402 payment initiation, budget enforcement, Kraken xStops treasury mgmt |

### FR-002: x402 Agent-to-Agent Commerce
- Agents shall pay for external data/services via x402 micropayments (USDC on Base)
- Payment Executor agent shall settle supplier invoices via x402 when within policy
- System shall expose its own x402 endpoints for other agents to purchase procurement intelligence

### FR-003: Multimodal Document Processing
- Analyst Agent shall process PDF contracts (up to 100 pages) via Gemini's multimodal input
- Analyst Agent shall extract structured data from invoice images (PNG/JPG/PDF)
- Analyst Agent shall analyze supplier financial reports and compliance certificates

### FR-004: Voice-Enabled Procurement (Speechmatics)
- System shall transcribe supplier phone calls in real-time (Speechmatics WebSocket API)
- System shall extract action items and commitments from call transcripts
- Users shall initiate procurement queries via voice (e.g., "Find me three suppliers for CNC aluminum parts under €50/unit")

### FR-005: Treasury Management (Kraken xStocks)
- Payment Executor shall monitor procurement budget surplus
- Excess funds shall be automatically invested in tokenized ETFs (SPYx, QQQx) via Kraken CLI paper trading
- Treasury dashboard shall show cash position + investment P&L

### FR-006: Human-in-the-Loop Governance
- Compliance Guardian shall flag transactions exceeding €10,000 for human approval
- All agent decisions shall be logged with reasoning trace
- CFO dashboard shall show pending approvals with one-click authorize/deny
- EU AI Act Article 14 compliance: meaningful human oversight maintained

### FR-007: Real-Time Procurement Dashboard
- Web-based dashboard (deployed on Vultr) showing:
  - Active procurement workflows per agent
  - Spend analytics with budget vs. actual
  - Supplier scorecards and risk ratings
  - x402 transaction history (on-chain)
  - Compliance status and pending approvals

---

## 2.5 Non-Functional Requirements

| NFR | Requirement | How Addressed |
|---|---|---|
| **Security** | All API keys encrypted at rest, x402 payments signed locally | Vultr secure VM + local key management |
| **Scalability** | Handle 100 concurrent procurement workflows | Vultr Serverless Inference auto-scaling |
| **Availability** | 99.9% uptime during hackathon demo | Vultr Cloud VM + health checks |
| **Compliance** | EU AI Act Article 14 (human oversight), Article 26 (audit logs) | Built into Compliance Guardian agent |
| **Performance** | Contract analysis < 30 seconds for 50-page PDF | Gemini 2.5 Pro 1M context + parallel processing |
| **Cost** | x402 transactions <$0.01 per micropayment | USDC on Base L2, sub-cent fees |

---

## 2.6 Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VULTR CLOUD                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Web App    │  │  Agent      │  │  Vector DB (RAG)        │  │
│  │  (Next.js)  │  │  Orchestra- │  │  (Supabase/pgvector)    │  │
│  │             │  │  tor (Fast  │  │                         │  │
│  │  Dashboard  │  │   API)      │  │  Contract embeddings    │  │
│  │  x402 Wallet│  │             │  │  Supplier knowledge     │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────┼───────────────────────────────────┐   │
│  │           AGENT NETWORK (Collaborative System)             │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │   │
│  │  │  Scout  │ │  Analyst │ │Negotiator│ │  Compliance   │  │   │
│  │  │  Agent  │ │  Agent   │ │  Agent   │ │   Guardian    │  │   │
│  │  │(Gemini  │ │(Gemini   │ │(Gemini   │ │  (Gemini Pro  │  │   │
│  │  │ Flash)  │ │  Pro)    │ │  Pro)    │ │   + Rules)    │  │   │
│  │  └────┬────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │   │
│  │       └────────────┴────────────┴────────────────┘          │   │
│  │                         │                                   │   │
│  │                  ┌──────┴──────┐                            │   │
│  │                  │   Payment   │                            │   │
│  │                  │   Executor  │                            │   │
│  │                  │ (Gemini +   │                            │   │
│  │                  │   x402 +    │                            │   │
│  │                  │   Kraken)   │                            │   │
│  │                  └─────────────┘                            │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
┌───┴────┐        ┌──────┴──────┐       ┌──────┴──────┐
│ Gemini │        │  x402/Base  │       │ Speechmatics │
│  API   │        │   Network   │       │    API       │
│(Google)│        │  (Coinbase) │       │(Voice AI)   │
└────────┘        └─────────────┘       └─────────────┘
    │
    ├─ Gemini 2.5 Pro: Deep reasoning, contracts
    ├─ Gemini 2.5 Flash: Fast tasks, web search
    └─ Gemini Multimodal: PDF, image, audio processing
```

---

## 2.7 Data Flow — Sample Procurement Workflow

```
User: "Procure 500 CNC aluminum brackets, max €45/unit, 2-week delivery"
  │
  ▼
┌─────────────┐
│ Orchestrator│─→ Parse request, identify required agents
└──────┬──────┘
       │
  ┌────┴────┐
  ▼         ▼
┌──────┐  ┌────────┐
│Scout │  │Compliance│─→ Check: Is this category approved? Budget available?
│Agent │  │Guardian │     Risk level: Medium → Human approval NOT required
└──┬───┘  └────────┘     (Under €10K threshold)
   │
   ▼
┌──────────────────┐
│ Web search +     │─→ Discover 8 potential suppliers
│ Supplier DB query│─→ Filter by: capability, location, past performance
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ x402 micropayment│─→ Pay €0.05 per supplier credit report
│ for credit data  │─→ Retrieve D&B credit scores via x402 gateway
└────────┬─────────┘
         │
         ▼
┌──────────────┐
│ Analyst Agent│─→ Analyze credit reports, delivery history, certifications
│ (Gemini Pro) │─→ Score: Supplier A: 92/100, Supplier B: 87/100, Supplier C: 95/100
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Negotiator    │─→ Draft RFQ with technical specifications
│Agent         │─→ Send email to top 3 suppliers
│(Gemini Pro)  │─→ Receive bids: A:€42, B:€44, C:€41
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│Negotiator Agent │─→ Counter-offer to Supplier C: "Match €40 for 500 units?"
│Email thread     │─→ Supplier C accepts at €40.50/unit
└───────┬─────────┘
        │
        ▼
┌──────────────────┐
│ Compliance       │─→ Final verification: Terms within policy
│ Guardian         │─→ Generate audit trail entry
│                  │─→ Log all reasoning steps
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Payment Executor │─→ Prepare x402 payment: €20,250 + delivery confirmation trigger
│                  │─→ Hold funds in escrow via smart contract
│                  │─→ Notify user: "Procurement complete. Approval needed for payment."
└──────────────────┘
         │
         ▼
User reviews dashboard → Clicks "Authorize Payment" → x402 settlement executes
  │
  ▼
Delivery confirmed → Payment releases → Invoice auto-generated → Audit log complete
```

---

## 2.8 x402 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    x402 PAYMENT FLOWS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PAY-PER-SUPPLIER-DATA                                    │
│  ┌──────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  Scout   │ ──▶  │ Credit Report│ ──▶  │   x402       │  │
│  │  Agent   │ GET  │ API Endpoint │ 402  │  Facilitator │  │
│  └──────────┘      └──────────────┘      └──────────────┘  │
│                         │                    │               │
│                         │◄── 402 + $0.05 ───┘               │
│                         │      payment request               │
│                         │                                    │
│                         │── x402 signed payment ──▶          │
│                         │◄──── credit report ─────┘          │
│                                                              │
│  2. SUPPLIER SETTLEMENT                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐  │
│  │   Payment    │ ──▶  │   Supplier   │ ──▶  │  x402     │  │
│  │   Executor   │ POST │   Endpoint   │ 402  │ Settlement│  │
│  └──────────────┘      └──────────────┘      └───────────┘  │
│                               │                   │          │
│                               │◄── €20,250 due ──┘          │
│                               │    on delivery              │
│                               │                              │
│  Delivery oracle ── confirm ──┤                              │
│                               │── signed x402 ──▶           │
│                               │   settlement                │
│                               │◄──── receipt ─────┘         │
│                                                              │
│  3. AGENT-TO-AGENT INTELLIGENCE SALE                        │
│  ┌──────────┐      ┌──────────────────┐      ┌──────────┐  │
│  │ External │ ──▶  │ ProcureMind      │ ──▶  │  x402    │  │
│  │   Agent  │ GET  │ Intelligence API │ 402  │ Payment  │  │
│  └──────────┘      │ (market rates,   │      └──────────┘  │
│                    │  supplier scores)│                       │
└────────────────────┴──────────────────┴──────────────────────┘
```

---

## 2.9 Success Metrics (KPIs)

| Metric | Baseline (Manual) | ProcureMind Target | Measurement |
|---|---|---|---|
| RFx Cycle Time | 14-21 days | 2-3 days | Time from request to signed PO |
| Invoice Exception Rate | 15-25% | < 2% | % of invoices requiring manual intervention |
| Maverick Spend | 5-12% of spend | < 1% | Off-contract purchases detected |
| Supplier Discovery Time | 3-5 days | < 2 hours | Time to identify qualified suppliers |
| Procurement Cost per Order | €150-400 | < €25 | Fully loaded cost (labor + tools) |
| Human Approval Required | 100% of orders | 5-10% (strategic only) | % orders auto-approved within policy |
| Compliance Audit Time | 2-3 weeks preparation | Real-time | Audit trail always current |

---

## 2.10 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini API rate limits | Medium | High | Use Gemini 2.5 Flash for high-volume tasks; implement request batching |
| x402 wallet funding | Low | High | Pre-fund wallet with $50 USDC on Base for demo |
| Speechmatics integration complexity | Medium | Medium | Fallback to Gemini native audio processing; Speechmatics as enhancement |
| 6-day timeline constraint | High | High | Scope MVP to core Scout+Analyst+Payment agents; add Negotiator/Compliance as stretch |
| Demo reliability | Medium | High | Record demo video as backup; use paper trading for Kraken integration |

---

# PART 3: MASTER PROMPT

---

## 3.1 Master Prompt: End-to-End ProcureMind Nexus Build

```markdown
# MASTER PROMPT: Build "ProcureMind Nexus" — Autonomous Multi-Agent Procurement Network

## CONTEXT
You are building ProcureMind Nexus for the AI Agent Olympics Hackathon at Milan AI Week 2026.
This is a collaborative multi-agent procurement system that autonomously manages enterprise 
sourcing, contract analysis, and supplier payment settlement via x402 micropayments.

## CORE REQUIREMENTS — DO NOT MODIFY

### Technology Stack
- **LLM Engine:** Google Gemini 2.5 Pro (deep reasoning, multimodal) and Gemini 2.5 Flash (fast tasks)
- **Backend:** Python 3.11+ with FastAPI for agent orchestrator API
- **Frontend:** Next.js 14+ with TypeScript, Tailwind CSS, shadcn/ui
- **Deployment:** Vultr Cloud VM (Ubuntu 22.04) + Vultr Serverless Inference for embeddings
- **Database:** PostgreSQL with pgvector extension (Supabase or self-hosted on Vultr)
- **Vector Store:** Vultr Turnkey RAG for contract/supplier document embeddings
- **Payment Layer:** x402 protocol (USDC on Base L2) via Coinbase AgentKit SDK
- **Voice Processing:** Speechmatics real-time transcription API
- **Treasury:** Kraken CLI for xStocks paper trading integration
- **Agent Framework:** LangGraph for multi-agent orchestration with state persistence

### Agent Architecture (5 Agents + Orchestrator)

#### Agent 1: Scout Agent (Gemini 2.5 Flash)
- **Role:** Supplier discovery and market intelligence
- **Capabilities:**
  - Search web for suppliers matching procurement requirements
  - Query internal supplier database (PostgreSQL)
  - Request supplier credit reports via x402 micropayment
  - Post RFx to supplier portals
  - Return structured list: supplier_name, location, capability_score, price_estimate, delivery_time
- **State Requirements:** Maintain search context, track queried sources, log x402 payments made
- **Failure Handling:** If web search fails, fall back to internal DB; if both fail, escalate to human

#### Agent 2: Analyst Agent (Gemini 2.5 Pro — 1M context)
- **Role:** Contract analysis, document processing, risk assessment
- **Capabilities:**
  - Parse PDF contracts up to 100 pages via Gemini multimodal input
  - Extract: payment_terms, liability_clauses, termination_conditions, SLA_penalties, governing_law
  - Compare contract terms against company policy (stored in vector DB)
  - Analyze invoice images (PNG/JPG) — extract line items, validate against PO
  - Score risk 0-100 based on: financial_terms, delivery_risk, legal_exposure, supplier_stability
  - Generate natural language risk summary with specific clause references
- **State Requirements:** Store extracted contract structured data, maintain comparison history
- **Failure Handling:** If PDF parsing fails, retry with image extraction; flag unclear clauses for human review

#### Agent 3: Negotiator Agent (Gemini 2.5 Pro)
- **Role:** Supplier communication and deal optimization
- **Capabilities:**
  - Draft RFQ emails with technical specifications
  - Analyze supplier responses and identify negotiation leverage points
  - Generate counter-offers with reasoning ("Supplier A quoted €45, market rate is €41, counter at €40")
  - Maintain email thread context across multiple rounds
  - Recommend optimal award decision with justification matrix
- **State Requirements:** Track conversation history per supplier, log all proposals/counters
- **Failure Handling:** If supplier doesn't respond in 24h, send follow-up; if negotiation deadlocks, escalate

#### Agent 4: Compliance Guardian (Gemini 2.5 Pro + Rule Engine)
- **Role:** EU AI Act governance, human-in-the-loop enforcement, audit trail
- **Capabilities:**
  - Check every procurement against company spending policy (pre-loaded rules)
  - Enforce human approval for transactions > €10,000 or high-risk categories
  - Log every agent decision with: timestamp, agent_name, input_summary, reasoning_trace, output, confidence_score
  - Generate immutable audit entries (append-only, hash-chained)
  - Flag potential conflicts of interest (same supplier used too frequently)
  - Ensure EU AI Act Article 14 compliance: human can always override agent decisions
- **State Requirements:** Maintain audit log, approval queue, policy rule set
- **Failure Handling:** If compliance check is ambiguous, ALWAYS default to human approval — never auto-approve borderline cases

#### Agent 5: Payment Executor (Gemini 2.5 Flash + x402)
- **Role:** Payment settlement, budget enforcement, treasury management
- **Capabilities:**
  - Execute x402 payments for supplier invoices within approved budget
  - Monitor procurement budget consumption in real-time
  - Integrate with Kraken CLI for xStocks paper trading (invest excess budget in SPYx/QQQx)
  - Generate payment authorization requests for human approval when needed
  - Track payment status: pending → authorized → settled → confirmed
- **State Requirements:** Budget allocation, spent-to-date, pending payments, treasury positions
- **Failure Handling:** If x402 payment fails, retry once then notify; if budget exceeded, block all new payments

#### Orchestrator (LangGraph)
- **Role:** Central coordination, task decomposition, error recovery
- **Workflow Graph:**
  ```
  START → Parse Request → Compliance Check → [Parallel] → Scout Search
                                                       → Budget Check    → Synthesize Results
                                                                    → Analyst Review      → Negotiate
                                                                    → [Human Gate if needed] → Payment
                                                                    → Audit Log → END
  ```
- **State Management:** Shared context dictionary passed between nodes; PostgreSQL persistence
- **Error Recovery:** On any agent failure, retry once → if still failing, save state → notify human with context

### x402 Integration Requirements (MANDATORY)

1. **Pay-Per-Supplier-Data:**
   - Implement x402 client that can pay for external credit reports and market data
   - Budget: $0.01-$0.10 per data request
   - Track all micropayments in dashboard

2. **Supplier Settlement:**
   - Implement x402 server endpoint that receives payment for procurement intelligence
   - When supplier delivers goods, trigger x402 payment release
   - Generate payment receipts with on-chain transaction hash

3. **Agent-to-Agent Commerce:**
   - Expose API endpoint: POST /api/v1/intelligence/quote
   - Returns 402 with pricing for: supplier scores, market rates, risk assessments
   - Accepts x402 payment and returns JSON intelligence report

### Speechmatics Integration
- Real-time transcription of supplier phone calls via WebSocket API
- Extract structured action items: who, what, by_when
- Voice query interface: "ProcureMind, find me CNC suppliers under €50"

### Kraken xStocks Integration
- Paper trading only (no real funds)
- Treasury agent monitors daily procurement budget surplus
- Auto-allocate 50% of unspent daily budget to SPYx ETF via Kraken CLI
- Display P&L in treasury dashboard

### Frontend Dashboard (Next.js on Vultr)

#### Page 1: Command Center (/dashboard)
- Real-time view of all 5 agents with status indicators (idle/active/error)
- Active procurement workflows with progress bars
- Budget consumption gauge chart
- Pending human approvals with Approve/Deny buttons
- x402 transaction feed (live updates)

#### Page 2: Procurement Workflow (/procure)
- Text input for natural language procurement requests
- Voice input button (Speechmatics)
- Step-by-step workflow visualization showing agent decisions
- Final recommendation with confidence score
- Execute/Pause/Abort controls

#### Page 3: Contract Analysis (/contracts)
- PDF upload with drag-and-drop
- Gemini-powered analysis with highlighted risk clauses
- Side-by-side comparison with company policy
- Risk score visualization (radar chart)
- Export audit-ready report (PDF)

#### Page 4: Treasury & Analytics (/treasury)
- Procurement spend breakdown by category (pie chart)
- Monthly savings vs. manual baseline (line chart)
- xStocks portfolio value and P&L (paper trading)
- Supplier performance scorecards
- Compliance audit trail with search/filter

#### Page 5: Settings & Governance (/settings)
- Spending policy configuration (thresholds, approved categories)
- Agent behavior controls (auto-approve up to €X, always human for €Y+)
- x402 wallet management (balance, transaction history)
- Audit log export (CSV/JSON)
- EU AI Act compliance status dashboard

### API Endpoints (FastAPI)

```
POST   /api/v1/procure              # Initiate procurement workflow
GET    /api/v1/procure/{id}/status  # Check workflow status
POST   /api/v1/procure/{id}/approve # Human approval for gated step
POST   /api/v1/contracts/analyze    # Upload and analyze contract PDF
GET    /api/v1/suppliers/search     # Search supplier database
POST   /api/v1/agents/{id}/execute  # Direct agent command
GET    /api/v1/agents/status        # All agent statuses
GET    /api/v1/x402/balance         # x402 wallet balance
POST   /api/v1/x402/pay             # Execute x402 payment
GET    /api/v1/x402/transactions    # Payment history
GET    /api/v1/treasury/portfolio   # xStocks positions and P&L
GET    /api/v1/compliance/audit     # Full audit trail
GET    /api/v1/compliance/status    # EU AI Act compliance score
POST   /api/v1/voice/query          # Speechmatics voice query
WS     /api/v1/voice/stream         # Real-time transcription stream
```

### Data Models (PostgreSQL)

```sql
-- Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY,
    status ENUM('pending','running','paused','completed','failed'),
    request_text TEXT,
    total_budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP,
    completed_at TIMESTAMP,
    audit_log JSONB
);

-- Agent Runs
CREATE TABLE agent_runs (
    id UUID PRIMARY KEY,
    workflow_id UUID REFERENCES workflows,
    agent_name VARCHAR(50),
    input_summary TEXT,
    reasoning_trace TEXT,
    output JSONB,
    confidence_score DECIMAL(3,2),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(100),
    location VARCHAR(100),
    capability_score INT,
    risk_rating INT,
    avg_delivery_days INT,
    x402_endpoint VARCHAR(255),
    past_transactions JSONB
);

-- x402 Transactions
CREATE TABLE x402_transactions (
    id UUID PRIMARY KEY,
    workflow_id UUID,
    amount DECIMAL(12,6),
    currency VARCHAR(10),
    recipient VARCHAR(255),
    tx_hash VARCHAR(255),
    status ENUM('pending','confirmed','failed'),
    purpose VARCHAR(255),
    created_at TIMESTAMP
);

-- Audit Trail (Append-only, hash-chained)
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY,
    previous_hash VARCHAR(64),
    entry_data JSONB,
    entry_hash VARCHAR(64),
    created_at TIMESTAMP
);
```

### Environment Variables (.env)
```
# Gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL_PRO=gemini-2.5-pro-preview-05-06
GEMINI_MODEL_FLASH=gemini-2.5-flash-preview-04-17

# Vultr
VULTR_API_KEY=your_vultr_key
VULTR_INFERENCE_ENDPOINT=your_vultr_inference_url

# x402 / Coinbase
COINBASE_API_KEY=your_coinbase_key
X402_WALLET_PRIVATE_KEY=your_wallet_key
X402_FACILITATOR_URL=https://facilitator.x402.org
BASE_RPC_URL=https://mainnet.base.org

# Speechmatics
SPEECHMATICS_API_KEY=your_speechmatics_key
SPEECHMATICS_WS_URL=wss://eu2.rt.speechmatics.com/v2

# Kraken
KRAKEN_API_KEY=your_kraken_key
KRAKEN_API_SECRET=your_kraken_secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/procuremind

# App
APP_ENV=production
LOG_LEVEL=INFO
HUMAN_APPROVAL_THRESHOLD_EUR=10000
```

### Critical Implementation Rules
1. **NEVER hardcode API keys** — all secrets from environment variables
2. **ALWAYS log agent reasoning** — every decision must have traceable reasoning
3. **DEFAULT to human approval** for transactions > €10K or risk score > 70
4. **NEVER auto-approve** if Compliance Guardian flags uncertainty
5. **Implement idempotency** on all payment endpoints (prevent double-spend)
6. **Use structured output** (JSON) from Gemini for all agent-to-agent communication
7. **Implement circuit breakers** — if Gemini API fails 3x, pause and alert
8. **ALL x402 payments require signed EIP-712 messages** — private key never leaves server
9. **Audit trail is append-only** — never delete or modify audit entries
10. **Graceful degradation** — if Speechmatics fails, fall back to text input

### Submission Checklist
- [ ] GitHub repository with README, setup instructions, architecture diagram
- [ ] Vultr VM deployment with public URL
- [ ] Working demo: end-to-end procurement workflow
- [ ] x402 payment demonstration (micropayment + settlement)
- [ ] Recorded demo video (3-5 minutes)
- [ ] Architecture documentation
- [ ] EU AI Act compliance documentation
```

---

# PART 4: PHASE-WISE PROMPTS

---

## 4.1 Phase 1: Foundation & Infrastructure (Day 1-2)

```markdown
# PHASE 1 PROMPT: Project Foundation & Infrastructure Setup

## Objective
Set up the complete development environment, Vultr deployment pipeline, database schema,
and Gemini API integration layer. This phase establishes all infrastructure needed for
agent development.

## Deliverables Checklist
- [ ] Vultr Cloud VM provisioned with Ubuntu 22.04, Python 3.11, Node.js 20
- [ ] PostgreSQL + pgvector installed and configured
- [ ] FastAPI backend project scaffolded with proper structure
- [ ] Next.js frontend scaffolded with shadcn/ui, Tailwind, TypeScript
- [ ] Gemini API client implemented with retry logic and error handling
- [ ] Database migrations applied (all tables from BRD)
- [ ] Environment variables configured (never commit .env)
- [ ] CI/CD pipeline: GitHub Actions → Vultr deployment
- [ ] Health check endpoint: GET /health returns 200 OK

## Technical Specifications

### Project Structure
```
procuremind-nexus/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Pydantic settings from env
│   │   ├── database.py          # SQLAlchemy + pgvector setup
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── workflow.py
│   │   │   ├── agent_run.py
│   │   │   ├── supplier.py
│   │   │   ├── x402_tx.py
│   │   │   └── audit.py
│   │   ├── agents/              # Agent implementations
│   │   │   ├── base.py          # Base agent class
│   │   │   ├── scout.py
│   │   │   ├── analyst.py
│   │   │   ├── negotiator.py
│   │   │   ├── compliance.py
│   │   │   └── payment.py
│   │   ├── orchestrator/        # LangGraph workflow
│   │   │   ├── graph.py
│   │   │   ├── nodes.py
│   │   │   └── state.py
│   │   ├── routers/             # FastAPI route handlers
│   │   ├── services/            # Business logic
│   │   └── utils/               # Helpers, logging
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/                 # Database migrations
├── frontend/
│   ├── app/                     # Next.js app router
│   ├── components/              # shadcn/ui components
│   ├── lib/                     # API clients, utilities
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

### Implementation Steps

#### Step 1: Vultr VM Setup
```bash
# Provision VM via Vultr API or dashboard
# Size: 2 vCPU, 4GB RAM minimum
# OS: Ubuntu 22.04 LTS
# Region: Milan (closest to AI Week) or Frankfurt
# Firewall: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 8000 (API dev)

# On VM:
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y python3.11 python3.11-venv python3-pip nodejs postgresql postgresql-contrib
sudo systemctl enable postgresql

# Setup PostgreSQL with pgvector
sudo -u postgres psql -c "CREATE DATABASE procuremind;"
sudo -u postgres psql -c "CREATE USER pmuser WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE procuremind TO pmuser;"
sudo -u postgres psql procuremind -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

#### Step 2: Backend Scaffold
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy asyncpg pgvector langgraph google-generativeai pydantic-settings python-multipart aiohttp httpx

# Create config.py with Pydantic Settings
# All sensitive values from environment variables
# Validate on startup, fail fast if required vars missing
```

#### Step 3: Database Models
Implement ALL SQLAlchemy models from the BRD section exactly as specified.
Pay special attention to:
- UUID primary keys (auto-generated)
- audit_trail table: previous_hash and entry_hash fields for tamper-evident logging
- Proper indexes on: workflow_id (agent_runs), status (workflows), tx_hash (x402_transactions)

#### Step 4: Gemini Client
```python
# services/gemini_client.py
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential

class GeminiClient:
    def __init__(self, api_key: str, model_name: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate(self, prompt: str, response_schema: dict = None) -> dict:
        # Always return structured JSON when schema provided
        # Log all requests/responses for audit trail
        # Track token usage per call
        pass
    
    async def generate_multimodal(self, prompt: str, file_path: str, mime_type: str) -> dict:
        # For PDF contracts and invoice images
        # Upload file to Gemini, include in generation
        pass
```

#### Step 5: Frontend Scaffold
```bash
cd frontend
npx shadcn@latest init --yes --template next --base-color slate
npm install @radix-ui/react-* recharts lucide-react @tanstack/react-query axios zustand

# Create base layout with sidebar navigation matching BRD pages
# Implement dark/light mode toggle
# Setup API client with interceptors for auth and error handling
```

### Success Criteria
1. `GET https://your-vultr-ip/health` returns `{"status": "ok", "version": "0.1.0"}`
2. Database connection pool working, all migrations applied
3. Gemini API test call succeeds with structured JSON output
4. Frontend loads at `https://your-vultr-ip` with sidebar navigation
5. GitHub Actions workflow deploys on push to main branch

### Testing Commands
```bash
# Backend
cd backend && pytest tests/ -v

# Frontend
cd frontend && npm run build && npm run lint

# Integration
curl -X GET http://your-vultr-ip/api/health
curl -X POST http://your-vultr-ip/api/test/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Return JSON: {\"test\": \"ok\"}"}'
```
```

---

## 4.2 Phase 2: Core Agent Implementation (Day 2-3)

```markdown
# PHASE 2 PROMPT: Core Agent Implementation & Orchestration

## Objective
Implement all five specialized agents with their core capabilities and wire them together
via the LangGraph orchestrator. Focus on getting the Scout, Analyst, and Compliance
Guardian agents fully functional first (Negotiator and Payment as stretch).

## Deliverables Checklist
- [ ] Base Agent class with state management, logging, error handling
- [ ] Scout Agent: supplier discovery with web search + DB query
- [ ] Analyst Agent: PDF contract parsing + risk scoring
- [ ] Compliance Guardian: policy checking + approval gating + audit logging
- [ ] Negotiator Agent: RFQ drafting + response analysis (stretch)
- [ ] Payment Executor: x402 client + budget tracking (stretch)
- [ ] LangGraph orchestrator: workflow graph with error recovery
- [ ] Agent-to-agent structured communication protocol (JSON schemas)
- [ ] Frontend: Agent status dashboard with real-time updates

## Technical Specifications

### Base Agent Class (agents/base.py)
```python
from abc import ABC, abstractmethod
from pydantic import BaseModel
from typing import Any, Optional
import uuid
from datetime import datetime

class AgentInput(BaseModel):
    request_id: uuid.UUID
    context: dict[str, Any]  # Shared workflow context
    input_data: dict[str, Any]  # Agent-specific input
    
class AgentOutput(BaseModel):
    request_id: uuid.UUID
    agent_name: str
    status: str  # "success", "error", "escalated"
    output_data: dict[str, Any]
    reasoning_trace: str  # Natural language reasoning
    confidence_score: float  # 0.0 - 1.0
    tokens_used: int
    execution_time_ms: int
    error_message: Optional[str] = None

class BaseAgent(ABC):
    name: str
    model: str  # gemini-2.5-pro or gemini-2.5-flash
    
    def __init__(self, gemini_client, db_session, audit_logger):
        self.gemini = gemini_client
        self.db = db_session
        self.audit = audit_logger
    
    async def execute(self, input_data: AgentInput) -> AgentOutput:
        start = datetime.utcnow()
        try:
            # Pre-execution: log intent
            await self.audit.log_intent(self.name, input_data)
            
            # Execute agent-specific logic
            result = await self._run(input_data)
            
            # Post-execution: log completion
            await self.audit.log_completion(self.name, result)
            
            result.execution_time_ms = (datetime.utcnow() - start).total_seconds() * 1000
            return result
            
        except Exception as e:
            # Log error, attempt recovery, or escalate
            await self.audit.log_error(self.name, str(e), input_data)
            return self._handle_error(e, input_data)
    
    @abstractmethod
    async def _run(self, input_data: AgentInput) -> AgentOutput:
        pass
    
    def _handle_error(self, error: Exception, input_data: AgentInput) -> AgentOutput:
        # Default: retry once, then escalate to human
        pass
```

### Scout Agent (agents/scout.py)
```python
class ScoutAgent(BaseAgent):
    name = "scout"
    model = "gemini-2.5-flash"
    
    async def _run(self, input_data: AgentInput) -> AgentOutput:
        request = input_data.input_data  # e.g., {"item": "CNC aluminum brackets", "qty": 500, "max_price": 45}
        
        # Step 1: Search internal supplier database
        suppliers_db = await self._query_supplier_db(request)
        
        # Step 2: Web search for additional suppliers
        web_results = await self._web_search(request)
        
        # Step 3: For top candidates, request credit report via x402
        enriched = []
        for supplier in suppliers_db[:3]:
            credit_data = await self._get_credit_report_x402(supplier["id"])
            supplier["credit_score"] = credit_data.get("score", 50)
            enriched.append(supplier)
        
        # Step 4: Score and rank
        ranked = self._score_suppliers(enriched, request)
        
        return AgentOutput(
            request_id=input_data.request_id,
            agent_name=self.name,
            status="success",
            output_data={"suppliers": ranked, "count": len(ranked)},
            reasoning_trace=f"Found {len(ranked)} suppliers. Top: {ranked[0]['name']} (score: {ranked[0]['score']})",
            confidence_score=0.85 if len(ranked) >= 3 else 0.6,
            tokens_used=1500
        )
    
    async def _query_supplier_db(self, request: dict) -> list[dict]:
        # SQL query with filters: category match, capacity >= qty, status = active
        pass
    
    async def _web_search(self, request: dict) -> list[dict]:
        # Use Gemini's grounding with Google Search or SerpAPI
        prompt = f"""Find suppliers for {request['item']} in Europe.
        Requirements: {request['qty']} units, max €{request['max_price']} per unit.
        Return structured JSON with: name, location, website, estimated_price, delivery_days."""
        return await self.gemini.generate(prompt, response_schema=SUPPLIER_SCHEMA)
    
    async def _get_credit_report_x402(self, supplier_id: str) -> dict:
        # Call external credit data API with x402 payment
        # Return 402, sign payment, get report
        pass
    
    def _score_suppliers(self, suppliers: list[dict], request: dict) -> list[dict]:
        # Weighted scoring: price (40%), delivery (25%), credit (20%), location (15%)
        pass
```

### Analyst Agent (agents/analyst.py)
```python
class AnalystAgent(BaseAgent):
    name = "analyst"
    model = "gemini-2.5-pro"  # Deep reasoning for contracts
    
    async def _run(self, input_data: AgentInput) -> AgentOutput:
        doc_type = input_data.input_data.get("doc_type")  # "contract" or "invoice"
        
        if doc_type == "contract":
            return await self._analyze_contract(input_data)
        elif doc_type == "invoice":
            return await self._analyze_invoice(input_data)
        else:
            raise ValueError(f"Unknown doc_type: {doc_type}")
    
    async def _analyze_contract(self, input_data: AgentInput) -> AgentOutput:
        file_path = input_data.input_data["file_path"]  # PDF uploaded to temp storage
        
        # Use Gemini multimodal: upload PDF, analyze with structured prompt
        prompt = """Analyze this procurement contract PDF. Extract and return JSON:
        {
          "parties": {"buyer": "", "supplier": ""},
          "payment_terms": {"method": "", "days": 0, "currency": ""},
          "delivery_terms": {"incoterm": "", "lead_time_days": 0, "penalties": ""},
          "liability": {"cap_amount": 0, "clause_summary": ""},
          "termination": {"notice_days": 0, "conditions": []},
          "governing_law": "",
          "risk_factors": [{"severity": "high|medium|low", "description": ""}],
          "overall_risk_score": 0  // 0-100, higher = more risk
        }
        Highlight any unusual or unfavorable terms."""
        
        result = await self.gemini.generate_multimodal(prompt, file_path, "application/pdf")
        
        # Compare against company policy from vector DB
        policy_match = await self._check_policy_compliance(result)
        
        return AgentOutput(
            request_id=input_data.request_id,
            agent_name=self.name,
            status="success",
            output_data={
                "contract_analysis": result,
                "policy_compliance": policy_match,
                "recommendations": self._generate_recommendations(result, policy_match)
            },
            reasoning_trace=f"Analyzed contract: {len(result['risk_factors'])} risk factors identified. Overall risk: {result['overall_risk_score']}/100",
            confidence_score=0.9,
            tokens_used=8000  # Large context for PDF
        )
    
    async def _analyze_invoice(self, input_data: AgentInput) -> AgentOutput:
        file_path = input_data.input_data["file_path"]
        po_id = input_data.input_data.get("purchase_order_id")
        
        # Extract invoice data from image/PDF
        prompt = """Extract from this invoice image: invoice_number, date, supplier_name,
        line_items [{description, quantity, unit_price, total}], subtotal, tax, total_amount,
        payment_due_date, bank_details. Return as structured JSON."""
        
        invoice_data = await self.gemini.generate_multimodal(prompt, file_path, "image/jpeg")
        
        # Validate against purchase order
        if po_id:
            po_data = await self._get_purchase_order(po_id)
            validation = self._validate_invoice_against_po(invoice_data, po_data)
        else:
            validation = {"status": "no_po_reference", "discrepancies": []}
        
        return AgentOutput(
            request_id=input_data.request_id,
            agent_name=self.name,
            status="success",
            output_data={"invoice": invoice_data, "validation": validation},
            reasoning_trace=f"Invoice total: €{invoice_data['total_amount']}. Validation: {validation['status']}",
            confidence_score=0.88,
            tokens_used=2500
        )
```

### Compliance Guardian (agents/compliance.py)
```python
class ComplianceGuardian(BaseAgent):
    name = "compliance"
    model = "gemini-2.5-pro"
    
    # Pre-loaded company policy rules
    POLICY_RULES = {
        "max_auto_approve_eur": 10000,
        "high_risk_categories": ["IT_services", "consulting", "legal"],
        "required_approvals": ["department_head"],  # For strategic spend
        "spend_thresholds": {
            "operational": {"limit": 50000, "period": "monthly"},
            "capital": {"limit": 100000, "period": "quarterly"}
        }
    }
    
    async def _run(self, input_data: AgentInput) -> AgentOutput:
        check_type = input_data.input_data.get("check_type")
        
        if check_type == "spend_authorization":
            return await self._check_spend_authorization(input_data)
        elif check_type == "contract_review":
            return await self._check_contract_compliance(input_data)
        elif check_type == "generate_audit_entry":
            return await self._create_audit_entry(input_data)
        else:
            raise ValueError(f"Unknown check_type: {check_type}")
    
    async def _check_spend_authorization(self, input_data: AgentInput) -> AgentOutput:
        amount = input_data.input_data["amount_eur"]
        category = input_data.input_data["category"]
        requestor = input_data.input_data["requestor_id"]
        
        decisions = []
        requires_human = False
        
        # Rule 1: Amount threshold
        if amount > self.POLICY_RULES["max_auto_approve_eur"]:
            decisions.append(f"Amount €{amount} exceeds auto-approve limit (€{self.POLICY_RULES['max_auto_approve_eur']})")
            requires_human = True
        
        # Rule 2: Category risk
        if category in self.POLICY_RULES["high_risk_categories"]:
            decisions.append(f"Category '{category}' is high-risk, requires additional review")
            requires_human = True
        
        # Rule 3: Budget availability (check against running total)
        budget_status = await self._check_budget(category, amount)
        if not budget_status["available"]:
            decisions.append(f"Insufficient budget. Available: €{budget_status['remaining']}, Required: €{amount}")
            requires_human = True
        
        # Create audit entry
        audit_entry = {
            "check_type": "spend_authorization",
            "amount": amount,
            "category": category,
            "requestor": requestor,
            "decisions": decisions,
            "requires_human_approval": requires_human,
            "eu_ai_act_article": "Article 14 (human oversight)"
        }
        await self._append_audit_trail(audit_entry)
        
        return AgentOutput(
            request_id=input_data.request_id,
            agent_name=self.name,
            status="escalated" if requires_human else "success",
            output_data={
                "authorized": not requires_human,
                "reasons": decisions,
                "requires_human_approval": requires_human,
                "eu_ai_act_compliant": True
            },
            reasoning_trace="; ".join(decisions) if decisions else "All checks passed. Auto-approved.",
            confidence_score=1.0,  # Rules-based, deterministic
            tokens_used=500
        )
    
    async def _append_audit_trail(self, entry: dict) -> None:
        # Append-only log with hash chaining
        # previous_hash = SHA-256 of previous entry
        # entry_hash = SHA-256 of (previous_hash + entry_data)
        pass
```

### LangGraph Orchestrator (orchestrator/graph.py)
```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class ProcurementState(TypedDict):
    workflow_id: str
    request_text: str
    parsed_requirements: dict
    scout_results: list[dict]
    analyst_results: dict
    negotiation_results: dict
    compliance_check: dict
    payment_result: dict
    current_step: str
    human_approval_needed: bool
    human_approval_status: str  # "pending", "approved", "denied"
    error: str

# Build the graph
graph = StateGraph(ProcurementState)

# Add nodes
graph.add_node("parse_request", parse_request_node)      # Extract structured requirements
graph.add_node("compliance_precheck", compliance_pre_node)  # Initial policy check
graph.add_node("scout_search", scout_node)                 # Parallel: scout + budget check
graph.add_node("budget_check", budget_node)                # Check available budget
graph.add_node("analyze_suppliers", analyst_node)          # Analyze top suppliers
graph.add_node("human_gate", human_gate_node)             # Pause for human if needed
graph.add_node("negotiate", negotiator_node)              # Draft and send RFQ
graph.add_node("execute_payment", payment_node)           # x402 payment
graph.add_node("audit_log", audit_node)                   # Final audit entry

# Define edges
graph.set_entry_point("parse_request")
graph.add_edge("parse_request", "compliance_precheck")
graph.add_edge("compliance_precheck", "scout_search")  # If passed; else END with error
graph.add_edge("compliance_precheck", "budget_check")  # Parallel execution
graph.add_edge("scout_search", "analyze_suppliers")
graph.add_edge("budget_check", "analyze_suppliers")    # Wait for both
graph.add_edge("analyze_suppliers", "human_gate")
graph.add_conditional_edges(
    "human_gate",
    lambda state: "negotiate" if state["human_approval_status"] == "approved" or not state["human_approval_needed"] else "wait"
)
graph.add_edge("negotiate", "execute_payment")
graph.add_edge("execute_payment", "audit_log")
graph.add_edge("audit_log", END)

# Compile with checkpointing for persistence
app = graph.compile(checkpointer=checkpoint_saver)
```

### Frontend: Agent Dashboard
```typescript
// app/dashboard/page.tsx
// Real-time agent status with SSE (Server-Sent Events)
// Color-coded status: green (active), blue (idle), yellow (waiting_human), red (error)
// Each agent card shows: current task, last action, confidence score, tokens used
// Click agent card → expand to see full reasoning trace

// x402 transaction feed: scrolling list with:
// - Amount, recipient, status (pending → confirmed), tx hash link to Base explorer
// - Auto-scroll to newest, clickable for details
```

### Testing Checklist
- [ ] Scout Agent finds 3+ suppliers for "CNC aluminum brackets, 500 units, max €45"
- [ ] Analyst Agent analyzes 50-page PDF contract in < 30 seconds
- [ ] Compliance Guardian blocks €15,000 request, allows €5,000 request
- [ ] Orchestrator completes full workflow end-to-end in < 2 minutes
- [ ] Frontend dashboard shows all agents with real-time status
```

---

## 4.3 Phase 3: x402 Payments & External Integrations (Day 3-4)

```markdown
# PHASE 3 PROMPT: x402 Payment Integration & External APIs

## Objective
Implement the x402 payment client and server, integrate Kraken CLI for xStocks paper trading,
connect Speechmatics for voice processing, and wire all external services into the agent system.

## Deliverables Checklist
- [ ] x402 client: can pay for API calls via HTTP 402 handshake
- [ ] x402 server: exposes paid endpoints for procurement intelligence
- [ ] Payment Executor agent fully functional with budget tracking
- [ ] Kraken CLI integration for xStocks paper trading
- [ ] Speechmatics real-time transcription connected
- [ ] Voice query endpoint working
- [ ] Frontend: x402 wallet view, transaction history, treasury dashboard
- [ ] Vultr Serverless Inference for contract embedding RAG

## Technical Specifications

### x402 Client Implementation (services/x402_client.py)

The x402 client follows the HTTP 402 handshake protocol:

```python
import aiohttp
from eth_account import Account
import json

class X402Client:
    def __init__(self, private_key: str, facilitator_url: str):
        self.account = Account.from_key(private_key)
        self.facilitator = facilitator_url
        self.session = aiohttp.ClientSession()
    
    async def pay_for_resource(self, url: str, method: str = "GET", payload: dict = None) -> dict:
        """Execute x402 payment flow for a resource."""
        
        # Step 1: Make initial request
        async with self.session.request(method, url, json=payload) as resp:
            if resp.status != 402:
                # Not a paid resource, return normal response
                return {"status": "free", "data": await resp.json()}
            
            # Step 2: Parse 402 response for payment requirements
            payment_req = await resp.json()
            # Expected: {"payment": {"amount": "0.01", "token": "USDC", "network": "base", ...}}
            
            amount = payment_req["payment"]["amount"]
            recipient = payment_req["payment"]["recipient"]
            
            # Step 3: Check budget before signing
            if not await self._check_budget(float(amount)):
                return {"status": "budget_exceeded", "requested_amount": amount}
            
            # Step 4: Sign EIP-712 payment authorization
            signature = self._sign_payment(amount, recipient, payment_req["payment"]["chain_id"])
            
            # Step 5: Retry request with payment header
            headers = {"X-Payment-Signature": signature}
            async with self.session.request(method, url, headers=headers, json=payload) as resp2:
                if resp2.status == 200:
                    result = await resp2.json()
                    await self._deduct_budget(float(amount))
                    return {"status": "paid", "amount": amount, "data": result}
                else:
                    return {"status": "payment_failed", "code": resp2.status}
    
    def _sign_payment(self, amount: str, recipient: str, chain_id: int) -> str:
        # Create EIP-712 typed data for x402 payment
        # Sign with local private key (key NEVER sent over network)
        pass
    
    async def _check_budget(self, amount: float) -> bool:
        # Check running budget from database
        pass
```

### x402 Server Implementation (routers/x402_server.py)

```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

# Mount this as a sub-router in main FastAPI app
x402_router = APIRouter(prefix="/x402")

@x402_router.post("/intelligence/quote")
async def quote_intelligence(request: Request):
    """Return 402 with pricing for procurement intelligence."""
    
    # Check if payment header present
    payment_sig = request.headers.get("X-Payment-Signature")
    
    if not payment_sig:
        # Return 402 with payment requirements
        return JSONResponse(
            status_code=402,
            content={
                "error": "Payment Required",
                "payment": {
                    "scheme": "x402",
                    "network": "base",
                    "token": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",  # USDC on Base
                    "amount": "0.50",  # $0.50 for intelligence report
                    "recipient": "0xYourWalletAddress",
                    "chain_id": 8453,
                    "description": "Procurement intelligence report: supplier scores + market rates"
                }
            }
        )
    
    # Verify payment via facilitator
    is_valid = await verify_payment(payment_sig, expected_amount="0.50")
    
    if not is_valid:
        raise HTTPException(status_code=402, detail="Invalid payment")
    
    # Return intelligence report
    return {
        "supplier_scores": [...],
        "market_rates": {...},
        "risk_assessment": {...},
        "receipt": {"tx_hash": "0x...", "amount_paid": "0.50"}
    }

@x402_router.post("/supplier/settle")
async def settle_supplier_invoice(request: Request):
    """Receive x402 payment for supplier invoice settlement."""
    # Similar 402 handshake, but for larger amounts (e.g., €500-€5000)
    # Verify delivery confirmation before accepting payment
    pass
```

### Kraken CLI Integration (services/kraken_treasury.py)

```python
import subprocess
import json

class KrakenTreasury:
    def __init__(self):
        self.cli = "kraken"
    
    async def get_paper_balance(self) -> dict:
        """Get paper trading account balance."""
        result = subprocess.run(
            [self.cli, "paper", "balance", "-o", "json"],
            capture_output=True, text=True
        )
        return json.loads(result.stdout)
    
    async def buy_xstocks(self, symbol: str, amount_eur: float) -> dict:
        """Buy tokenized equity ETF with paper trading."""
        # e.g., kraken paper buy SPYx EUR {amount}
        result = subprocess.run(
            [self.cli, "paper", "buy", symbol, "EUR", str(amount_eur), "-o", "json"],
            capture_output=True, text=True
        )
        return json.loads(result.stdout)
    
    async def get_portfolio_pnl(self) -> dict:
        """Get portfolio value and unrealized P&L."""
        result = subprocess.run(
            [self.cli, "paper", "portfolio", "-o", "json"],
            capture_output=True, text=True
        )
        return json.loads(result.stdout)
    
    async def treasury_rebalance(self, excess_eur: float) -> dict:
        """Invest 50% of excess procurement budget into SPYx."""
        invest_amount = excess_eur * 0.5
        return await self.buy_xstocks("SPYx", invest_amount)
```

### Speechmatics Integration (services/speechmatics_client.py)

```python
import websockets
import json

class SpeechmaticsClient:
    def __init__(self, api_key: str, ws_url: str):
        self.api_key = api_key
        self.ws_url = ws_url
    
    async def stream_transcribe(self, audio_stream):
        """Real-time transcription via WebSocket."""
        async with websockets.connect(
            self.ws_url,
            extra_headers={"Authorization": f"Bearer {self.api_key}"}
        ) as ws:
            # Send configuration
            config = {
                "message": "StartRecognition",
                "audio_format": {"type": "file", "encoding": "wav", "sample_rate": 16000},
                "transcription_config": {
                    "language": "it",  # Italian for Milan AI Week
                    "enable_partials": True,
                    "diarization": "speaker"
                }
            }
            await ws.send(json.dumps(config))
            
            # Stream audio chunks and receive transcripts
            transcripts = []
            async for message in ws:
                msg = json.loads(message)
                if msg.get("message") == "AddTranscript":
                    transcripts.append({
                        "speaker": msg.get("speaker", "unknown"),
                        "text": msg["results"][0]["alternatives"][0]["transcript"],
                        "confidence": msg["results"][0]["alternatives"][0]["confidence"],
                        "is_final": not msg.get("is_partial", True)
                    })
                
                if msg.get("message") == "EndOfTranscript":
                    break
            
            return transcripts
    
    async def extract_action_items(self, transcript: list[dict]) -> list[dict]:
        """Use Gemini to extract action items from transcript."""
        full_text = "\n".join([t["text"] for t in transcript if t["is_final"]])
        
        prompt = f"""From this supplier call transcript, extract action items:
        {full_text}
        
        Return JSON array: [{{"who": "", "what": "", "by_when": "", "priority": "high|medium|low"}}]"""
        
        return await gemini_client.generate(prompt, response_schema=ACTION_ITEMS_SCHEMA)
```

### Vultr RAG Integration (services/vultr_rag.py)

```python
class VultrRAG:
    def __init__(self, inference_endpoint: str, api_key: str):
        self.endpoint = inference_endpoint
        self.api_key = api_key
    
    async def embed_contract(self, contract_text: str) -> list[float]:
        """Generate embeddings for contract clauses using Vultr Serverless Inference."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.endpoint}/embeddings",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"input": contract_text, "model": "vultr/embed-multilingual"}
            ) as resp:
                result = await resp.json()
                return result["data"][0]["embedding"]
    
    async def query_similar_clauses(self, query: str, top_k: int = 5) -> list[dict]:
        """Query vector DB for similar contract clauses (risk patterns)."""
        embedding = await self.embed_contract(query)
        # Query pgvector in PostgreSQL
        results = await db.fetch(
            "SELECT clause_text, risk_level, source_contract FROM contract_clauses ORDER BY embedding <-> $1 LIMIT $2",
            embedding, top_k
        )
        return results
```

### Frontend: Treasury Dashboard (app/treasury/page.tsx)

```typescript
// Treasury and x402 Wallet page
// Components:
// 1. x402 Wallet Card: USDC balance on Base, wallet address (truncated), add funds button
// 2. Transaction History Table: timestamp, type (pay/receive), amount, recipient, tx hash link, status
// 3. Treasury Chart: Line chart showing procurement spend vs. budget over time (monthly)
// 4. xStocks Portfolio: Current positions (SPYx, QQQx), purchase price, current value, P&L %
// 5. Rebalance Button: "Invest 50% of surplus" → triggers Kraken paper trade

// Use React Query for data fetching, auto-refresh every 30 seconds
// Use Recharts for all chart visualizations
```

### Testing Checklist
- [ ] x402 client successfully pays $0.05 for a test API call (returns 200 after payment)
- [ ] x402 server returns 402 for unauthenticated requests, 200 with valid payment
- [ ] Kraken paper trading: buy SPYx with €100, show position in portfolio
- [ ] Speechmatics transcribes 30-second Italian audio with >90% accuracy
- [ ] Voice query "Trova fornitori CNC" triggers Scout Agent and returns results
- [ ] Vultr RAG finds similar contract clauses with relevant risk patterns
```

---

## 4.4 Phase 4: Frontend Polish & Demo Preparation (Day 4-5)

```markdown
# PHASE 4 PROMPT: Frontend Completion & Demo Preparation

## Objective
Complete all frontend pages with production-quality UI, implement real-time updates,
record the demo video, and prepare all submission materials.

## Deliverables Checklist
- [ ] Command Center dashboard with live agent status (SSE)
- [ ] Procurement workflow UI with step visualization
- [ ] Contract analysis page with PDF upload + highlighting
- [ ] Treasury dashboard with charts and x402 history
- [ ] Settings and governance configuration page
- [ ] Mobile-responsive design
- [ ] Demo video recorded (3-5 minutes, showcasing end-to-end flow)
- [ ] README.md with architecture, setup instructions, screenshots
- [ ] Architecture diagram (Mermaid or drawn)
- [ ] EU AI Act compliance documentation

## Technical Specifications

### Real-Time Updates (Server-Sent Events)

```python
# backend/routers/sse.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import json

sse_router = APIRouter()

async def event_generator():
    """Stream agent status updates to frontend."""
    while True:
        # Fetch current agent statuses from database/cache
        statuses = await get_agent_statuses()
        yield f"data: {json.dumps(statuses)}\n\n"
        await asyncio.sleep(2)  # Poll every 2 seconds

@sse_router.get("/stream")
async def stream_events():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

```typescript
// frontend/hooks/useAgentStatus.ts
// Custom hook that connects to SSE endpoint
// Returns: { agents: AgentStatus[], isConnected: boolean, error: string|null }
// Auto-reconnect on disconnect
// Update Zustand store on each message
```

### Contract Analysis Page

```typescript
// app/contracts/page.tsx
// Features:
// 1. Drag-and-drop PDF upload area (react-dropzone)
// 2. Upload progress indicator
// 3. Analysis results panel:
//    - Risk score gauge (0-100, color: green <30, yellow 30-70, red >70)
//    - Extracted clauses displayed as accordion cards
//    - High-risk clauses highlighted in red with warning icon
//    - Side-by-side with company policy references
// 4. "Export Report" button → generates PDF with findings
// 5. "Compare Contracts" → upload two PDFs for term comparison
```

### Procurement Workflow Visualization

```typescript
// app/procure/page.tsx
// Step indicator showing current progress:
// [Parse] → [Comply] → [Scout] → [Analyze] → [Approve] → [Negotiate] → [Pay] → [Done]
// Current step: pulsing blue ring
// Completed steps: green checkmark
// Pending steps: gray
// Human approval gate: yellow pause icon with "Approve" / "Deny" buttons
// 
// Each step expandable to show:
// - Agent reasoning trace (collapsible text)
// - Structured output (JSON viewer)
// - Execution time and token usage
// - Confidence score badge
```

### Settings & Governance

```typescript
// app/settings/page.tsx
// Sections:
// 1. Spending Policy:
//    - Auto-approve threshold slider (€1K - €50K)
//    - High-risk category multi-select
//    - Monthly budget input per department
// 2. Agent Controls:
//    - Toggle: "Require human for all purchases > €X"
//    - Toggle: "Enable autonomous negotiation"
//    - Toggle: "Enable xStocks treasury rebalancing"
// 3. x402 Wallet:
//    - Wallet address display
//    - Current USDC balance
//    - "Add Funds" → shows QR code for Base USDC deposit
// 4. Audit Export:
//    - Date range picker
//    - Export as CSV or JSON button
//    - Compliance score indicator (EU AI Act)
```

### Demo Script (for recorded video)

```markdown
## Demo Script: "ProcureMind Nexus" (4 minutes)

### Introduction (30 seconds)
"ProcureMind Nexus is an autonomous multi-agent procurement network that reduces 
procurement cycle time by 60% and eliminates invoice exceptions. It uses specialized 
AI agents — Scout, Analyst, Negotiator, Compliance Guardian, and Payment Executor — 
that collaborate to manage the entire source-to-pay process, settling transactions 
via the x402 payment protocol on Base."

### Feature 1: Natural Language Procurement (45 seconds)
1. Open /procure page
2. Type: "I need 500 CNC aluminum brackets, max €45 per unit, delivery within 2 weeks"
3. Show: System parsing request, Scout Agent activating
4. Show: Real-time supplier discovery with x402 micropayment for credit data
5. Show: Top 3 suppliers displayed with scores, prices, delivery times

### Feature 2: Contract Analysis (45 seconds)
1. Open /contracts page
2. Upload a sample supplier contract PDF (50 pages)
3. Show: Gemini Pro analyzing with progress indicator
4. Show: Risk score gauge, highlighted risky clauses
5. Show: Comparison against company policy
6. Show: Natural language risk summary

### Feature 3: x402 Payment Settlement (45 seconds)
1. Show Compliance Guardian checking €8,000 purchase → auto-approved
2. Show Payment Executor preparing x402 transaction
3. Show signature via EIP-712, payment sent to Base
4. Show transaction confirmation with on-chain hash
5. Show treasury dashboard: budget consumed, xStocks portfolio growing

### Feature 4: Voice Query (30 seconds)
1. Click microphone button on /procure
2. Speak (in Italian): "Trova fornitori per parti CNC in alluminio"
3. Show Speechmatics real-time transcription
4. Show Scout Agent activating with Italian query
5. Show results in Italian with supplier details

### Feature 5: Governance & Audit (45 seconds)
1. Open /settings governance tab
2. Show EU AI Act compliance dashboard (all green checks)
3. Show immutable audit trail with hash chaining
4. Show human approval queue with Approve/Deny
5. Export audit log as CSV

### Closing (15 seconds)
"ProcureMind Nexus — transforming procurement from cost center to competitive advantage, 
powered by Gemini, settled on x402, governed by design."
```

### README.md Template

```markdown
# ProcureMind Nexus

## Autonomous Multi-Agent Procurement Intelligence Network

[![Vultr](https://img.shields.io/badge/Deployed%20on-Vultr-0069ff)]()
[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Pro-4285f4)]()
[![x402](https://img.shields.io/badge/Payments-x402%20Protocol-0052ff)]()

### Overview
ProcureMind Nexus automates enterprise procurement using collaborative AI agents 
that discover suppliers, analyze contracts, negotiate terms, and settle payments 
via the x402 protocol — all with built-in EU AI Act governance.

### Architecture
[Include architecture diagram image]

### Quick Start
\`\`\`bash
git clone https://github.com/yourteam/procuremind-nexus.git
cd procuremind-nexus
cp .env.example .env  # Fill in your API keys
docker-compose up -d
\`\`\`

### API Documentation
- Swagger UI: https://your-vultr-url/docs
- ReDoc: https://your-vultr-url/redoc

### Agent System
| Agent | Model | Role |
|-------|-------|------|
| Scout | Gemini 2.5 Flash | Supplier discovery |
| Analyst | Gemini 2.5 Pro | Contract analysis |
| Negotiator | Gemini 2.5 Pro | Deal optimization |
| Compliance | Gemini 2.5 Pro | Governance & audit |
| Payment | Gemini 2.5 Flash | x402 settlement |

### x402 Integration
- Client: Pays for supplier credit reports and market data
- Server: Sells procurement intelligence to external agents
- Settlement: Pays suppliers on delivery confirmation

### EU AI Act Compliance
- Human-in-the-loop for transactions > €10,000
- Immutable hash-chained audit trail
- Explainable agent reasoning for every decision
- Real-time compliance dashboard

### Team
- [Your names and roles]

### License
MIT
```

### Submission Checklist
- [ ] GitHub repository public with complete README
- [ ] Vultr deployment live at public URL
- [ ] Demo video uploaded to YouTube (unlisted or public)
- [ ] All environment variables in .env.example (no real keys)
- [ ] Architecture diagram in /docs folder
- [ ] EU AI Act compliance doc in /docs folder
- [ ] Working x402 payment demonstration
- [ ] Kraken paper trading portfolio visible
- [ ] Speechmatics voice query working
```

---

## 4.5 Phase 5: Final Polish & Submission (Day 5-6)

```markdown
# PHASE 5 PROMPT: Final Testing, Polish & Hackathon Submission

## Objective
Fix all bugs, optimize performance, ensure demo reliability, and submit the project
with all required materials. Focus on stability over new features.

## Final Testing Protocol

### Backend Tests
```bash
# Run full test suite
cd backend && pytest tests/ -v --cov=app --cov-report=term-missing

# Load test: simulate 10 concurrent procurement workflows
locust -f tests/load_test.py --host http://localhost:8000 -u 10 -r 2 --run-time 5m

# x402 payment test (testnet)
python tests/x402_integration_test.py --network base --amount 0.01

# Gemini API quota check
python tests/gemini_quota_check.py  # Ensure sufficient quota remains
```

### Frontend Tests
```bash
cd frontend && npm run test:ci
npm run build  # Must build without errors
npm run lint   # Zero linting errors

# Lighthouse audit (performance > 80, accessibility > 90)
npm run lighthouse
```

### End-to-End Demo Test
1. Clear database, reset all agent states
2. Execute complete procurement workflow 3 times consecutively without errors
3. Verify x402 payments appear on Base explorer
4. Verify Kraken paper trades show in portfolio
5. Verify Speechmatics transcription accuracy > 85%
6. Time full workflow: must complete in < 3 minutes

### Performance Optimization
- [ ] Add Redis caching for supplier DB queries (frequent lookups)
- [ ] Implement Gemini response caching for identical contract analyses
- [ ] Add database connection pooling (min 5, max 20 connections)
- [ ] Enable frontend code splitting (dynamic imports for heavy components)
- [ ] Add nginx reverse proxy with gzip compression on Vultr VM

### Bug Fixes — Priority Order
1. **CRITICAL**: Any payment-related bug (double-spend, incorrect amounts)
2. **CRITICAL**: Any security issue (exposed keys, unauthorized access)
3. **HIGH**: Workflow hangs or agent crashes
4. **HIGH**: Frontend crashes or infinite loading states
5. **MEDIUM**: Incorrect data display or formatting
6. **LOW**: UI polish, animation improvements

### Submission Materials Checklist

#### Required by Hackathon Rules
- [ ] **Project Title:** ProcureMind Nexus
- [ ] **Short Description:** (255 chars max) 
  "Autonomous multi-agent procurement network with x402 payments. Reduces procurement cycle time 60% using Gemini-powered agents for supplier discovery, contract analysis, and settlement."
- [ ] **Long Description:** (100 words min, 2000 max)
  [Write comprehensive description covering problem, solution, tech stack, x402 integration, EU AI Act compliance, and business value]
- [ ] **Cover Image:** 1200x630px, professional design showing agent network diagram
- [ ] **Video Presentation:** 3-5 minute demo (YouTube link)
- [ ] **Slide Presentation:** 10-15 slides (Google Slides or PDF)
  - Problem statement with data
  - Solution architecture
  - Agent system deep dive
  - x402 integration demonstration
  - EU AI Act compliance
  - Business value and ROI
  - Live demo screenshots
  - Team and next steps
- [ ] **Public GitHub Repository:** with README and setup docs
- [ ] **Demo Application:** Live URL on Vultr
- [ ] **Technology Tags:** Gemini 2.5 Pro, x402, Vultr, LangGraph, FastAPI, Next.js
- [ ] **Category Tags:** Enterprise Utility, Agentic Workflows, Multimodal Intelligence, Collaborative Systems

#### Social Media Posts (for Kraken Social Engagement track)
- [ ] **Twitter/X Post 1:** Architecture reveal with diagram (tag @lablabai @krakenfx @Vultr)
- [ ] **Twitter/X Post 2:** Demo video snippet — x402 payment in action
- [ ] **Twitter/X Post 3:** "How we built it" thread — technical deep dive
- [ ] **LinkedIn Post:** Professional summary targeting procurement leaders
- [ ] **Blog Post (optional):** Medium article: "Building Agent-to-Agent Commerce with x402"

### Final Deployment Verification
```bash
# On Vultr VM
curl -s https://your-domain.com/health | jq .
# Expected: {"status": "ok", "version": "1.0.0", "gemini_connected": true, "x402_wallet_balance": "45.50"}

curl -s https://your-domain.com/api/v1/agents/status | jq .
# Expected: Array of 5 agents, all "idle" status

curl -s https://your-domain.com/api/v1/compliance/status | jq .
# Expected: {"eu_ai_act_compliant": true, "audit_entries": 156, "human_overrides": 12}
```

### Backup Plan
If live demo has issues during judging:
1. Have pre-recorded video as primary demo
2. Have screenshots of every page as static fallback
3. Have Postman collection for API demonstration
4. Local Docker setup ready to run on judge's machine if needed
```

---

# APPENDIX

## A.1 Risk Assessment Matrix

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|
| Gemini API quota exhausted | Medium | Critical | Use Flash for 80% of calls; implement aggressive caching | Dev |
| x402 testnet congestion | Low | High | Pre-seed wallet with $50; test payments early | Dev |
| Speechmatics WS disconnect | Medium | Medium | Auto-reconnect with 3 retries; fallback to text input | Dev |
| Scope creep (6 days) | High | High | Strict MVP definition; Negotiator/Kraken as stretch | PM |
| Judge demo failure | Medium | High | Record video; have static screenshots; local Docker ready | PM |

## A.2 Token Budget (Gemini API Cost Estimate)

| Component | Model | Calls/Day | Tokens/Call | Daily Cost |
|---|---|---|---|---|
| Scout Agent | Flash | 200 | 2K | $0.22 |
| Analyst Agent | Pro | 50 | 20K | $1.25 |
| Negotiator | Pro | 30 | 10K | $0.38 |
| Compliance | Pro | 100 | 1K | $0.13 |
| Payment | Flash | 100 | 1K | $0.11 |
| **Total** | | **480** | | **~$2.09/day** |

With $300 Google Cloud credits: **~140 days of usage** — more than sufficient.

## A.3 Vultr Deployment Cost Estimate

| Resource | Spec | Monthly Cost |
|---|---|---|
| Cloud VM | 2 vCPU, 4GB RAM | $24 |
| Serverless Inference | Pay per token | ~$10 |
| Bandwidth | ~100GB | $10 |
| **Total** | | **~$44/month** |

With $200 Vultr credits: **~4.5 months** — sufficient for hackathon + post-event.

## A.4 EU AI Act Compliance Checklist

| Requirement | Article | Implementation | Status |
|---|---|---|---|
| Risk classification of AI system | Art. 6 | Procurement automation = limited risk | ✅ |
| Human oversight design | Art. 14 | Human gate for all >€10K transactions | ✅ |
| Transparency and explainability | Art. 13 | Reasoning trace for every agent decision | ✅ |
| Audit logging | Art. 26 | Append-only hash-chained audit trail | ✅ |
| Data governance | Art. 10 | No personal data in training; contracts encrypted | ✅ |
| Accuracy and robustness | Art. 15 | Confidence scores; fallback to human on uncertainty | ✅ |

---

*Document Version: 1.0*
*Prepared for: AI Agent Olympics Hackathon, Milan AI Week 2026*
*Last Updated: May 2026*
