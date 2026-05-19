"""
ProcureMind Nexus — Configuration Manager
Validates all environment variables at startup using Pydantic Settings.
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application configuration — all values from environment variables."""

    # Gemini (Required)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL_PRO: str = "gemini-2.5-pro-preview-05-06"
    GEMINI_MODEL_FLASH: str = "gemini-2.5-flash-preview-05-20"

    # x402 / Coinbase (Optional)
    COINBASE_API_KEY: str = ""
    X402_WALLET_PRIVATE_KEY: str = ""
    X402_FACILITATOR_URL: str = "https://facilitator.x402.org"
    BASE_RPC_URL: str = "https://mainnet.base.org"

    # Speechmatics (Optional)
    SPEECHMATICS_API_KEY: str = ""
    SPEECHMATICS_WS_URL: str = "wss://eu2.rt.speechmatics.com/v2"
    SPEECHMATICS_LANGUAGE: str = "en"

    # Kraken (Optional)
    KRAKEN_API_KEY: str = ""
    KRAKEN_API_SECRET: str = ""

    # Vultr (Optional)
    VULTR_API_KEY: str = ""
    VULTR_INFERENCE_ENDPOINT: str = ""

    # App
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    HUMAN_APPROVAL_THRESHOLD_EUR: float = 10000.0

    model_config = {
        "env_file": str(Path(__file__).parent.parent / ".env"),
        "case_sensitive": True,
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    # Fallback: read Speechmatics key from speechmatics-api.txt if not in .env
    if not settings.SPEECHMATICS_API_KEY:
        txt_path = Path(__file__).parent.parent / "speechmatics-api.txt"
        if txt_path.exists():
            try:
                content = txt_path.read_text().strip()
                # Parse "speechmatics api key = XXXX" format
                if "=" in content:
                    key = content.split("=", 1)[1].strip()
                    if key:
                        settings.SPEECHMATICS_API_KEY = key
            except Exception:
                pass
    return settings
