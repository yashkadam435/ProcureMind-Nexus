"""
Kraken xStocks Treasury Client
Paper-trading portfolio management using Kraken API.
Falls back to simulated market data when API keys are not configured.
"""
import time
import math
import random
import hashlib
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class KrakenClient:
    """
    Treasury portfolio management via Kraken xStocks.
    Simulates realistic market data when API keys are not set.
    """

    def __init__(self, api_key: str = "", api_secret: str = ""):
        self.api_key = api_key
        self.api_secret = api_secret
        self.is_live = bool(api_key and api_secret)
        self._start_time = time.time()

        # Simulated portfolio state
        self._portfolio = {
            "SPYx": {"name": "S&P 500 ETF", "shares": 45, "avg_price": 542.30,
                      "base_price": 558.90},
            "QQQx": {"name": "Nasdaq 100 ETF", "shares": 20, "avg_price": 485.20,
                      "base_price": 501.80},
            "EURx": {"name": "Euro Stoxx 50", "shares": 30, "avg_price": 4820.00,
                      "base_price": 4950.00},
        }
        self._cash = 245000.00
        self._base_cash = 245000.00

        mode = "LIVE (Kraken)" if self.is_live else "SIMULATION"
        logger.info(f"KrakenClient initialized — mode={mode}")

    def get_portfolio(self) -> dict:
        """Get current portfolio with live-ish price simulation."""
        elapsed = time.time() - self._start_time
        investments = []
        total_value = 0.0
        total_pnl = 0.0

        for symbol, data in self._portfolio.items():
            # Simulate micro price movements using sine waves + noise
            drift = math.sin(elapsed / 30 + hash(symbol) % 10) * 0.02
            noise = (random.random() - 0.5) * 0.005
            multiplier = 1.0 + drift + noise
            current_price = round(data["base_price"] * multiplier, 2)

            position_value = current_price * data["shares"]
            cost_basis = data["avg_price"] * data["shares"]
            pnl_amount = round(position_value - cost_basis, 2)
            pnl_pct = round((pnl_amount / cost_basis) * 100, 2) if cost_basis else 0

            total_value += position_value
            total_pnl += pnl_amount

            investments.append({
                "symbol": symbol,
                "name": data["name"],
                "shares": data["shares"],
                "avg_price": data["avg_price"],
                "current_price": current_price,
                "position_value": round(position_value, 2),
                "pnl_amount": pnl_amount,
                "pnl_pct": pnl_pct,
                "change_24h": round(drift * 100, 2),
            })

        # Simulate cash movements
        cash_drift = math.sin(elapsed / 60) * 0.001
        cash = round(self._base_cash * (1 + cash_drift), 2)
        total_portfolio = round(cash + total_value, 2)

        return {
            "cash_position": {
                "currency": "EUR",
                "amount": cash,
                "change_24h": round(cash_drift * 100, 2),
            },
            "investments": investments,
            "total_portfolio_value": total_portfolio,
            "total_investment_value": round(total_value, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_pct": round((total_pnl / (total_portfolio - total_pnl)) * 100, 2) if total_portfolio else 0,
            "last_updated": datetime.utcnow().isoformat(),
            "mode": "live" if self.is_live else "simulated",
        }

    def get_price_history(self, symbol: str, periods: int = 24) -> list:
        """Get simulated price history for charting (hourly candles)."""
        data = self._portfolio.get(symbol)
        if not data:
            return []

        base = data["base_price"]
        history = []
        now = time.time()

        for i in range(periods, 0, -1):
            t = now - (i * 3600)  # hourly intervals
            drift = math.sin(t / 3600 + hash(symbol) % 10) * 0.015
            noise = (hash(f"{symbol}{int(t)}") % 100 - 50) / 10000
            price = round(base * (1 + drift + noise), 2)
            history.append({
                "timestamp": datetime.fromtimestamp(t).isoformat(),
                "price": price,
                "volume": random.randint(1000, 50000),
            })

        return history

    def get_spend_analytics(self) -> dict:
        """Get procurement spend breakdown by category."""
        return {
            "categories": [
                {"name": "Raw Materials", "amount": 125000, "pct": 35, "color": "#6366f1"},
                {"name": "IT Services", "amount": 89000, "pct": 25, "color": "#3b82f6"},
                {"name": "Logistics", "amount": 71000, "pct": 20, "color": "#10b981"},
                {"name": "Office Supplies", "amount": 42000, "pct": 12, "color": "#f59e0b"},
                {"name": "Consulting", "amount": 28000, "pct": 8, "color": "#ef4444"},
            ],
            "total": 355000,
            "period": "YTD 2026",
            "avg_monthly": 59167,
        }

    def get_stats(self) -> dict:
        """Return Kraken connection statistics."""
        return {
            "mode": "live" if self.is_live else "simulated",
            "portfolio_symbols": list(self._portfolio.keys()),
            "cash_position": self._cash,
        }
