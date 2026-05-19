"""
Scout Agent - Supplier discovery and market intelligence.
"""
import uuid
import json
import time
from datetime import datetime


class ScoutAgent:
    name = "scout"
    description = "Supplier Discovery & Market Intelligence"

    def __init__(self, gemini_client, db_conn_func):
        self.gemini = gemini_client
        self.get_conn = db_conn_func
        self.status = "idle"
        self.current_task = None

    async def execute(self, request: dict) -> dict:
        self.status = "active"
        self.current_task = f"Searching suppliers for: {request.get('item', 'unknown')}"
        start = time.time()
        try:
            db_suppliers = self._query_db(request)
            ai_result = await self._ai_search(request, db_suppliers)
            # Deduplicate: merge any overlapping suppliers from DB + AI
            raw_suppliers = ai_result.get("suppliers", db_suppliers)
            deduped = self.deduplicate(raw_suppliers)
            elapsed = int((time.time() - start) * 1000)
            self.status = "idle"
            self.current_task = None
            return {
                "status": "success",
                "agent": self.name,
                "suppliers": deduped,
                "reasoning": ai_result.get("reasoning", "Searched internal database and AI analysis"),
                "confidence": ai_result.get("confidence", 0.85),
                "execution_time_ms": elapsed,
                "tokens_used": ai_result.get("tokens_used", 500),
            }
        except Exception as e:
            self.status = "error"
            return {"status": "error", "agent": self.name, "error": str(e)}

    def _query_db(self, request: dict) -> list:
        conn = self.get_conn()
        category = request.get("category", "")
        item = request.get("item", "")
        rows = conn.execute(
            "SELECT * FROM suppliers WHERE category LIKE ? OR name LIKE ? ORDER BY capability_score DESC LIMIT 10",
            (f"%{category}%", f"%{item}%")
        ).fetchall()
        conn.close()
        result = []
        for r in rows:
            result.append({
                "id": r["id"], "name": r["name"], "category": r["category"],
                "location": r["location"], "capability_score": r["capability_score"],
                "risk_rating": r["risk_rating"], "avg_delivery_days": r["avg_delivery_days"],
                "contact_email": r["contact_email"], "website": r["website"],
                "certifications": json.loads(r["certifications"]) if r["certifications"] else [],
                "source": r["source"] if "source" in r.keys() else "internal_db",
                "source_url": r["source_url"] if "source_url" in r.keys() else "",
            })
        return result

    @staticmethod
    def deduplicate(suppliers: list) -> list:
        """Group by name+location, merge certs, keep best scores, average delivery days."""
        groups = {}
        for s in suppliers:
            key = (s.get("name", "").strip().lower(), s.get("location", "").strip().lower())
            if key in groups:
                existing = groups[key]
                existing["capability_score"] = max(existing["capability_score"], s.get("capability_score", 0))
                existing["risk_rating"] = min(existing["risk_rating"], s.get("risk_rating", 100))
                existing["avg_delivery_days"] = round((existing["avg_delivery_days"] + s.get("avg_delivery_days", 14)) / 2)
                old_certs = set(existing.get("certifications", []))
                new_certs = set(s.get("certifications", []))
                existing["certifications"] = list(old_certs | new_certs)
                if s.get("source_url") and not existing.get("source_url"):
                    existing["source_url"] = s["source_url"]
                if s.get("fit_score", 0) > existing.get("fit_score", 0):
                    existing["fit_score"] = s["fit_score"]
                    existing["recommendation"] = s.get("recommendation", "")
            else:
                groups[key] = dict(s)
        return list(groups.values())

    async def _ai_search(self, request: dict, db_results: list) -> dict:
        prompt = f"""You are a procurement intelligence agent. Analyze this procurement request and the available suppliers.

REQUEST: {json.dumps(request)}

AVAILABLE SUPPLIERS FROM DATABASE:
{json.dumps(db_results, indent=2)}

Analyze each supplier and return a JSON object with:
{{
    "suppliers": [
        {{
            "id": "supplier_id",
            "name": "supplier name",
            "category": "category",
            "location": "location",
            "capability_score": 0-100,
            "risk_rating": 0-100 (lower is better),
            "avg_delivery_days": number,
            "contact_email": "email",
            "website": "url",
            "certifications": ["cert1"],
            "price_estimate": estimated price per unit in EUR,
            "fit_score": 0-100 (how well they match the request),
            "recommendation": "brief recommendation text"
        }}
    ],
    "reasoning": "detailed reasoning about supplier selection",
    "confidence": 0.0-1.0,
    "market_insights": "brief market analysis",
    "tokens_used": 500
}}

Rank suppliers by fit_score. Add realistic price estimates based on the item and market conditions."""

        return await self.gemini.generate(prompt, model_type="flash")
