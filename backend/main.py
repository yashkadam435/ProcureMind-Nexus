"""
ProcureMind Nexus - Main FastAPI Application
Autonomous Multi-Agent Procurement Intelligence Network
"""
import os
import uuid
import json
import asyncio
import logging
from pathlib import Path
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load env
load_dotenv(Path(__file__).parent.parent / ".env")

from config import get_settings
from database import init_database, get_connection, append_audit_trail
from agents.gemini_client import GeminiClient
from agents.scout import ScoutAgent
from agents.analyst import AnalystAgent
from agents.negotiator import NegotiatorAgent
from agents.compliance import ComplianceAgent
from agents.payment import PaymentAgent
from orchestrator import WorkflowOrchestrator
from services.x402_client import X402Client
from services.speechmatics_client import SpeechmaticsClient
from services.kraken_client import KrakenClient

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("procuremind")

# Load validated config
settings = get_settings()

# Read API key — Pydantic config first, then fallback to api_key file
API_KEY = settings.GEMINI_API_KEY
if not API_KEY:
    key_file = Path(__file__).parent.parent / "api_key"
    if key_file.exists():
        API_KEY = key_file.read_text().strip()

# Initialize components
gemini = GeminiClient(API_KEY) if API_KEY else None
scout = ScoutAgent(gemini, get_connection) if gemini else None
analyst = AnalystAgent(gemini, get_connection) if gemini else None
negotiator = NegotiatorAgent(gemini, get_connection) if gemini else None
compliance = ComplianceAgent(gemini, get_connection, append_audit_trail) if gemini else None
payment = PaymentAgent(gemini, get_connection, append_audit_trail) if gemini else None

AGENTS = {"scout": scout, "analyst": analyst, "negotiator": negotiator, "compliance": compliance, "payment": payment}

# Orchestrator
orchestrator = WorkflowOrchestrator(gemini, AGENTS, get_connection, append_audit_trail) if gemini else None

