"""
Analyst Agent - Contract analysis, document processing, risk assessment.
"""
import json
import time


class AnalystAgent:
    name = "analyst"
    description = "Contract & Document Analysis"

    def __init__(self, gemini_client, db_conn_func):
        self.gemini = gemini_client
        self.get_conn = db_conn_func
        self.status = "idle"
        self.current_task = None

    async def analyze_contract(self, file_bytes: bytes, filename: str, mime_type: str = "application/pdf") -> dict:
        self.status = "active"
        self.current_task = f"Analyzing contract: {filename}"
        start = time.time()
        try:
            prompt = """Analyze this procurement contract document thoroughly. Extract and return a JSON object:
{
    "parties": {"buyer": "", "supplier": ""},
    "contract_type": "type of contract",
    "payment_terms": {"method": "", "days": 0, "currency": "", "details": ""},
    "delivery_terms": {"incoterm": "", "lead_time_days": 0, "penalties": ""},
    "liability": {"cap_amount": 0, "clause_summary": ""},
    "termination": {"notice_days": 0, "conditions": []},
    "governing_law": "",
    "key_clauses": [{"title": "", "summary": "", "page": 0}],
    "risk_factors": [{"severity": "high|medium|low", "description": "", "clause_ref": ""}],
    "overall_risk_score": 0,
    "recommendations": ["recommendation1", "recommendation2"],
    "summary": "Executive summary of the contract"
}
Score risk 0-100 (higher = more risk). Be thorough and identify all potential risk factors."""

            result = await self.gemini.analyze_document(prompt, file_bytes, mime_type)
            elapsed = int((time.time() - start) * 1000)
            self.status = "idle"
            self.current_task = None
            return {
                "status": "success", "agent": self.name,
                "analysis": result, "execution_time_ms": elapsed,
                "confidence": 0.9, "filename": filename,
            }
        except Exception as e:
            self.status = "error"
            return {"status": "error", "agent": self.name, "error": str(e)}

    async def analyze_text(self, text: str, analysis_type: str = "general") -> dict:
        self.status = "active"
        self.current_task = f"Analyzing text: {analysis_type}"
        start = time.time()
        try:
            prompt = f"""Analyze the following procurement-related text and provide insights.
Analysis Type: {analysis_type}

TEXT:
{text}

Return JSON:
{{
    "analysis_type": "{analysis_type}",
    "key_findings": ["finding1", "finding2"],
    "risk_level": "low|medium|high",
    "risk_score": 0-100,
    "recommendations": ["rec1", "rec2"],
    "summary": "brief summary",
    "action_items": [{{"action": "", "priority": "high|medium|low", "assignee": ""}}]
}}"""
            result = await self.gemini.generate(prompt, model_type="pro")
            elapsed = int((time.time() - start) * 1000)
            self.status = "idle"
            self.current_task = None
            return {"status": "success", "agent": self.name, "analysis": result, "execution_time_ms": elapsed}
        except Exception as e:
            self.status = "error"
            return {"status": "error", "agent": self.name, "error": str(e)}
