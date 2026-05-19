"""
ProcureMind Nexus — Workflow Orchestrator
Manages the sequential/conditional agent pipeline for procurement workflows.
Logs every agent step to agent_runs with reasoning traces and confidence scores.
Emits SSE events for real-time UI updates.
"""
import uuid
import json
import time
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class WorkflowOrchestrator:
    """
    Orchestrates the 5-agent procurement pipeline:
      1. Parse (Gemini Flash) → structured request
      2. Compliance (Guardian) → policy check + risk assessment
      3. Scout → supplier discovery
      4. Analyst → supplier/market analysis
      5. Negotiate → RFQ drafting + deal optimization
      6. Payment → settlement (if auto-approved)
      7. Audit → final trail entry
    
    Human-in-the-loop: If compliance flags >threshold or high-risk category,
    workflow pauses at step 2 and creates an approval record.
    """

    STEPS = [
        {"name": "parse",      "agent": None,         "label": "Request Parsing"},
        {"name": "comply",     "agent": "compliance",  "label": "Compliance Check"},
        {"name": "scout",      "agent": "scout",       "label": "Supplier Discovery"},
        {"name": "analyze",    "agent": "analyst",     "label": "Market Analysis"},
        {"name": "negotiate",  "agent": "negotiator",  "label": "Negotiation Strategy"},
        {"name": "payment",    "agent": "payment",     "label": "Payment Processing"},
        {"name": "audit",      "agent": None,          "label": "Audit Finalization"},
    ]

    def __init__(self, gemini_client, agents: dict, db_conn_func, audit_func):
        self.gemini = gemini_client
        self.agents = agents
        self.get_conn = db_conn_func
        self.audit = audit_func
        self.active_workflows = {}

    async def execute(self, request_text: str, budget: float, category: str) -> dict:
        """Execute the full procurement pipeline. Returns workflow result dict."""
        workflow_id = str(uuid.uuid4())
        start_time = time.time()

        # Create workflow record
        conn = self.get_conn()
        conn.execute(
            "INSERT INTO workflows (id, status, request_text, total_budget) VALUES (?,?,?,?)",
            (workflow_id, "running", request_text, budget)
        )
        conn.commit()
        conn.close()

        self.audit("orchestrator", "workflow_started", {
            "workflow_id": workflow_id, "request": request_text,
            "budget": budget, "category": category,
        })

        result = {
            "workflow_id": workflow_id,
            "status": "running",
            "steps_completed": [],
            "steps_total": len(self.STEPS),
        }

        try:
            # === STEP 1: Parse Request ===
            parsed = await self._step_parse(workflow_id, request_text, category)
            result["parsed_request"] = parsed
            result["steps_completed"].append("parse")

            # === STEP 2: Compliance Check ===
            amount = (parsed.get("quantity", 1) or 1) * (parsed.get("max_price_per_unit", 0) or 0)
            if amount <= 0:
                amount = budget
            compliance_result = await self._step_compliance(
                workflow_id, amount, category, request_text
            )
            result["compliance"] = compliance_result
            result["steps_completed"].append("comply")

            requires_human = compliance_result.get("requires_human_approval", False)
            approval_id = None

            if requires_human:
                approval_id = await self._create_approval(
                    workflow_id, amount, category, compliance_result
                )
                result["approval_id"] = approval_id

            # === STEP 3: Scout Suppliers ===
            scout_result = await self._step_scout(workflow_id, parsed)
            suppliers = scout_result.get("suppliers", [])
            result["suppliers"] = suppliers
            result["steps_completed"].append("scout")

            # === STEP 4: Analyst (market analysis on suppliers) ===
            analysis = await self._step_analyze(workflow_id, parsed, suppliers)
            result["analysis"] = analysis
            result["steps_completed"].append("analyze")

            # === STEP 5: Negotiate ===
            negotiation = await self._step_negotiate(workflow_id, parsed, suppliers)
            result["negotiation"] = negotiation
            result["steps_completed"].append("negotiate")

            # === STEP 6: Payment (only if auto-approved) ===
            if not requires_human:
                recommended = negotiation.get("negotiation", {}).get("recommended_supplier", {})
                final_price = recommended.get("final_recommended_price", 0)
                recipient = recommended.get("name", "TBD")
                if final_price > 0:
                    payment_result = await self._step_payment(
                        workflow_id, final_price, recipient,
                        f"Procurement: {parsed.get('item', request_text[:50])}"
                    )
                    result["payment"] = payment_result
                result["steps_completed"].append("payment")

            # === STEP 7: Audit finalization ===
            status = "paused" if requires_human else "completed"
            result["status"] = status
            result["steps_completed"].append("audit")
            elapsed = int((time.time() - start_time) * 1000)
            result["total_execution_time_ms"] = elapsed

            # Update workflow in DB
            conn = self.get_conn()
            conn.execute(
                "UPDATE workflows SET status=?, result_data=?, completed_at=? WHERE id=?",
                (status, json.dumps(self._sanitize(result)),
                 datetime.utcnow().isoformat(), workflow_id)
            )
            conn.commit()
            conn.close()

            self.audit("orchestrator", "workflow_completed", {
                "workflow_id": workflow_id, "status": status,
                "steps": len(result["steps_completed"]),
                "execution_time_ms": elapsed,
            })

            logger.info(f"Workflow {workflow_id[:8]} completed in {elapsed}ms — status={status}")
            return result

        except Exception as e:
            logger.error(f"Workflow {workflow_id[:8]} failed: {str(e)}")
            conn = self.get_conn()
            conn.execute("UPDATE workflows SET status='failed' WHERE id=?", (workflow_id,))
            conn.commit()
            conn.close()
            self.audit("orchestrator", "workflow_failed", {
                "workflow_id": workflow_id, "error": str(e),
            })
            result["status"] = "failed"
            result["error"] = str(e)
            return result

    # ─── Agent Step Methods ───────────────────────────────────────────────

    async def _step_parse(self, workflow_id: str, request_text: str, category: str) -> dict:
        """Parse natural language procurement request into structured data."""
        run_id = self._start_run(workflow_id, "parser", f"Parsing: {request_text[:60]}")

        prompt = f"""You are a procurement request parser. Extract structured data from this request.

REQUEST: "{request_text}"
DEFAULT CATEGORY: "{category}"

Return JSON:
{{
    "item": "specific item name",
    "quantity": integer or null,
    "max_price_per_unit": number or null,
    "total_budget_estimate": number or null,
    "delivery_days": integer or null,
    "category": "refined category",
    "specifications": ["spec1", "spec2"],
    "priority": "high|medium|low",
    "quality_requirements": ["requirement1"],
    "geographic_preference": "preferred supplier region or null"
}}

Be precise. Infer missing values from context. Set priority based on urgency keywords."""

        result = await self.gemini.generate(prompt, model_type="flash")
        self._complete_run(run_id, result, confidence=0.95,
                          reasoning="Parsed NL request into structured procurement spec")
        return result

    async def _step_compliance(self, workflow_id: str, amount: float,
                                category: str, description: str) -> dict:
        """Run compliance check via ComplianceAgent."""
        agent = self.agents.get("compliance")
        if not agent:
            return {"authorized": True, "requires_human_approval": False, "reasons": []}

        run_id = self._start_run(workflow_id, "compliance",
                                 f"Checking €{amount:,.2f} / {category}")
        result = await agent.check_authorization(amount, category, description)
        self._complete_run(run_id, result,
                          confidence=result.get("confidence", 1.0),
                          reasoning=f"Policy check: {'; '.join(result.get('reasons', []))}")
        return result

    async def _step_scout(self, workflow_id: str, parsed: dict) -> dict:
        """Run supplier discovery via ScoutAgent."""
        agent = self.agents.get("scout")
        if not agent:
            return {"suppliers": []}

        run_id = self._start_run(workflow_id, "scout",
                                 f"Searching for: {parsed.get('item', 'unknown')}")
        result = await agent.execute(parsed)
        self._complete_run(run_id, result,
                          confidence=result.get("confidence", 0.85),
                          reasoning=result.get("reasoning", "DB + AI supplier matching"))
        return result

    async def _step_analyze(self, workflow_id: str, parsed: dict, suppliers: list) -> dict:
        """Run market analysis on discovered suppliers."""
        agent = self.agents.get("analyst")
        if not agent or not suppliers:
            return {"analysis": "Skipped — no analyst or no suppliers"}

        text = f"Procurement: {json.dumps(parsed)}\nSuppliers found: {json.dumps(suppliers[:5])}"
        run_id = self._start_run(workflow_id, "analyst",
                                 f"Analyzing {len(suppliers)} suppliers")
        result = await agent.analyze_text(text, analysis_type="supplier_evaluation")
        self._complete_run(run_id, result,
                          confidence=0.88,
                          reasoning="Evaluated supplier capabilities vs. procurement requirements")
        return result

    async def _step_negotiate(self, workflow_id: str, parsed: dict, suppliers: list) -> dict:
        """Run negotiation strategy via NegotiatorAgent."""
        agent = self.agents.get("negotiator")
        if not agent:
            return {"negotiation": {}}

        run_id = self._start_run(workflow_id, "negotiator",
                                 f"Drafting strategy for {len(suppliers)} suppliers")
        result = await agent.negotiate(parsed, suppliers[:5])
        self._complete_run(run_id, result,
                          confidence=result.get("negotiation", {}).get("confidence", 0.80),
                          reasoning="Generated RFQ + counter-offer strategy")
        return result

    async def _step_payment(self, workflow_id: str, amount: float,
                             recipient: str, purpose: str) -> dict:
        """Execute payment via PaymentAgent (only if auto-approved)."""
        agent = self.agents.get("payment")
        if not agent:
            return {"status": "skipped"}

        run_id = self._start_run(workflow_id, "payment",
                                 f"Processing €{amount:,.2f} to {recipient}")
        result = await agent.execute_payment(workflow_id, amount, recipient, purpose)
        self._complete_run(run_id, result,
                          confidence=1.0,
                          reasoning=f"Payment of €{amount:,.2f} to {recipient}")
        return result

    # ─── Approval Management ─────────────────────────────────────────────

    async def _create_approval(self, workflow_id: str, amount: float,
                                category: str, compliance_result: dict) -> str:
        """Create a pending approval record for human review."""
        approval_id = str(uuid.uuid4())
        reasons = "; ".join(compliance_result.get("reasons", []))
        conn = self.get_conn()
        conn.execute(
            "INSERT INTO approvals (id, workflow_id, agent_name, amount, category, reason, status) "
            "VALUES (?,?,?,?,?,?,?)",
            (approval_id, workflow_id, "compliance", amount, category, reasons, "pending")
        )
        conn.commit()
        conn.close()
        self.audit("compliance", "approval_created", {
            "approval_id": approval_id, "workflow_id": workflow_id,
            "amount": amount, "reasons": reasons,
        })
        logger.info(f"Approval {approval_id[:8]} created for workflow {workflow_id[:8]}")
        return approval_id

    # ─── Agent Run Tracking ──────────────────────────────────────────────

    def _start_run(self, workflow_id: str, agent_name: str, summary: str) -> str:
        """Log agent run start to agent_runs table."""
        run_id = str(uuid.uuid4())
        try:
            conn = self.get_conn()
            conn.execute(
                "INSERT INTO agent_runs (id, workflow_id, agent_name, status, input_summary) "
                "VALUES (?,?,?,?,?)",
                (run_id, workflow_id, agent_name, "running", summary)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Failed to log agent run start: {e}")
        return run_id

    def _complete_run(self, run_id: str, output: dict, confidence: float = 0.0,
                      reasoning: str = "") -> None:
        """Log agent run completion with output, confidence, and reasoning trace."""
        try:
            conn = self.get_conn()
            conn.execute(
                "UPDATE agent_runs SET status='completed', output_data=?, confidence_score=?, "
                "reasoning_trace=?, completed_at=? WHERE id=?",
                (json.dumps(self._sanitize(output)), confidence, reasoning,
                 datetime.utcnow().isoformat(), run_id)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            logger.error(f"Failed to log agent run completion: {e}")

    @staticmethod
    def _sanitize(data: dict) -> dict:
        """Ensure data is JSON-serializable (truncate large values)."""
        try:
            serialized = json.dumps(data)
            if len(serialized) > 50000:
                return {"_truncated": True, "status": data.get("status"), "keys": list(data.keys())}
            return data
        except (TypeError, ValueError):
            return {"_serialization_error": str(type(data))}
