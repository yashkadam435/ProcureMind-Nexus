"""
Speechmatics Real-Time Voice Transcription Client
Streams audio from browser microphone → Speechmatics WebSocket → procurement request.
Falls back to browser Web Speech API when API key is not configured.
"""
import json
import logging
import asyncio
from typing import Optional

logger = logging.getLogger(__name__)


class SpeechmaticsClient:
    """
    Real-time speech-to-text via Speechmatics WebSocket API.
    When API key is not set, returns a flag telling the frontend
    to use the browser's built-in Web Speech API instead.
    """

    def __init__(self, api_key: str = "", ws_url: str = "", language: str = "en"):
        self.api_key = api_key
        self.ws_url = ws_url or "wss://eu2.rt.speechmatics.com/v2"
        self.language = language
        self.is_live = bool(api_key)
        self.total_transcriptions = 0
        self.total_audio_seconds = 0.0
        self.confidence_threshold = 0.7
        mode = "LIVE (Speechmatics)" if self.is_live else "BROWSER (Web Speech API)"
        logger.info(f"SpeechmaticsClient initialized — mode={mode}")

    def get_config(self) -> dict:
        """Return client configuration for the frontend."""
        return {
            "mode": "speechmatics" if self.is_live else "browser",
            "ws_url": self.ws_url if self.is_live else None,
            "api_key_hint": f"{self.api_key[:4]}...{self.api_key[-4:]}" if self.is_live else None,
            "language": self.language,
            "model": "enhanced" if self.is_live else "browser-default",
            "confidence_threshold": self.confidence_threshold,
            "supported_languages": [
                {"code": "en", "name": "English"},
                {"code": "de", "name": "German"},
                {"code": "fr", "name": "French"},
                {"code": "es", "name": "Spanish"},
                {"code": "it", "name": "Italian"},
                {"code": "nl", "name": "Dutch"},
                {"code": "pt", "name": "Portuguese"},
                {"code": "sv", "name": "Swedish"},
            ],
            "total_transcriptions": self.total_transcriptions,
            "total_audio_seconds": round(self.total_audio_seconds, 1),
        }

    def get_ws_auth_url(self) -> str:
        """Return full WebSocket URL with auth query parameter."""
        if not self.is_live:
            return ""
        return f"{self.ws_url}?jwt={self.api_key}"

    def get_ws_auth_headers(self) -> dict:
        """Return WebSocket auth headers for Speechmatics connection."""
        if not self.is_live:
            return {}
        return {"Authorization": f"Bearer {self.api_key}"}

    def get_ws_config_message(self, language: str = None) -> dict:
        """Return the initial config message to send on WebSocket connect."""
        lang = language or self.language
        return {
            "message": "StartRecognition",
            "transcription_config": {
                "language": lang,
                "operating_point": "enhanced",
                "enable_partials": True,
                "max_delay": 2.0,
                "diarization": "speaker",
            },
            "audio_format": {
                "type": "raw",
                "encoding": "pcm_f32le",
                "sample_rate": 16000,
            },
        }

    def update_settings(self, language: str = None, confidence_threshold: float = None):
        """Update runtime settings."""
        if language:
            self.language = language
        if confidence_threshold is not None:
            self.confidence_threshold = max(0.0, min(1.0, confidence_threshold))

    async def process_transcription(self, text: str, gemini_client=None) -> dict:
        """
        Process a completed transcription — parse it into a procurement request
        using AI Engine for NLU.
        """
        self.total_transcriptions += 1

        if not text or len(text.strip()) < 5:
            return {"status": "error", "message": "Transcription too short"}

        # Use AI Engine to parse the voice input into structured procurement data
        if gemini_client:
            prompt = f"""You are a procurement assistant that processes voice commands.
Convert this spoken request into a structured procurement request.

VOICE INPUT: "{text}"

Return JSON:
{{
    "request_text": "clean, formal version of the request",
    "item": "specific item name",
    "quantity": integer or null,
    "budget": estimated budget in EUR or null,
    "category": "best matching category: general|CNC Manufacturing|Metal Fabrication|Precision Engineering|IT Services|Raw Materials|Logistics",
    "priority": "high|medium|low",
    "confidence": 0.0-1.0 (how confident you are in the parsing)
}}"""
            result = await gemini_client.generate(prompt, model_type="flash")
            result["source"] = "voice"
            result["original_transcription"] = text
            return result

        # Fallback: return raw text
        return {
            "request_text": text,
            "item": text,
            "quantity": None,
            "budget": None,
            "category": "general",
            "priority": "medium",
            "confidence": 0.5,
            "source": "voice",
            "original_transcription": text,
        }