# Phase 3: External Integrations
x402 = X402Client(
    wallet_key=settings.X402_WALLET_PRIVATE_KEY,
    facilitator_url=settings.X402_FACILITATOR_URL,
    rpc_url=settings.BASE_RPC_URL,
    db_conn_func=get_connection,
    audit_func=append_audit_trail,
)
speechmatics = SpeechmaticsClient(
    api_key=settings.SPEECHMATICS_API_KEY,
    ws_url=settings.SPEECHMATICS_WS_URL,
    language=settings.SPEECHMATICS_LANGUAGE,
)
kraken = KrakenClient(
    api_key=settings.KRAKEN_API_KEY,
    api_secret=settings.KRAKEN_API_SECRET,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    logger.info(f"ProcureMind Nexus started — AI Engine {'connected' if gemini else 'OFFLINE'}")
    yield
    logger.info("ProcureMind Nexus shutting down")

app = FastAPI(title="ProcureMind Nexus", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Serve frontend
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


# === MODELS ===
class ProcureRequest(BaseModel):
    request_text: str
    budget: float = 50000
    category: str = "general"

class ApprovalAction(BaseModel):
    status: str  # "approved" or "denied"
    decided_by: str = "admin"

class SettingUpdate(BaseModel):
    key: str
    value: str


# === ROUTES ===

@app.get("/")
async def root():
    index = FRONTEND_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": "ProcureMind Nexus API", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": "1.0.0",
        "gemini_connected": gemini is not None,
        "ai_engine": "Neural Core" if gemini else "offline",
        "usage": gemini.get_usage_stats() if gemini else {},
        "timestamp": datetime.utcnow().isoformat(),
    }

# --- Agent Status ---
@app.get("/api/agents/status")
async def agent_status():
    statuses = []
    for name, agent in AGENTS.items():
        if agent:
            statuses.append({
                "name": name, "display_name": agent.description,
                "status": agent.status, "current_task": agent.current_task,
                "model": "AI Flash" if name in ["scout", "payment"] else "Neural Core",
            })
    return {"agents": statuses}

# --- Agent Runs (Phase 2: reasoning traces) ---
@app.get("/api/agents/runs")
async def list_agent_runs(workflow_id: str = None, limit: int = 50):
    conn = get_connection()
    if workflow_id:
        rows = conn.execute(
            "SELECT * FROM agent_runs WHERE workflow_id=? ORDER BY started_at ASC", (workflow_id,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM agent_runs ORDER BY started_at DESC LIMIT ?", (limit,)
        ).fetchall()
    conn.close()
    runs = []
    for r in rows:
        run = dict(r)
        run["output_data"] = json.loads(run["output_data"]) if run.get("output_data") else {}
        runs.append(run)
    return {"runs": runs, "count": len(runs)}

@app.get("/api/agents/runs/{run_id}")
async def get_agent_run(run_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM agent_runs WHERE id=?", (run_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Agent run not found")
    run = dict(row)
    run["output_data"] = json.loads(run["output_data"]) if run.get("output_data") else {}
    return run

# --- Procurement Workflow (via Orchestrator) ---
@app.post("/api/procure")
async def initiate_procurement(req: ProcureRequest):
    if not orchestrator:
        raise HTTPException(500, "Gemini API not configured — cannot run agents")
    logger.info(f"Starting procurement: '{req.request_text[:60]}' budget=€{req.budget}")
    result = await orchestrator.execute(req.request_text, req.budget, req.category)
    return result

@app.get("/api/procure/{workflow_id}")
async def get_workflow(workflow_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM workflows WHERE id=?", (workflow_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Workflow not found")
    wf = dict(row)
    wf["result_data"] = json.loads(wf["result_data"]) if wf.get("result_data") else {}
    # Also get agent runs for this workflow
    conn = get_connection()
    runs = conn.execute(
        "SELECT id, agent_name, status, confidence_score, reasoning_trace, started_at, completed_at "
        "FROM agent_runs WHERE workflow_id=? ORDER BY started_at ASC", (workflow_id,)
    ).fetchall()
    conn.close()
    wf["agent_runs"] = [dict(r) for r in runs]
    return wf

@app.get("/api/workflows")
async def list_workflows():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM workflows ORDER BY created_at DESC LIMIT 50").fetchall()
    conn.close()
    return {"workflows": [dict(r) for r in rows]}

# --- Contract Analysis ---
@app.post("/api/contracts/analyze")
async def analyze_contract(file: UploadFile = File(...)):
    if not gemini:
        raise HTTPException(500, "Gemini API not configured")
    content = await file.read()
    mime = file.content_type or "application/pdf"
    logger.info(f"Analyzing contract: {file.filename} ({len(content)} bytes)")
    result = await analyst.analyze_contract(content, file.filename, mime)
    # Save to DB
    contract_id = str(uuid.uuid4())
    conn = get_connection()
    conn.execute("INSERT INTO contracts (id, filename, file_size, analysis_data, risk_score, status) VALUES (?,?,?,?,?,?)",
                 (contract_id, file.filename, len(content), json.dumps(result.get("analysis", {})),
                  result.get("analysis", {}).get("overall_risk_score", 0), "analyzed"))
    conn.commit()
    conn.close()
    append_audit_trail("analyst", "contract_analyzed", {"contract_id": contract_id, "filename": file.filename})
    result["contract_id"] = contract_id
    return result

@app.get("/api/contracts")
async def list_contracts():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM contracts ORDER BY created_at DESC LIMIT 50").fetchall()
    conn.close()
    return {"contracts": [dict(r) for r in rows]}

# --- Suppliers ---
@app.get("/api/suppliers")
async def list_suppliers():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM suppliers ORDER BY capability_score DESC").fetchall()
    conn.close()
    suppliers = []
    for r in rows:
        s = dict(r)
        s["certifications"] = json.loads(s["certifications"]) if s["certifications"] else []
        suppliers.append(s)
    return {"suppliers": suppliers}

@app.get("/api/suppliers/search")
async def search_suppliers(q: str = ""):
    conn = get_connection()
    rows = conn.execute("SELECT * FROM suppliers WHERE name LIKE ? OR category LIKE ? OR location LIKE ? ORDER BY capability_score DESC",
                        (f"%{q}%", f"%{q}%", f"%{q}%")).fetchall()
    conn.close()
    suppliers = []
    for r in rows:
        s = dict(r)
        s["certifications"] = json.loads(s["certifications"]) if s["certifications"] else []
        suppliers.append(s)
    return {"suppliers": suppliers}

# --- Approvals ---
@app.get("/api/approvals")
async def list_approvals():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM approvals ORDER BY created_at DESC LIMIT 50").fetchall()
    conn.close()
    return {"approvals": [dict(r) for r in rows]}

@app.post("/api/approvals/{approval_id}")
async def decide_approval(approval_id: str, action: ApprovalAction):
    conn = get_connection()
    conn.execute("UPDATE approvals SET status=?, decided_by=?, decided_at=? WHERE id=?",
                 (action.status, action.decided_by, datetime.utcnow().isoformat(), approval_id))
    row = conn.execute("SELECT workflow_id FROM approvals WHERE id=?", (approval_id,)).fetchone()
    if row:
        new_status = "completed" if action.status == "approved" else "failed"
        conn.execute("UPDATE workflows SET status=? WHERE id=?", (new_status, row["workflow_id"]))
    conn.commit()
    conn.close()
    append_audit_trail("compliance", f"approval_{action.status}", {"approval_id": approval_id, "decided_by": action.decided_by})
    return {"status": "ok", "approval_id": approval_id, "decision": action.status}

# --- Transactions & Treasury ---
@app.get("/api/transactions")
async def list_transactions():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100").fetchall()
    conn.close()
    return {"transactions": [dict(r) for r in rows]}

@app.get("/api/treasury/budget")
async def budget_status():
    return await payment.get_budget_status()

@app.get("/api/treasury/portfolio")
async def treasury_portfolio():
    return kraken.get_portfolio()

@app.get("/api/treasury/history/{symbol}")
async def price_history(symbol: str, periods: int = 24):
    return {"symbol": symbol, "history": kraken.get_price_history(symbol, periods)}

@app.get("/api/treasury/analytics")
async def spend_analytics():
    return kraken.get_spend_analytics()

# --- Compliance & Audit ---
@app.get("/api/compliance/status")
async def compliance_status():
    return await compliance.get_compliance_status()

@app.get("/api/compliance/audit")
async def audit_trail(limit: int = 100):
    conn = get_connection()
    rows = conn.execute("SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    entries = []
    for r in rows:
        e = dict(r)
        e["details"] = json.loads(e["details"]) if e["details"] else {}
        entries.append(e)
    return {"audit_trail": entries, "count": len(entries)}

# --- Settings ---
@app.get("/api/settings")
async def get_app_settings():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM settings").fetchall()
    conn.close()
    return {"settings": {r["key"]: r["value"] for r in rows}}

@app.post("/api/settings")
async def update_setting(setting: SettingUpdate):
    conn = get_connection()
    conn.execute("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)",
                 (setting.key, setting.value, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return {"status": "ok", "key": setting.key, "value": setting.value}

# --- SSE Stream ---
@app.get("/api/stream")
async def event_stream():
    async def generate():
        while True:
            statuses = []
            for name, agent in AGENTS.items():
                if agent:
                    statuses.append({"name": name, "status": agent.status, "current_task": agent.current_task})
            yield f"data: {json.dumps(statuses)}\n\n"
            await asyncio.sleep(2)
    return StreamingResponse(generate(), media_type="text/event-stream")

# --- Analytics ---
@app.get("/api/analytics/dashboard")
async def dashboard_analytics():
    conn = get_connection()
    total_workflows = conn.execute("SELECT COUNT(*) as c FROM workflows").fetchone()["c"]
    completed = conn.execute("SELECT COUNT(*) as c FROM workflows WHERE status='completed'").fetchone()["c"]
    total_spent = conn.execute("SELECT COALESCE(SUM(amount),0) as s FROM transactions WHERE status='confirmed'").fetchone()["s"]
    supplier_count = conn.execute("SELECT COUNT(*) as c FROM suppliers").fetchone()["c"]
    pending_approvals = conn.execute("SELECT COUNT(*) as c FROM approvals WHERE status='pending'").fetchone()["c"]
    contract_count = conn.execute("SELECT COUNT(*) as c FROM contracts").fetchone()["c"]
    agent_run_count = conn.execute("SELECT COUNT(*) as c FROM agent_runs").fetchone()["c"]
    recent_tx = conn.execute("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5").fetchall()
    conn.close()
    budget = await payment.get_budget_status()
    return {
        "total_workflows": total_workflows, "completed_workflows": completed,
        "total_spent": total_spent, "supplier_count": supplier_count,
        "pending_approvals": pending_approvals, "contract_count": contract_count,
        "agent_runs": agent_run_count,
        "budget": budget, "recent_transactions": [dict(r) for r in recent_tx],
        "ai_usage": gemini.get_usage_stats() if gemini else {},
    }

# --- Phase 3: x402 Payments ---
@app.post("/api/x402/pay")
async def x402_payment(amount: float = 0.05, supplier: str = "data-provider",
                       purpose: str = "credit_report", workflow_id: str = None):
    """Execute x402 micropayment for supplier intelligence data."""
    result = await x402.pay_for_data(
        supplier_endpoint=supplier, amount_usdc=amount,
        purpose=purpose, workflow_id=workflow_id,
    )
    return result

@app.get("/api/x402/stats")
async def x402_stats():
    return x402.get_stats()

# --- Phase 3: Voice Transcription ---
@app.get("/api/voice/config")
async def voice_config():
    """Return voice transcription configuration for the frontend."""
    config = speechmatics.get_config()
    config["ws_auth_url"] = speechmatics.get_ws_auth_url()
    config["ws_config_message"] = speechmatics.get_ws_config_message()
    return config

class VoiceTranscription(BaseModel):
    text: str

@app.post("/api/voice/process")
async def process_voice(transcription: VoiceTranscription):
    """Process a voice transcription into a structured procurement request."""
    result = await speechmatics.process_transcription(transcription.text, gemini)
    return result

class VoiceSettings(BaseModel):
    language: str = None
    confidence_threshold: float = None

@app.post("/api/voice/settings")
async def update_voice_settings(settings_data: VoiceSettings):
    """Update voice transcription settings."""
    speechmatics.update_settings(
        language=settings_data.language,
        confidence_threshold=settings_data.confidence_threshold,
    )
    return {"status": "ok", "config": speechmatics.get_config()}

# --- Phase 3: Integration Status ---
@app.get("/api/integrations")
async def integration_status():
    """Return status of all external integrations."""
    return {
        "x402": x402.get_stats(),
        "speechmatics": speechmatics.get_config(),
        "kraken": kraken.get_stats(),
        "ai_engine": gemini.get_usage_stats() if gemini else {},
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
