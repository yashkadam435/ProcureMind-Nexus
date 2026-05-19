"""
ProcureMind Nexus - Database Layer (SQLite)
"""
import sqlite3
import uuid
import json
import hashlib
from datetime import datetime
from pathlib import Path

import os

if os.environ.get("VERCEL") or os.environ.get("APP_ENV") == "production":
    DB_PATH = Path("/tmp/procuremind.db")
else:
    DB_PATH = Path(__file__).parent / "procuremind.db"


def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_database():
    """Initialize all database tables."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS workflows (
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

        CREATE TABLE IF NOT EXISTS agent_runs (
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

        CREATE TABLE IF NOT EXISTS suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            location TEXT,
            capability_score INTEGER DEFAULT 50,
            risk_rating INTEGER DEFAULT 50,
            avg_delivery_days INTEGER DEFAULT 14,
            contact_email TEXT,
            website TEXT,
            certifications TEXT DEFAULT '[]',
            past_performance TEXT DEFAULT '{}',
            source TEXT DEFAULT 'internal_db',
            source_url TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE(name, location)
        );

        CREATE TABLE IF NOT EXISTS contracts (
            id TEXT PRIMARY KEY,
            workflow_id TEXT,
            supplier_id TEXT,
            filename TEXT,
            file_size INTEGER,
            analysis_data TEXT DEFAULT '{}',
            risk_score INTEGER DEFAULT 0,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT (datetime('now')),
            analyzed_at TEXT
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            workflow_id TEXT,
            amount REAL,
            currency TEXT DEFAULT 'EUR',
            recipient TEXT,
            tx_type TEXT DEFAULT 'payment',
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','failed','cancelled')),
            purpose TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS audit_trail (
            id TEXT PRIMARY KEY,
            previous_hash TEXT,
            agent_name TEXT,
            action TEXT,
            details TEXT DEFAULT '{}',
            entry_hash TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS approvals (
            id TEXT PRIMARY KEY,
            workflow_id TEXT REFERENCES workflows(id),
            agent_name TEXT,
            amount REAL,
            category TEXT,
            reason TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','denied')),
            decided_by TEXT,
            decided_at TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_agent_runs_workflow ON agent_runs(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_workflow ON transactions(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_audit_trail_created ON audit_trail(created_at);
        CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
    """)

    # Insert default settings if not exist
    defaults = {
        "auto_approve_threshold": "10000",
        "monthly_budget": "500000",
        "enable_autonomous_negotiation": "true",
        "enable_treasury_rebalance": "true",
        "high_risk_categories": json.dumps(["IT_services", "consulting", "legal"]),
        "currency": "EUR",
    }
    for key, value in defaults.items():
        cursor.execute(
            "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
            (key, value)
        )

    # Seed some initial suppliers
    seed_suppliers = [
        {"id": str(uuid.uuid4()), "name": "Precision Parts GmbH", "category": "CNC Manufacturing", "location": "Stuttgart, Germany", "capability_score": 92, "risk_rating": 15, "avg_delivery_days": 10, "contact_email": "sales@precisionparts.de", "website": "https://precisionparts.de", "certifications": json.dumps(["ISO 9001", "ISO 14001", "AS9100"]), "source": "internal_db", "source_url": "https://precisionparts.de"},
        {"id": str(uuid.uuid4()), "name": "Milano Meccanica S.r.l.", "category": "CNC Manufacturing", "location": "Milan, Italy", "capability_score": 88, "risk_rating": 20, "avg_delivery_days": 7, "contact_email": "info@milanomeccanica.it", "website": "https://milanomeccanica.it", "certifications": json.dumps(["ISO 9001", "CE Marking"]), "source": "internal_db", "source_url": "https://milanomeccanica.it"},
        {"id": str(uuid.uuid4()), "name": "TechForge Industries", "category": "Metal Fabrication", "location": "Lyon, France", "capability_score": 85, "risk_rating": 25, "avg_delivery_days": 12, "contact_email": "procurement@techforge.fr", "website": "https://techforge.fr", "certifications": json.dumps(["ISO 9001", "IATF 16949"]), "source": "internal_db", "source_url": "https://techforge.fr"},
        {"id": str(uuid.uuid4()), "name": "Nordic Components AB", "category": "Precision Engineering", "location": "Stockholm, Sweden", "capability_score": 95, "risk_rating": 10, "avg_delivery_days": 14, "contact_email": "orders@nordiccomponents.se", "website": "https://nordiccomponents.se", "certifications": json.dumps(["ISO 9001", "ISO 45001", "NADCAP"]), "source": "internal_db", "source_url": "https://nordiccomponents.se"},
        {"id": str(uuid.uuid4()), "name": "Iberian Steel Works", "category": "Metal Fabrication", "location": "Barcelona, Spain", "capability_score": 78, "risk_rating": 30, "avg_delivery_days": 15, "contact_email": "ventas@iberiansteel.es", "website": "https://iberiansteel.es", "certifications": json.dumps(["ISO 9001"]), "source": "internal_db", "source_url": "https://iberiansteel.es"},
        {"id": str(uuid.uuid4()), "name": "Dutch Precision BV", "category": "CNC Manufacturing", "location": "Eindhoven, Netherlands", "capability_score": 90, "risk_rating": 18, "avg_delivery_days": 9, "contact_email": "info@dutchprecision.nl", "website": "https://dutchprecision.nl", "certifications": json.dumps(["ISO 9001", "ISO 13485"]), "source": "internal_db", "source_url": "https://dutchprecision.nl"},
        {"id": str(uuid.uuid4()), "name": "Athena IT Solutions", "category": "IT Services", "location": "Athens, Greece", "capability_score": 82, "risk_rating": 22, "avg_delivery_days": 5, "contact_email": "hello@athenait.gr", "website": "https://athenait.gr", "certifications": json.dumps(["ISO 27001", "SOC 2 Type II"]), "source": "web_search", "source_url": "https://athenait.gr"},
        {"id": str(uuid.uuid4()), "name": "Baltic Logistics OÜ", "category": "Logistics", "location": "Tallinn, Estonia", "capability_score": 86, "risk_rating": 19, "avg_delivery_days": 3, "contact_email": "ops@balticlogistics.ee", "website": "https://balticlogistics.ee", "certifications": json.dumps(["ISO 9001", "AEO Certified", "GDP"]), "source": "trade_directory", "source_url": "https://europages.com/baltic-logistics"},
        {"id": str(uuid.uuid4()), "name": "Wiener Werkstoff AG", "category": "Raw Materials", "location": "Vienna, Austria", "capability_score": 91, "risk_rating": 12, "avg_delivery_days": 8, "contact_email": "vertrieb@wienerwerkstoff.at", "website": "https://wienerwerkstoff.at", "certifications": json.dumps(["ISO 9001", "ISO 14001", "REACH"]), "source": "internal_db", "source_url": "https://wienerwerkstoff.at"},
        {"id": str(uuid.uuid4()), "name": "Porto Digital Lda.", "category": "IT Services", "location": "Porto, Portugal", "capability_score": 80, "risk_rating": 28, "avg_delivery_days": 7, "contact_email": "info@portodigital.pt", "website": "https://portodigital.pt", "certifications": json.dumps(["ISO 27001"]), "source": "web_search", "source_url": "https://portodigital.pt"},
        {"id": str(uuid.uuid4()), "name": "Suomen Teräs Oy", "category": "Raw Materials", "location": "Helsinki, Finland", "capability_score": 89, "risk_rating": 14, "avg_delivery_days": 11, "contact_email": "myynti@suomenteras.fi", "website": "https://suomenteras.fi", "certifications": json.dumps(["ISO 9001", "ISO 14001", "EN 10204"]), "source": "trade_directory", "source_url": "https://europages.com/suomen-teras"},
        {"id": str(uuid.uuid4()), "name": "Alpine Präzision GmbH", "category": "Precision Engineering", "location": "Zurich, Switzerland", "capability_score": 96, "risk_rating": 8, "avg_delivery_days": 16, "contact_email": "kontakt@alpinepraezision.ch", "website": "https://alpinepraezision.ch", "certifications": json.dumps(["ISO 9001", "ISO 13485", "NADCAP", "AS9100"]), "source": "internal_db", "source_url": "https://alpinepraezision.ch"},
    ]

    for s in seed_suppliers:
        cursor.execute(
            """INSERT OR IGNORE INTO suppliers
               (id, name, category, location, capability_score, risk_rating, avg_delivery_days, contact_email, website, certifications, source, source_url)
               VALUES (:id, :name, :category, :location, :capability_score, :risk_rating, :avg_delivery_days, :contact_email, :website, :certifications, :source, :source_url)""",
            s
        )

    conn.commit()
    conn.close()


def append_audit_trail(agent_name: str, action: str, details: dict) -> str:
    """Append an entry to the immutable, hash-chained audit trail."""
    conn = get_connection()
    cursor = conn.cursor()

    # Get previous hash
    cursor.execute("SELECT entry_hash FROM audit_trail ORDER BY created_at DESC LIMIT 1")
    row = cursor.fetchone()
    previous_hash = row["entry_hash"] if row else "GENESIS"

    entry_id = str(uuid.uuid4())
    details_json = json.dumps(details)
    raw = f"{previous_hash}:{agent_name}:{action}:{details_json}"
    entry_hash = hashlib.sha256(raw.encode()).hexdigest()

    cursor.execute(
        """INSERT INTO audit_trail (id, previous_hash, agent_name, action, details, entry_hash)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (entry_id, previous_hash, agent_name, action, details_json, entry_hash)
    )
    conn.commit()
    conn.close()
    return entry_id
