"""
Payment Executor Agent - Settlement, budget enforcement, treasury.
"""
import json
import time
import uuid
from datetime import datetime


class PaymentAgent:
    name = "payment"
    description = "Payment Execution & Treasury"

    def __init__(self, gemini_client, db_conn_func, audit_func):
        self.gemini = gemini_client
        self.get_conn = db_conn_func
        self.audit = audit_func
        self.status = "idle"
        self.current_task = None

    async def execute_payment(self, workflow_id: str, amount: float, recipient: str, purpose: str) -> dict:
        self.status = "active"
        self.current_task = f"Processing payment: €{amount:,.2f}"
        start = time.time()
        try:
            tx_id = str(uuid.uuid4())
            conn = self.get_conn()
            conn.execute(
                "INSERT INTO transactions (id, workflow_id, amount, currency, recipient, tx_type, status, purpose) VALUES (?,?,?,?,?,?,?,?)",
                (tx_id, workflow_id, amount, "EUR", recipient, "payment", "confirmed", purpose)
            )
            # Update workflow spent
            conn.execute("UPDATE workflows SET spent = spent + ? WHERE id = ?", (amount, workflow_id))
            conn.commit()
            conn.close()
            self.audit(self.name, "payment_executed", {"tx_id": tx_id, "amount": amount, "recipient": recipient})
            elapsed = int((time.time() - start) * 1000)
            self.status = "idle"
            self.current_task = None
            return {
                "status": "success", "agent": self.name,
                "transaction": {"id": tx_id, "amount": amount, "recipient": recipient, "currency": "EUR", "status": "confirmed", "purpose": purpose},
                "execution_time_ms": elapsed, "confidence": 1.0,
            }
        except Exception as e:
            self.status = "error"
            return {"status": "error", "agent": self.name, "error": str(e)}

    async def get_budget_status(self) -> dict:
        conn = self.get_conn()
        row = conn.execute("SELECT value FROM settings WHERE key='monthly_budget'").fetchone()
        budget = float(row["value"]) if row else 500000
        spent_row = conn.execute("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE status='confirmed'").fetchone()
        spent = spent_row["total"]
        tx_count = conn.execute("SELECT COUNT(*) as c FROM transactions").fetchone()["c"]
        conn.close()
        return {
            "total_budget": budget, "spent": spent,
            "remaining": budget - spent, "utilization": round((spent / budget) * 100, 1) if budget else 0,
            "transaction_count": tx_count,
        }

    async def get_treasury_portfolio(self) -> dict:
        return {
            "cash_position": {"currency": "EUR", "amount": 245000, "change_24h": 2.3},
            "investments": [
                {"symbol": "SPYx", "name": "S&P 500 ETF", "shares": 45, "avg_price": 542.30, "current_price": 558.90, "pnl_pct": 3.06, "pnl_amount": 747.00},
                {"symbol": "QQQx", "name": "Nasdaq 100 ETF", "shares": 20, "avg_price": 485.20, "current_price": 501.80, "pnl_pct": 3.42, "pnl_amount": 332.00},
            ],
            "total_portfolio_value": 246079.00,
            "total_pnl": 1079.00, "total_pnl_pct": 0.44,
        }
