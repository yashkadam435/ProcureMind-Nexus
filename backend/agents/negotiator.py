"""
Negotiator Agent - Supplier communication and deal optimization.
"""
import json
import time


class NegotiatorAgent:
    name = "negotiator"
    description = "Supplier Negotiation & Deal Optimization"

    def __init__(self, gemini_client, db_conn_func):
        self.gemini = gemini_client
        self.get_conn = db_conn_func
        self.status = "idle"
        self.current_task = None

    async def negotiate(self, request: dict, suppliers: list) -> dict:
        self.status = "active"
        self.current_task = "Drafting negotiation strategy"
        start = time.time()
        try:
            prompt = f"""You are an expert procurement negotiator. Based on the procurement request and supplier data, create a negotiation strategy.

PROCUREMENT REQUEST: {json.dumps(request)}
SUPPLIERS: {json.dumps(suppliers, indent=2)}

Return JSON:
{{
    "strategy": "overall negotiation strategy description",
    "rfq_draft": {{
        "subject": "RFQ email subject",
        "body": "Professional RFQ email body",
        "terms_requested": ["term1", "term2"]
    }},
    "supplier_analysis": [
        {{
            "supplier_name": "name",
            "leverage_points": ["point1"],
            "suggested_counter_offer": 0.0,
            "negotiation_approach": "approach description",
            "expected_outcome": "expected final price"
        }}
    ],
    "recommended_supplier": {{
        "name": "best supplier name",
        "reason": "why this supplier",
        "estimated_savings": "estimated savings percentage",
        "final_recommended_price": 0.0
    }},
    "timeline": "expected negotiation timeline",
    "confidence": 0.0-1.0
}}"""
            result = await self.gemini.generate(prompt, model_type="pro")
            elapsed = int((time.time() - start) * 1000)
            self.status = "idle"
            self.current_task = None
            return {"status": "success", "agent": self.name, "negotiation": result, "execution_time_ms": elapsed}
        except Exception as e:
            self.status = "error"
            return {"status": "error", "agent": self.name, "error": str(e)}
